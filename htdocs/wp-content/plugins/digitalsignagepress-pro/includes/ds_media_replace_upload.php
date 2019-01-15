<?php
defined( 'ABSPATH' ) or die();
if (!current_user_can('upload_files')) {
	wp_die(__('You do not have permission to upload files.', 'digitalsignagepress'));
}
global $wpdb;
if (isset($_POST['attachment_id'])) {
	$attachment_id = $_POST['attachment_id'];
	$row = $wpdb->get_row($wpdb->prepare('SELECT guid, post_mime_type FROM '.$wpdb->prefix.'posts WHERE ID = %d', $attachment_id), ARRAY_A);
} else if (isset($_GET['attachment_id'])) {
	$attachment_id = $_GET['attachment_id'];
	$row = $wpdb->get_row($wpdb->prepare('SELECT guid, post_mime_type FROM '.$wpdb->prefix.'posts WHERE ID = %d', $attachment_id), ARRAY_A);
}
if (!isset($row)) {
	wp_die(__('Could not find file to replace.', 'digitalsignagepress'));
} else {
	$previous_guid = $old_filename = $row['guid'];
	$previous_mime = $row['post_mime_type'];
	$previous_filename = substr($previous_guid, (strrpos($previous_guid, '/') + 1));

	$previous_file = get_attached_file($attachment_id);
	if (!isset($previous_file) || empty($previous_file)) {
		wp_die(__('Could not find file to replace.', 'digitalsignagepress'));
	}
	$previous_path = substr($previous_file, 0, (strrpos($previous_file, '/')));
	$previous_file = str_replace('//', '/', $previous_file);
	$previous_filename = basename($previous_file);
	if (is_uploaded_file($_FILES['replacementfile']['tmp_name'])) {
		$filedata = wp_check_filetype_and_ext($_FILES['replacementfile']['tmp_name'], $_FILES['replacementfile']['name']);
		if ($filedata['ext'] == '') {
			wp_die(__('File not usable. Unknown extension.', 'digitalsignagepress'));
		}
		function signage_clear_files($previous_file, $previous_filename, $previous_mime, $attachment_id) {
			$previous_path = substr($previous_file, 0, (strrpos($previous_file, "/")));
			if (file_exists($previous_file)) {
				clearstatcache();
				if (!is_writable($previous_file) || !unlink($previous_file)) {
					wp_die($previous_file.__(' could not be deleted, please check file permissions.', 'digitalsignagepress'));
				}
			}
			if (empty($previous_mime)) {
				$mime = explode('.', $previous_filename);
				if (count($mime) > 1) {
					$suffix = '.'.strtolower($mime[1]);
				} else {
					$suffix = '.NOT_SUPPORTED';
				}
				$img_types = array('.png', '.gif', '.jpg', '.jpeg');
				if (in_array($suffix, $img_types)) {
					$mime = 'image';
				} else {
					$mime = 'other';
				}
			} else {
				$mime = explode('/', $previous_mime);
				$mime = $mime[0];
			}
			if ($mime == 'image') { 
				$metadata = wp_get_attachment_metadata($attachment_id);
				if (is_array($metadata)) {
					foreach($metadata['sizes'] as $metadata_size) {
						if (strlen($metadata_size['file'])) {
							$metadata_file = $previous_path.'/'.$metadata_size['file'];
							if (file_exists($metadata_file)) {
								unlink($metadata_file);
							}
						}
					}
				}
			}
		}
		$new_filename = $_FILES['replacementfile']['name'];
		$new_filesize = $_FILES['replacementfile']['size'];
		$new_filetype = $filedata['type'];
		$original_file_perms = fileperms($previous_file) & 0777;
		$post_meta_before = get_post_meta($attachment_id, '_wp_attachment_metadata', true);
		signage_clear_files($previous_file, $previous_filename, $previous_mime, $attachment_id);
		$new_filename= wp_unique_filename($previous_path, $new_filename);
		$new_file = $previous_path.'/'.$new_filename;
		move_uploaded_file($_FILES['replacementfile']['tmp_name'], $new_file);
		@chmod($previous_file, $original_file_perms);
		$new_guid = str_replace($previous_filename, $new_filename, $previous_guid);
		$new_posttitle = preg_replace('/\.[^.]+$/', '', basename($new_file));
		$wpdb->update($wpdb->prefix.'posts',
			array(
				'post_title' => $new_posttitle,
				'post_name' => $new_posttitle,
				'guid' => $new_guid,
				'post_mime_type' => $new_filetype
			),
			array('ID' => $attachment_id)
		);
		$old_meta_name = $wpdb->get_var($wpdb->prepare('SELECT meta_value FROM '.$wpdb->prefix.'postmeta WHERE meta_key = "_wp_attached_file" AND post_id = %d', $attachment_id), ARRAY_A);
		$new_meta_name = str_replace($previous_filename, $new_filename, $old_meta_name);
		$wpdb->update($wpdb->prefix.'postmeta',
			array(
				'meta_value' => $new_meta_name
			),
			array(
				'meta_key' => '_wp_attached_file',
				'post_id' => $attachment_id
			)
		);
		wp_update_attachment_metadata($attachment_id, wp_generate_attachment_metadata($attachment_id, $new_file));
		update_attached_file($attachment_id, $new_file);
		$wpdb->get_results($wpdb->prepare('UPDATE '.$wpdb->prefix.'posts SET post_modified = now(), post_modified_gmt = utc_timestamp() where ID = %d', $attachment_id));
		$post_meta_after = get_post_meta($attachment_id, '_wp_attachment_metadata', true);
		$post_replacements = array($post_meta_before['file'] => $post_meta_after['file']);
		foreach($post_meta_before['sizes'] as $meta_name => $meta_size) {
			$meta_file_before = $meta_size['file'];
			if (isset($post_meta_after['sizes'][$meta_name])) {
				$meta_file_after = $post_meta_after['sizes'][$meta_name]['file'];
			} else {
				if (strpos($meta_name, $meta_type) !== false) {
					$feature_prios = array('medium-feature', 'large-feature', 'small-feature');
					foreach($feature_prios as $alt_type) {
						if (isset($post_meta_after['sizes'][$alt_type])) {
							$meta_file_after = $post_meta_after['sizes'][$alt_type]['file'];
							break;
						}
					}
				}
				if (!isset($meta_file_after)) {
					if (strpos($meta_name, $meta_type) !== false) {
						$thumb_prios = array('thumb', 'thumbnail', 'post-thumb', 'post-thumbnail');
						foreach($thumb_prios as $alt_type) {
							if (isset($post_meta_after['sizes'][$alt_type])) {
								$meta_file_after = $post_meta_after['sizes'][$alt_type]['file'];
								break;
							}
						}
					}
				}
				if (!isset($meta_file_after)) {
					$default_prios = array('medium', 'large', 'small', 'full', 'thumb', 'thumbnail', 'post-thumb', 'post-thumbnail', 'medium-feature', 'large-feature', 'small-feature');
					foreach($default_prios as $alt_type) {
						if (isset($post_meta_after['sizes'][$alt_type])) {
							$meta_file_after = $post_meta_after['sizes'][$alt_type]['file'];
							break;
						}
					}
				}
			}
			if (isset($meta_file_after)) {
				$path_pos = strrpos($post_meta_before['file'], '/');
				if ($path_pos > 0) {
					$path = substr($post_meta_before['file'], 0, $path_pos+1);
				} else {
					$path = '';
				}
				$post_replacements[$path.$meta_file_before] = $path.$meta_file_after;
			} else {
				$post_replacements[$meta_file_before] = $post_meta_after['file'];
			}
		}
		$now = time();
		$prefix = $wpdb->prefix.'ds_';
		foreach ($post_replacements as $meta_before => $meta_after) {
			if ($meta_before != $meta_after) {
				$wpdb->query($wpdb->prepare('UPDATE '.$wpdb->prefix.'posts SET post_content = REPLACE(post_content, %s, %s) WHERE post_type = "page" AND post_content LIKE %s', $meta_before, $meta_after, '%'.$wpdb->esc_like($meta_before).'%'));
			}
			$screen_elements = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_screen_element WHERE htmlcode LIKE %s', '%'.$wpdb->esc_like($meta_before).'%'), ARRAY_A);
			foreach ($screen_elements as $screen_element) {
				if ($meta_before != $meta_after) {
					$wpdb->get_results($wpdb->prepare('UPDATE '.$wpdb->prefix.'ds_screen_element SET htmlcode = REPLACE(htmlcode, %s, %s) WHERE id = %d',$meta_before, $meta_after, $screen_element['id']));
				}
				$screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_screen WHERE id IN (SELECT screenId FROM '.$wpdb->prefix.'ds_screen_element_screen WHERE screen_elementId = %d)', $screen_element['id']), ARRAY_A);
				if (isset($screens)) {
					foreach ($screens as $screen) {
						$program_screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'program_screen WHERE screenId = %d', $screen['id']), ARRAY_A);
						if (isset($program_screens)) {
							foreach ($program_screens as $program_screen) {
								$wpdb->update($prefix.'device', array('changedate' => $now), array('programId' => $program_screen['programId']));
							}
							$wpdb->query($wpdb->prepare('UPDATE '.$prefix.'program SET change_date = %d WHERE id in (SELECT programId FROM '.$prefix.'program_screen WHERE screenId = %d)', $now, $screen['id']));
						}
					}
					$wpdb->get_results($wpdb->prepare('UPDATE '.$prefix.'screen SET change_date = %d WHERE id in (select screenId from '.$wpdb->prefix.'ds_screen_element_screen where screen_elementId = %d)', $now, $screen_element['id']));
				}
			}
		}
		$redirect_url = get_bloginfo('wpurl').'/wp-admin/post.php?post='.$attachment_id.'&action=edit&message=1';
	} else {
		$redirect_url = get_bloginfo('wpurl').'/wp-admin/upload.php';
	}
	if (FORCE_SSL_ADMIN) {
		$redirect_url = str_replace('http:', 'https:', $redirect_url);
	}
	wp_redirect($redirect_url);
}
?>
