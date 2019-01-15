<?php
defined( 'ABSPATH' ) or die();
class DS_Plugin_Activator {
	public static function activate($networkwide) {
		global $wpdb;
		if ($networkwide && function_exists('is_multisite') && is_multisite()) {
			$prev_blog = $wpdb->blogid;
			$blog_ids = $wpdb->get_col('SELECT blog_id FROM '.$wpdb->blogs);
			foreach ($blog_ids as $blog_id) {
				switch_to_blog($blog_id);
				self::dsppro_activate();
			}
			switch_to_blog($prev_blog);
		} else {
			self::dsppro_activate();
		}
	}

	private static function dsppro_activate() {
		global $wpdb;
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		$charset_collate = $wpdb->get_charset_collate();
		$prefix = $wpdb->prefix . 'ds_';
		$table_name = $prefix . 'screen';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  formatId INT(11) NOT NULL DEFAULT -1,
		  templateId INT(11) NOT NULL DEFAULT -1,
		  customTemplateId INT(11) NOT NULL DEFAULT -1,
		  name VARCHAR(255) NOT NULL DEFAULT '',
		  ratio FLOAT(6,5) NOT NULL DEFAULT 1,
		  change_date BIGINT(20) NOT NULL DEFAULT 0,
		  PRIMARY KEY  (id),
		  KEY formatId (formatId),
		  KEY templateId (templateId),
		  KEY customTemplateId (customTemplateId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'screen_element_screen';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  screenId INT(11) NOT NULL DEFAULT -1,
		  screen_elementId INT(11) NOT NULL DEFAULT -1,
		  pos_nr TINYINT(4) NOT NULL DEFAULT 0,
		  PRIMARY KEY  (id),
		  KEY screenId (screenId),
		  KEY screen_elementId (screen_elementId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'screen_element';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  name VARCHAR(255) NOT NULL DEFAULT '',
		  htmlcode TEXT NOT NULL DEFAULT '',
		  PRIMARY KEY  (id)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'template';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  number INT(11) NOT NULL DEFAULT 0,
		  formatId INT(11) NOT NULL DEFAULT -1,
		  filename VARCHAR(255) NOT NULL DEFAULT '',
		  preview_filename VARCHAR(255) NOT NULL DEFAULT '',
		  PRIMARY KEY  (id),
		  KEY formatId (formatId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'custom_template';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  formatId INT(11) NOT NULL DEFAULT -1,
		  htmlcode TEXT NOT NULL DEFAULT '',
		  name VARCHAR(255) NOT NULL DEFAULT '',
		  PRIMARY KEY  (id),
		  KEY formatId (formatId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'format';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  type TINYINT(4) NOT NULL DEFAULT -1,
		  typename VARCHAR(20) NOT NULL DEFAULT '',
		  ratio FLOAT(6,5) NOT NULL DEFAULT 1,
		  PRIMARY KEY  (id)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'screen_scheduling';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  screenId INT(11) NOT NULL DEFAULT -1,
		  schedulingId INT(11) NOT NULL DEFAULT -1,
		  PRIMARY KEY  (id),
		  KEY screenId (screenId),
		  KEY schedulingId (schedulingId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'scheduling';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  permanent TINYINT(1) NOT NULL DEFAULT 0,
		  startdate BIGINT(20) NOT NULL DEFAULT 0,
		  enddate BIGINT(20) NOT NULL DEFAULT 0,
		  playduration INT(11) NOT NULL DEFAULT 5,
		  weekday_start BIGINT(20) NOT NULL DEFAULT 0,
		  weekday_start_time_h TINYINT(4) NOT NULL DEFAULT 0,
		  weekday_start_time_m TINYINT(4) NOT NULL DEFAULT 0,
		  weekday_end BIGINT(20) NOT NULL DEFAULT 0,
		  weekday_end_time_h TINYINT(4) NOT NULL DEFAULT 0,
		  weekday_end_time_m TINYINT(4) NOT NULL DEFAULT 0,
		  day_of_month_start TINYINT(4) NOT NULL DEFAULT 0,
		  day_of_month_end TINYINT(4) NOT NULL DEFAULT 0,
		  PRIMARY KEY  (id)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'program';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  name VARCHAR(255) NOT NULL DEFAULT '',
		  change_date BIGINT(20) NOT NULL DEFAULT 0,
		  PRIMARY KEY  (id)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'program_screen';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  programId INT(11) NOT NULL DEFAULT -1,
		  screenId INT(11) NOT NULL DEFAULT -1,
		  is_father_of_screen TINYINT(1) NOT NULL DEFAULT 0,
		  screenOrder INT(11) NOT NULL DEFAULT 0,
		  PRIMARY KEY  (id),
		  KEY programId (programId),
		  KEY screenId (screenId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'program_program';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  programId INT(11) NOT NULL DEFAULT -1,
		  sub_progId INT(11) NOT NULL DEFAULT -1,
		  programOrder INT(11) NOT NULL DEFAULT 0,
		  PRIMARY KEY  (id),
		  KEY programId (programId),
		  KEY sub_progId (sub_progId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'program_screen_scheduling';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  programId INT(11) NOT NULL DEFAULT -1,
		  schedulingId INT(11) NOT NULL DEFAULT -1,
		  PRIMARY KEY  (id),
		  KEY programId (programId),
		  KEY schedulingId (schedulingId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'program_program_scheduling';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  program_programId INT(11) NOT NULL DEFAULT -1,
		  schedulingId INT(11) NOT NULL DEFAULT -1,
		  PRIMARY KEY  (id),
		  KEY program_programId (program_programId),
		  KEY schedulingId (schedulingId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'device';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  programId INT(11) NOT NULL DEFAULT -1,
		  name VARCHAR(255) NOT NULL DEFAULT '',
		  location VARCHAR(255) NOT NULL DEFAULT '',
		  street VARCHAR(255) NOT NULL DEFAULT '',
		  city VARCHAR(255) NOT NULL DEFAULT '',
		  zipcode VARCHAR(255) NOT NULL DEFAULT '',
		  changedate BIGINT(20) NOT NULL DEFAULT 0,
		  last_request BIGINT(20) NOT NULL DEFAULT 0,
		  dtp VARCHAR(255) NOT NULL DEFAULT '', 
		  ua VARCHAR(255) NOT NULL DEFAULT '', 
		  ald BIGINT(20) NOT NULL DEFAULT 0,
		  groupname VARCHAR(255) NOT NULL DEFAULT '',
		  PRIMARY KEY  (id),
		  KEY programId (programId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'devicewall';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  resolution_w INT(11) NOT NULL DEFAULT 1280,
		  resolution_h INT(11) NOT NULL DEFAULT 720,
		  bezel_compensation_w INT(11) NOT NULL DEFAULT 0,
		  bezel_compensation_h INT(11) NOT NULL DEFAULT 0,
		  name VARCHAR(255) NOT NULL DEFAULT '',
		  location VARCHAR(255) NOT NULL DEFAULT '',
		  street VARCHAR(255) NOT NULL DEFAULT '',
		  city VARCHAR(255) NOT NULL DEFAULT '',
		  zipcode VARCHAR(255) NOT NULL DEFAULT '',	  
		  change_date BIGINT(20) NOT NULL DEFAULT 0,
		  programId INT(11) NOT NULL DEFAULT -1,
		  portrait TINYINT(1) NOT NULL DEFAULT 0,
		  wall_rows TINYINT(4) NOT NULL DEFAULT 0,
		  wall_columns TINYINT(4) NOT NULL DEFAULT 0,
		  refpointcalcts BIGINT(20) NOT NULL DEFAULT 0,
		  sequencevalidto BIGINT(20) NOT NULL DEFAULT 0,
		  sequencedur INT(11) NOT NULL DEFAULT 0,
		  PRIMARY KEY  (id),
		  KEY programId (programId)
		) $charset_collate;";
		dbDelta( $sql );
		$table_name = $prefix . 'devicewall_device';
		$sql = "CREATE TABLE $table_name (
		  id INT(11) NOT NULL AUTO_INCREMENT,
		  devicewallId INT(11) NOT NULL DEFAULT -1,
		  deviceId INT(11) NOT NULL DEFAULT -1,
		  pos_x INT(11) NOT NULL DEFAULT 0,
		  pos_y INT(11) NOT NULL DEFAULT 0,
		  zoom INT(11) NOT NULL DEFAULT 0,
		  resolution_w INT(11) NOT NULL DEFAULT 1280,
		  resolution_h INT(11) NOT NULL DEFAULT 720,
		  change_date BIGINT(20) NOT NULL DEFAULT 0,
		  PRIMARY KEY  (id),
		  KEY devicewallId (devicewallId),
  		  KEY deviceId (deviceId)
		) $charset_collate;";
		dbDelta( $sql );
		$wpdb->query('INSERT INTO '.$prefix.'format VALUES (1, 1, "landscape", 1.33333) ON DUPLICATE KEY UPDATE type = 1, typename = "landscape", ratio = 1.33333');
		$wpdb->query('INSERT INTO '.$prefix.'format VALUES (2, 2, "portrait", 1.33333) ON DUPLICATE KEY UPDATE type = 2, typename = "portrait", ratio = 1.33333');
		$folder = str_replace('includes', 'templates', plugin_dir_path( __FILE__ ));
		for ($i = 1; file_exists($folder.'template-'.sprintf('%03d', $i).'.html'); $i++) {
			$filename = 'template-'.sprintf('%03d', $i).'.html';
			if (file_exists($folder.'v'.sprintf('%03d', $i).'.jpg')) {
				$formatId = 1;
				$preview_filename = 'v'.sprintf('%03d', $i).'.jpg';
			} else if (file_exists($folder.'vp'.sprintf('%03d', $i).'.jpg')) {
				$formatId = 2;
				$preview_filename = 'vp'.sprintf('%03d', $i).'.jpg';
			} else {
				$formatId = 0;
			}
			if ($formatId > 0) {
				$wpdb->query($wpdb->prepare('INSERT INTO '.$prefix.'template VALUES (%d, %d, %d, %s, %s) ON DUPLICATE KEY UPDATE number = %d, formatId = %d, filename = %s, preview_filename = %s', $i, $i, $formatId, $filename, $preview_filename, $i, $formatId, $filename, $preview_filename));
			}
		}
		$pages = $wpdb->get_results('SELECT ID, post_title, guid FROM '.$wpdb->prefix.'posts WHERE post_type = "page" AND post_content LIKE "%[digitalsignage]%" ORDER BY ID', ARRAY_A);
		if (count($pages) == 0) {
			wp_insert_post(
				array(
					'post_title' => 'Digital Signage',
					'post_content' => '[digitalsignage]',
					'post_status' => 'publish',
					'post_author' => 1,
					'post_type' => 'page',
					'comment_status' => 'closed'
				)
			);
		}
	}
}
