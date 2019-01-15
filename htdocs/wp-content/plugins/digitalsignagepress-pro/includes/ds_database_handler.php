<?php
defined( 'ABSPATH' ) or die();

class DS_DB_Handler {

	public function make_new_screen($name, $templateId, $customTemplateId, $ratio, $format_type, $elements, $schedules, $screenOrder) {
		$screen = array();
		$screen['id'] = -1;
		$screen['name'] = $name;
		$screen['templateId'] = $templateId;
		$screen['customTemplateId'] = $customTemplateId;
		$screen['ratio'] = $ratio;
		$screen['format_type'] = $format_type;
		$screen['formatId'] = $this->get_or_make_format_id(-2, $screen['ratio'], $screen['format_type']);
		$screen['elements'] = $elements;
		$screen['schedules'] = $schedules;
		$screen['screenOrder'] = $screenOrder;
		$formatId = $screen['formatId'];
		if ($templateId > -1) {
			global $wpdb;
			$tablename = $wpdb->prefix.'ds_template';
			$template = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %s', $templateId), ARRAY_A);
			if (isset($template)) {
				$types = array('filename', 'preview_filename');
				foreach ($types as $type) {
					$screen[$type] = $template[$type];
				}
				if (!isset($formatId) || $formatId < 0) {
					$formatId = $template['formatId'];
				}
			}
		} else {
			$screen['filename'] = '';
			$screen['preview_filename'] = '';
		}
		if ($customTemplateId > -1) {
			global $wpdb;
			$tablename = $wpdb->prefix.'ds_custom_template';
			$template = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %s', $customTemplateId), ARRAY_A);
			if (isset($template)) {
				$screen['template_name'] = $template['name'];
				$screen['template_htmlcode'] = stripslashes($template['htmlcode']);
				if (!isset($formatId) || $formatId < 0) {
					$formatId = $template['formatId'];
				}
			}
		}
		if ($formatId > 0 && ($screen['ratio'] < 0 || $screen['format_type'] < 0)) {
			$format = $this->get_format_by_id($screen['formatId']);
			if (isset($format)) {
				$screen['ratio'] = $format['ratio'];
				$screen['format_type'] = $format['format_type'];
			}
		}
		return $screen;
	}

	public function make_new_screen_element($name, $pos_nr, $htmlcode) {
		$element = array();
		$element['id'] = -1;
		$element['name'] = $name;
		$element['pos_nr'] = $pos_nr;
		$element['htmlcode'] = $htmlcode;
		return $element;
	}

	public function make_new_program($name, $screens, $programs, $schedules, $programOrder) {
		$program = array();
		$program['id'] = -1;
		$program['name'] = $name;
		$program['screens'] = $screens;
		$program['programs'] = $programs;
		$program['schedules'] = $schedules;
		$program['programOrder'] = $programOrder;
		return $program;
	}

	public function make_new_screen_schedule( $permanent, $startdate, $enddate, $playduration, $weekday_start, $weekday_start_time_h, $weekday_start_time_m, $weekday_end, $weekday_end_time_h, $weekday_end_time_m, $day_of_month_start, $day_of_month_end ) {
		$schedule = array();
		$id = -1;
		$types = array(
			'id', 'permanent', 'startdate', 'enddate', 'playduration', 'weekday_start', 'weekday_start_time_h', 'weekday_start_time_m',
			'weekday_end', 'weekday_end_time_h', 'weekday_end_time_m', 'day_of_month_start', 'day_of_month_end'
		);
		foreach($types as $type) {
			if ($$type != null && $$type != "") {
				$schedule[$type] = $$type;
			} else {
				$schedule[$type] = 0;
			}
		}
		return $schedule;
	}

	public function make_new_device($name, $programId, $location, $street, $city, $zipcode) {
		$device = array();
		$device['id'] = -1;
		$device['name'] = $name;
		$device['programId'] = $programId;
		$device['location'] = $location;
		$device['street'] = $street;
		$device['city'] = $city;
		$device['zipcode'] = $zipcode;
		$device['changedate'] = 0;
		$device['last_request'] = 0;
		$device['ua'] = "";
		$device['dtp'] = "";
		$device['ald'] = "";
		$device['groupname'] = "";
		return $device;
	}

	public function make_new_custom_template($name, $htmlcode, $format_type, $ratio) {
		$template = array();
		$template['id'] = -1;
		$template['name'] = $name;
		$template['htmlcode'] = $htmlcode;
		$template['formatId'] = -1;
		$template['format_type'] = $format_type;
		$template['ratio'] = $ratio;
		return $template;
	}

	public function get_program_by_id( $id, $add_screens = false ) {
		if($id <= 0) {
			return null;
		}
		$var_name = 'ds_known_ids_for_'.$id;
		global ${$var_name};
		if (isset(${$var_name})) {
			${$var_name} = array();
		}
		return $this->get_program_by_id_real($id, $add_screens, $var_name);
	}

	public function get_programs_by_name( $name, $add_screens = false ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_program';
		$results = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE name = %s', $name), ARRAY_A);
		if ( count($results) > 0 ) {
			$programs = array();
			foreach ($results as $result) {
				$var_name = 'ds_known_ids_for_'.$result['id'];
				global ${$var_name};
				if (isset(${$var_name})) {
					${$var_name} = array();
				}
				$programs[] = $this->expand_program( $result, $add_screens, $var_name );
			}
		} else {
			$programs = null;
		}
		return $programs;
	}

	public function get_all_programs($add_screens = false ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_program';
		$results = $wpdb->get_results('SELECT * FROM '.$tablename, ARRAY_A);
		if ( count($results) > 0 ) {
			$programs = array();
			foreach ($results as $result) {
				$var_name = 'ds_known_ids_for_'.$result['id'];
				global ${$var_name};
				if (isset(${$var_name})) {
					${$var_name} = array();
				}
				$programs[] = $this->expand_program( $result, $add_screens, $var_name );
			}
		} else {
			$programs = null;
		}
		return $programs;
	}

	public function get_default_program( $add_screens = false ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_program';
		$program = $wpdb->get_row('SELECT * FROM '.$tablename.' ORDER BY id ASC LIMIT 1', ARRAY_A);
		if (isset($program)) {
			$var_name = 'ds_known_ids_for_default';
			global ${$var_name};
			if (isset(${$var_name})) {
				${$var_name} = array();
			}
			$program = $this->expand_program( $program, $add_screens, $var_name );
		} else {
			$program = null;
		}
		return $program;
	}

	public function get_screen_by_id( $id ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_screen';
		$screen = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %d', $id), ARRAY_A);
		if (isset($screen)) {
			$screen = $this->expand_screen($screen);
		} else {
			$screen = null;
		}
		return $screen;
	}

	public function get_default_screen() {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_screen';
		$screen = $wpdb->get_row('SELECT * FROM '.$tablename.' ORDER BY id DESC LIMIT 1', ARRAY_A);
		if (isset($screen)) {
			$screen = $this->expand_screen($screen);
		} else {
			$screen = null;
		}
		return $screen;
	}

	public function get_screens_by_name( $name ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_screen';
		$results = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE name = %s', $name), ARRAY_A);
		if ( count($results) > 0 ) {
			$screens = array();
			foreach ($results as $result) {
				$screens[] = $this->expand_screen( $result );
			}
		} else {
			$screens = null;
		}
		return $screens;
	}

	public function get_all_screens() {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_screen';
		$results = $wpdb->get_results('SELECT * FROM '.$tablename, ARRAY_A);
		if ( count($results) > 0 ) {
			$screens = array();
			foreach ($results as $result) {
				$screens[] = $this->expand_screen( $result );
			}
		} else {
			$screens = null;
		}
		return $screens;
	}

	public function get_screen_element_by_id($id) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_screen_element';
		$screen_element = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %d', $id), ARRAY_A);
		if (!isset($screen_element)) {
			$screen_element = null;
		}
		return $screen_element;
	}

	public function insert_or_update_screen( $screen ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_screen';
		$results = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$tablename.' WHERE id = %d', $screen['id']));
		if ($results > 0) {
			$screen_id = $this->update_screen($screen);
		} else {
			$screen_id = $this->insert_screen($screen);
		}
		return $screen_id;
	}

	public function delete_screen_by_id( $id, $delete_orphans ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$wpdb->delete($prefix.'screen', array('id' => $id));
		$wpdb->delete($prefix.'screen_element_screen', array('screenId' => $id));
		$wpdb->delete($prefix.'screen_scheduling', array('screenId' => $id));
		if ($delete_orphans) {
			$wpdb->query('DELETE FROM '.$prefix.'screen_element WHERE id NOT IN (SELECT screen_elementId FROM '.$prefix.'screen_element_screen)');
			$wpdb->query('DELETE FROM '.$prefix.'scheduling WHERE id NOT IN (SELECT screen_elementId FROM '.$prefix.'screen_scheduling) AND id NOT IN (SELECT screen_elementId FROM '.$prefix.'program_screen_scheduling) AND id NOT IN (SELECT screen_elementId FROM '.$prefix.'program_program_scheduling)');
		}
	}

	public function insert_or_update_schedules_for_screen_by_id( $screenId, $schedules ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$changed = false;
		$known_ids = array();
		foreach($schedules as $schedule) {
			$schedule_id = $this->create_or_update_schedule( $schedule );
			if ($schedule_id > -1) {
				$result = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'screen_scheduling WHERE screenId = %d AND schedulingId = %d', $screenId, $schedule_id));
				if ($result > 0) {
					$temp = current($result);
					$known_ids[] = $temp['id'];
				} else {
					$wpdb->insert($prefix.'screen_scheduling',
						array(
							'screenId' => $screenId,
							'schedulingId' => $schedule_id
						)
					);
					$known_ids[] = $wpdb->insert_id;
					$changed = true;
				}
			}
			
		}
		$prev_amount = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'screen_scheduling WHERE screenId = %d', $screenId));
		$delete_query = 'DELETE FROM '.$prefix.'screen_scheduling WHERE screenId = %d';
		$preparelist = array($screenId);
		if (count($known_ids) > 0) {
			$delete_query .= ' AND id NOT IN (';
			$first_elem = true;
			foreach ($known_ids as $known_id) {
				if ($first_elem) {
					$first_elem = false;
				} else {
					$delete_query .= ',';
				}
				$delete_query .= '%d';
				$preparelist[] = $known_id;
			}
			$delete_query .= ')';
		}
		$wpdb->get_results($wpdb->prepare($delete_query, $preparelist));

		if ($changed || $prev_amount != $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'screen_scheduling WHERE screenId = %d', $screenId))) {
			$wpdb->update($prefix.'screen',
				array(
					'change_date' => time()
				),
				array(
					'id' => $screenId
				)
			);
		}
	}



	public function insert_or_update_schedules_for_program_by_id( $programId, $schedules ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$changed = false;
		$known_ids = array();
		foreach($schedules as $schedule) {
			$schedule_id = $this->create_or_update_schedule($schedule);
			if ($schedule_id > -1) {
				$result = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'program_screen_scheduling WHERE programId = %d AND schedulingId = %d', $programId, $schedule_id), ARRAY_A);
				if (isset($result)) {
					$known_ids[] = $result['id'];
				} else {
					$wpdb->insert($prefix.'program_screen_scheduling',
						array(
							'programId' => $programId,
							'schedulingId' => $schedule_id
						)
					);
					$known_ids[] = $wpdb->insert_id;
					$changed = true;
				}
			}
			
		}
		$prev_amount = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_screen_scheduling WHERE programId = %d', $programId));
		$delete_query = 'DELETE FROM '.$prefix.'program_screen_scheduling WHERE programId = %d';
		$preparelist = array($programId);
		if (count($known_ids) > 0) {
			$delete_query .= ' AND id NOT IN (';
			$first_elem = true;
			foreach ($known_ids as $known_id) {
				if ($first_elem) {
					$first_elem = false;
				} else {
					$delete_query .= ',';
				}
				$delete_query .= '%d';
				$preparelist[] = $known_id;
			}
			$delete_query .= ')';
		}
		$wpdb->get_results($wpdb->prepare($delete_query, $preparelist));

		if ($changed || $prev_amount != $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_screen_scheduling WHERE programId = %d', $programId))) {
			$wpdb->update($prefix.'program',
				array(
					'change_date' => time()
				),
				array(
					'id' => $programId
				)
			);
		}
	}

	public function delete_schedule_by_id( $id ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'scheduling WHERE id = %d', $id));
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'screen_scheduling WHERE schedulingId = %d', $id));
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'program_screen_scheduling WHERE schedulingId = %d', $id));
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'program_program_scheduling WHERE schedulingId = %d', $id));
	}

	public function insert_or_update_program( $program ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_program';
		$results = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$tablename.' WHERE id = %d', $program['id']));
		if ($results > 0) {
			$program_id = $this->update_program($program);
		} else {
			$program_id = $this->insert_program($program);
		}
		return $program_id;
	}

	public function delete_program_by_id( $id ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'program WHERE id = %d', $id));
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'program_screen WHERE programId = %d', $id));
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'program_program WHERE programId = %d OR sub_progId = %d', $id, $id));
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'program_screen_scheduling WHERE programId = %d', $id));
		$wpdb->get_results('DELETE FROM '.$prefix.'program_program_scheduling WHERE program_programId NOT IN (SELECT id FROM '.$prefix.'program_program)');
		$wpdb->update($prefix.'device', array('programId' => -1), array('programId' => $id));
		$uploads = wp_upload_dir();
		$smil_file = $uploads['basedir'].'/digitalsignagepress/smil/'.$id.'.smil';
		if (file_exists($smil_file)) {
			unlink($smil_file);
		}
	}

	public function remove_program_screen( $progId, $screenId ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$now = time();
		$program_screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'program_screen WHERE programId = %d AND screenId = %d', $progId, $screenId), ARRAY_A);
		if (isset($program_screens)) {
			$wpdb->update($prefix.'program', array('change_date' => $now), array('id' => $progId));
			$wpdb->update($prefix.'device', array('changedate' => $now), array('programId' => $progId));
			$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'program_screen WHERE programId = %d AND screenId = %d', $progId, $screenId));
		}
	}

	public function get_device_by_id( $id ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_device';
		$device = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %d', $id), ARRAY_A);
		if (!isset($device)) {
			if ($id == -1) {
				$device = $this->make_new_device("", -1, "", "", "", "", "");
			} else {
				$device = null;
			}
		}
		return $device;
	}

	public function get_devices_by_name( $name ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_device';
		$results = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE name = %s', $name), ARRAY_A);
		if ( count($results) > 0 ) {
			$devices = array();
			foreach ($results as $result) {
				$devices[] = $result;
			}
		} else {
			$devices = null;
		}
		return $devices;
	}

	public function get_all_devices_for_program_id($prog_id) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_device';
		$results = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE programId = %d', $prog_id), ARRAY_A);
		if ( count($results) > 0 ) {
			$devices = array();
			foreach ($results as $result) {
				$devices[] = $result;
			}
		} else {
			$devices = null;
		}
		return $devices;
	}

	public function get_all_devices() {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_device';
		$results = $wpdb->get_results('SELECT * FROM '.$tablename, ARRAY_A);
		if (count($results) > 0) {
			$devices = array();
			foreach ($results as $result) {
				$devices[] = $result;
			}
		} else {
			$devices = null;
		}
		return $devices;
	}

        public function get_all_devicewall_devices() {
                global $wpdb;
                $prefix = $wpdb->prefix.'ds_';
                $results = $wpdb->get_results('SELECT * FROM '.$prefix.'device WHERE id IN (SELECT deviceId FROM '.$prefix.'devicewall_device)', ARRAY_A);
                if ( count($results) > 0 ) {
                        $devices = array();
                        foreach ($results as $result) {
                                $devices[] = $result;
                        }
                } else {
                        $devices = null;
                }
                return $devices;
        }

	public function insert_or_update_device( $device ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_device';
		$results = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$tablename.' WHERE id = %d', $device['id']));
		if ($results > 0) {
			$deviceId = $this->update_device($device);
		} else {
			$deviceId = $this->insert_device($device);
		}
		return $deviceId;
	}

	public function delete_device_by_id( $id ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'device WHERE id = %d', $id));
	}

	public function get_regular_templates() {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_template';
		$results = $wpdb->get_results('SELECT * FROM '.$tablename, ARRAY_A);
		if ( count($results) > 0 ) {
			$templates = array();
			foreach ($results as $result) {
				$templates[] = $result;
			}
		} else {
			$templates = null;
		}
		return $templates;
	}

	public function get_custom_templates() {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_custom_template';
		$results = $wpdb->get_results('SELECT * FROM '.$tablename, ARRAY_A);
		if ( count($results) > 0 ) {
			$templates = array();
			foreach ($results as $result) {
				$result['htmlcode'] = stripslashes($result['htmlcode']);
				$templates[] = $result;
			}
		} else {
			$templates = null;
		}
		return $templates;
	}

	public function get_regular_template_by_id( $id ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_template';
		$template = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %d', $id), ARRAY_A);
		if (!isset($template)) {
			$template = null;
		}
		return $template;
	}

	public function get_default_template() {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_template';
		$template = $wpdb->get_row('SELECT * FROM '.$tablename.' ORDER BY id LIMIT 1', ARRAY_A);
		if (!isset($template)) {
			$template = null;
		}
		return $template;
	}

	public function get_custom_template_by_id( $id ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_custom_template';
		$template = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %d', $id), ARRAY_A);
		if (isset($template)) {
			$template['htmlcode'] = stripslashes($template['htmlcode']);
		} else {
			$template = null;
		}
		return $template;
	}

	public function get_default_custom_template() {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_custom_template';
		$template = $wpdb->get_row('SELECT * FROM '.$tablename.' ORDER BY id LIMIT 1', ARRAY_A);
		if (isset($template)) {
			$template['htmlcode'] = stripslashes($template['htmlcode']);
		} else {
			$template = null;
		}
		return $template;
	}

	public function insert_or_update_custom_template( $template ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_custom_template';
		$results = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$tablename.' WHERE id = %d', $template['id']));
		if ($results > 0) {
			$template_id = $this->update_custom_template($template);
		} else {
			$template_id = $this->insert_custom_template($template);
		}
		return $template_id;
	}

	public function delete_custom_template_by_id( $id ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'custom_template WHERE id = %d', $id));
	}

	public function get_schedulings_for_screen_by_id( $id ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$schedulings = array();
		$results = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'scheduling WHERE id IN (SELECT schedulingId FROM '.$prefix.'screen_scheduling WHERE screenId = %d) ', $id), ARRAY_A);
		if ( count($results) > 0 ) {
			foreach ($results as $result) {
				$schedulings[$result['id']] = $result;
			}
		} else {
			$schedulings = null;
		}
		return $schedulings;
	}

	public function get_schedulings_for_program_by_id( $id ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$schedulings = array();
		$results = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'scheduling WHERE id IN (SELECT schedulingId FROM '.$prefix.'program_screen_scheduling WHERE programId = %d) ', $id), ARRAY_A);
		if ( count($results) > 0 ) {
			foreach ($results as $result) {
				$schedulings[$result['id']] = $result;
			}
		} else {
			$schedulings = null;
		}
		return $schedulings;
	}

	private function get_program_by_id_real( $id, $add_screens, $known_prog_var_name ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_program';
		$program = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %d', $id), ARRAY_A);
		if (isset($program)) {
			$program = $this->expand_program($program, $add_screens, $known_prog_var_name );
		} else {
			$program = null;
		}
		return $program;
	}

	private function expand_program( $program, $add_screens, $known_prog_var_name ) {
		$program['screens'] = array();
		$program['schedules'] = array();
		$program['programs'] = array();
		$program['programOrder'] = 0;
		if ($add_screens && $program['id'] > 0) {
			global $wpdb;
			$prefix = $wpdb->prefix.'ds_';
			$prog_screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'program_screen WHERE programId = %d ORDER BY screenOrder, screenId', $program['id']), ARRAY_A);
			if ( count($prog_screens) > 0 ) {
				foreach ($prog_screens as $prog_screen) {
					$screen = $this->get_screen_by_id( $prog_screen['screenId'] );
					if (isset($screen)) {
						$screen['screenOrder'] = $prog_screen['screenOrder'];
						$program['screens'][$screen['id']] = $screen;
					}
				}
			}
			$program['schedules'] = $this->get_schedulings_for_program_by_id($program['id']);
			if (!isset($program['schedules'])) {
				$program['schedules'] = array();
			}
			global ${$known_prog_var_name};
			if (!isset(${$known_prog_var_name})) {
				${$known_prog_var_name} = array();
			}
			${$known_prog_var_name}[] = $program['id'];
			$prog_programs = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'program_program WHERE programId = %d ORDER BY programOrder', $program['id']), ARRAY_A);
			if ( count($prog_programs) > 0 ) {
				foreach ($prog_programs as $prog_program) {
					if (!in_array($prog_program['sub_progId'], ${$known_prog_var_name})) {
						$sub_program = $this->get_program_by_id_real( $prog_program['sub_progId'], true, $known_prog_var_name );
						$sub_program['programOrder'] = $prog_program['programOrder'];
						$program['programs'][$sub_program['id']] = $sub_program;
					}
				}
			}
		}
		return $program;
	}

	private function expand_screen( $screen ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$screen['elements'] = array();
		$screen['screenOrder'] = 0;
		$elements = $wpdb->get_results($wpdb->prepare('SELECT b.id, a.pos_nr, b.name, b.htmlcode FROM '.$prefix.'screen_element_screen a LEFT JOIN '.$prefix.'screen_element b ON (a.screen_elementId = b.id) WHERE a.screenId = %d ORDER BY a.pos_nr', $screen['id']), ARRAY_A);
		$types = array('id', 'pos_nr', 'name');
		foreach ($elements as $element) {
			$elem = array();
			foreach ($types as $type) {
				$elem[$type] = $element[$type];
			}
			$elem['htmlcode'] = stripslashes($element['htmlcode']);
			$screen['elements'][$elem['id']] = $elem;
		}
		$screen['schedules'] = $this->get_schedulings_for_screen_by_id($screen['id']);
		if (!isset($screen['schedules'])) {
			$screen['schedules'] = array();
		}
		$formatId = $screen['formatId'];
		$screen['format_type'] = -1;
		if ($screen['templateId'] > 0) {
			$template = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'template WHERE id = %d', $screen['templateId']), ARRAY_A);
			if (isset($template)) {
				$types = array('filename', 'preview_filename');
				foreach ($types as $type) {
					$screen[$type] = $template[$type];
				}
				if (!isset($formatId) || $formatId <= 0) {
					$formatId = $template['formatId'];
				}
			}
		} else {
			if (isset($screen['customTemplateId']) && $screen['customTemplateId'] > 0) {
				$template = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'custom_template WHERE id = %d', $screen['customTemplateId']), ARRAY_A);
				if (isset($template)) {
					$types = array('name', 'htmlcode');
					foreach ($types as $type) {
						$screen['template_'.$type] = $template[$type];
					}
					if (!isset($formatId) || $formatId <= 0) {
						$formatId = $template['formatId'];
					}
				}
			}
		}
		if ($formatId > 0) {
			$template = $wpdb->get_row($wpdb->prepare('SELECT  * FROM '.$prefix.'format WHERE id = %d', $formatId), ARRAY_A);
			if (isset($template)) {
				$screen['ratio'] = $template['ratio'];
				$screen['format_type'] = $template['type'];
			}
		}
		
		return $screen;
	}

	private function update_screen( $screen ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$prev_screen = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'screen WHERE id = %d', $screen['id']), ARRAY_A);
		if (isset($prev_screen)) {
			$screen['ratio'] = number_format($screen['ratio'], 5);
			$prev_formatId = $screen['formatId'];
			$screen['formatId'] = $this->get_or_make_format_id($screen['formatId'], $screen['ratio'], $screen['format_type']);
			$changed = false;
			$known_ids = array();
			foreach ($screen['elements'] as $element) {
				$elem_id = $this->create_or_update_screen_element($element);
				if ($elem_id > -1) {
					$prev_elem = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'screen_element_screen WHERE screenId = %d AND screen_elementId = %d', $screen['id'], $elem_id), ARRAY_A);
					if (isset($prev_elem)) {
						if ($prev_elem['pos_nr'] != $element['pos_nr']) {
							$wpdb->update($prefix.'screen_element_screen',
								array(
									'pos_nr' => $element['pos_nr']
								),
								array(
									'id' => $elem_id
								)
							);
							$changed = true;
						}
					} else {
						$wpdb->insert($prefix.'screen_element_screen',
							array(
								'screenId' => $screen['id'],
								'screen_elementId' => $elem_id,
								'pos_nr' => $element['pos_nr']
							)
						);
						$changed = true;
					}
					$known_ids[] = $elem_id;
				}
			}
			$prev_amount_elements = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'screen_element_screen WHERE screenId = %d', $screen['id']));
			$delete_query = 'DELETE FROM '.$prefix.'screen_element_screen WHERE screenId = %d';
			$preparelist = array($screen['id']);
			if (count($known_ids) > 0) {
				$delete_query .= ' AND screen_elementId NOT IN (';
				$first_elem = true;
				foreach ($known_ids as $known_id) {
					if ($first_elem) {
						$first_elem = false;
					} else {
						$delete_query .= ',';
					}
					$delete_query .= '%d';
					$preparelist[] = $known_id;
				}
				$delete_query .= ')';
			}
			$wpdb->get_results($wpdb->prepare($delete_query, $preparelist));
			$known_schedule_ids = array();
			foreach ($screen['schedules'] as $schedule) {
				$schedule_id = $this->create_or_update_schedule($schedule);
				if ($schedule_id > -1) {
					$result = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'screen_scheduling WHERE screenId = %d AND schedulingId = %d', $screen['id'], $schedule_id));
					if ($result == 0) {
						$wpdb->insert($prefix.'screen_scheduling',
							array(
								'screenId' => $screen['id'],
								'schedulingId' => $schedule_id
							)
						);
						$changed = true;
					}
					$known_schedule_ids[] = $schedule_id;
				}
			}
			$prev_amount_schedules = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'screen_scheduling WHERE screenId = %d', $screen['id']));
			$delete_query = 'DELETE FROM '.$prefix.'screen_scheduling WHERE screenId = %d';
			$preparelist = array($screen['id']);
			if (count($known_schedule_ids) > 0) {
				$delete_query .= ' AND schedulingId NOT IN (';
				$first_elem = true;
				foreach ($known_schedule_ids as $known_id) {
					if ($first_elem) {
						$first_elem = false;
					} else {
						$delete_query .= ',';
					}
					$delete_query .= '%d';
					$preparelist[] = $known_id;
				}
				$delete_query .= ' )';
			}
			$wpdb->get_results($wpdb->prepare($delete_query, $preparelist));
			if ($changed || $prev_formatId != $screen['formatId'] || $prev_screen['templateId'] != $screen['templateId']
					|| $prev_screen['customTemplateId'] != $screen['customTemplateId']
					|| $prev_screen['name'] != $screen['name']  || $prev_screen['ratio'] != $screen['ratio']
					|| $prev_amount_elements != $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'screen_element_screen WHERE screenId = %d', $screen['id']))
					|| $prev_amount_schedules != $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'screen_scheduling WHERE screenId = %d', $screen['id']))
				) {
				$wpdb->update($prefix.'screen',
					array(
						'name' => $screen['name'],
						'ratio' => $screen['ratio'],
						'templateId' => $screen['templateId'],
						'customTemplateId' => $screen['customTemplateId'],
						'formatId' => $screen['formatId'],
						'change_date' => time()
					),
					array(
						'id' => $screen['id']
					)
				);
			}
			$screen_id = $screen['id'];
		} else {
			$screen_id = $this->insert_screen($screen);
		}
		return $screen_id;
	}

	private function insert_screen( $screen ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$screen['ratio'] = number_format($screen['ratio'], 5);
		$screen['formatId'] = $this->get_or_make_format_id($screen['formatId'], $screen['ratio'], $screen['format_type']);
		$wpdb->insert($prefix.'screen',
			array(
				'name' => $screen['name'],
				'ratio' => $screen['ratio'],
				'templateId' => $screen['templateId'],
				'customTemplateId' => $screen['customTemplateId'],
				'formatId' => $screen['formatId'],
				'change_date' => time()
			)
		);
		$screen['id'] = $wpdb->insert_id;
		foreach ($screen['elements'] as $element) {
			$elem_id = $this->create_or_update_screen_element($element);
			if ($elem_id > -1) {
				$wpdb->insert($prefix.'screen_element_screen',
					array(
						'screenId' => $screen['id'],
						'screen_elementId' => $elem_id,
						'pos_nr' => $element['pos_nr']
					)
				);
			}
		}
		foreach ($screen['schedules'] as $schedule) {
			$schedule_id = $this->create_or_update_schedule($schedule);
			if ($schedule_id > -1) {
				$wpdb->insert($prefix.'screen_scheduling',
					array(
						'screenId' => $screen['id'],
						'schedulingId' => $schedule_id
					)
				);
			}
		}
		return $screen['id'];
	}

	private function get_or_make_format_id($formatId, $ratio, $format_type) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$ratio = substr($ratio, 0, 7);
		if ($formatId > -1) {
			if ($ratio > 0 && $format_type > 0) {
				$query = $wpdb->prepare('SELECT * FROM '.$prefix.'format WHERE id = %d AND ratio = %f AND type = %d', $formatId, $ratio, $format_type);
			} else {
				$query = $wpdb->prepare('SELECT * FROM '.$prefix.'format WHERE id = %d', $formatId);
			}
			$result = $wpdb->get_row($query, ARRAY_A);
			if (isset($result)) {
				$formatId = $result['id'];
			} else {
				if ($ratio > 0 && $format_type > 0) {
					$typename = array(1 => 'landscape', 2 => 'portrait');
					$wpdb->insert($prefix.'format',
						array(
							'type' => $format_type,
							'typename' => $typename[$format_type],
							'ratio' => $ratio
						)
					);
					$formatId = $wpdb->insert_id;
				} else {
					$formatId = -1;
				}
			}
		} else {
			if ($ratio > 0 && $format_type > 0) {
				$result = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'format WHERE ratio = %f AND type = %d', $ratio, $format_type), ARRAY_A);
				if (isset($result)) {
					$formatId = $result['id'];
				} else {
					$typename = array(1 => 'landscape', 2 => 'portrait');
					$wpdb->insert($prefix.'format',
						array(
							'type' => $format_type,
							'typename' => $typename[$format_type],
							'ratio' => $ratio
						)
					);
					$formatId = $wpdb->insert_id;
				}
			} else {
				$formatId = -1;
			}
		}
		return $formatId;
	}

	private function get_format_by_id($formatId) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$format = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'format WHERE id = %d', $formatId), ARRAY_A);
		if (!isset($format)) {
			$format = null;
		}
		return $format;
	}

	private function create_or_update_screen_element( $element ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$changed = false;
		if ($element['id'] > -1) {
			$elem_orig = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'screen_element WHERE id = %d', $element['id']), ARRAY_A);
			if (isset($elem_orig)) {
				if ($element['name'] != $elem_orig['name'] || addslashes($element['htmlcode']) != $elem_orig['htmlcode']) {
					$changed = true;
					$wpdb->update($prefix.'screen_element',
						array(
							'name' => $element['name'],
							'htmlcode' => addslashes($element['htmlcode'])
						),
						array(
							'id' => $element['id']
						)
					);
				}
			} else {
				$element['id'] = -1;
			}
		}
		if ($element['id'] < 0) {
			$wpdb->insert($prefix.'screen_element',
				array(
					'name' => $element['name'],
					'htmlcode' => addslashes($element['htmlcode'])
				)
			);
			$element['id'] = $wpdb->insert_id;
			$changed = true;
		}
		if ($changed) {
			$screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'screen_element_screen WHERE screen_elementId = %d', $element['id']), ARRAY_A);
			if (isset($screens)) {
				$now = time();
				foreach ($screens as $screen) {
					$program_screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'program_screen WHERE screenId = %d', $screen['screenId']), ARRAY_A);
					if (isset($program_screens)) {
						foreach ($program_screens as $program_screen) {
							$wpdb->update($prefix.'device', array('changedate' => $now), array('programId' => $program_screen['programId']));
						}
						$wpdb->query($wpdb->prepare("UPDATE ".$prefix."program SET change_date = %d WHERE id in (SELECT programId FROM ".$prefix."program_screen WHERE screenId = %d)", $now, $screen['screenId']));
					}
				}
				$wpdb->query($wpdb->prepare("UPDATE ".$prefix."screen SET change_date = %d WHERE id in (SELECT screenId FROM ".$prefix."screen_element_screen WHERE screen_elementId = %d)", $now, $element['id']));
			}
		}
		return $element['id'];
	}

	private function create_or_update_schedule( $schedule ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$changed = false;
		if ($schedule['id'] > -1) {
			$schedule_orig = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'scheduling WHERE id = %d', $schedule['id']), ARRAY_A);
			if (isset($schedule_orig)) {
				$types = array("permanent", "startdate", "enddate", "playduration",
					"weekday_start", "weekday_start_time_h", "weekday_start_time_m",
					"weekday_end", "weekday_end_time_h", "weekday_end_time_m",
					"day_of_month_start", "day_of_month_end"
				);
				$update_val = array();
				foreach($types as $type) {
					$update_val[$type] = $schedule[$type];
					if ($update_val[$type] != $schedule_orig[$type]) {
						$changed = true;
					}
				}
				if ($changed) {
					$wpdb->update($prefix.'scheduling',
						$update_val,
						array(
							'id' => $schedule['id']
						)
					);
				}
			} else {
				$schedule['id'] = -1;
			}
		}
		if ($schedule['id'] < 0) {
			$update_val = $schedule;
			unset($update_val['id']);
			$wpdb->insert($prefix.'scheduling',
				$update_val
			);
			$schedule['id'] = $wpdb->insert_id;
			$changed = true;
		}
		if ($changed) {
			$screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'screen_scheduling WHERE schedulingId = %d', $schedule['id']), ARRAY_A);
			if (isset($screens)) {
				$now = time();
				foreach ($screens as $screen) {
					$program_screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'program_screen WHERE screenId = %d', $screen['screenId']), ARRAY_A);
					if (isset($program_screens)) {
						foreach ($program_screens as $program_screen) {
							$wpdb->query($wpdb->prepare("UPDATE ".$prefix."device SET changedate = %d WHERE programId = %d", $now, $program_screen['programId']));
						}
						$wpdb->query($wpdb->prepare("UPDATE ".$prefix."program SET change_date = %d WHERE id in (SELECT programId FROM ".$prefix."program_screen WHERE screenId = %d)", $now, $screen['screenId']));
					}
				}
				$wpdb->query($wpdb->prepare("UPDATE ".$prefix."screen SET change_date = %d WHERE id in (SELECT screenId FROM ".$prefix."screen_scheduling WHERE schedulingId = %d)", $now, $schedule['id']));
			}
		}
		return $schedule['id'];
	}

	private function update_program( $program ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$prev_program = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'program WHERE id = %d', $program['id']), ARRAY_A);
		if (isset($prev_program)) {
			$changed = false;
			$known_ids = array();
			$old_max_changedate = $wpdb->get_var($wpdb->prepare('SELECT max(change_date) FROM '.$prefix.'screen WHERE id IN (SELECT screenId FROM '.$prefix.'program_screen WHERE programId = %d)', $program['id']));
			foreach ($program['screens'] as $prog_screen) {
				$old_screen_id = $prog_screen['id'];
				$screen_id = $this->insert_or_update_screen($prog_screen);
				if ($screen_id > -1) {
					$result = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'program_screen WHERE programId = %d AND screenId = %d', $program['id'], $screen_id), ARRAY_A);
					if (isset($result)) {
						if ($result['screenOrder'] != $prog_screen['screenOrder']) {
							$wpdb->update($prefix.'program_screen',
								array(
									'screenOrder' => $prog_screen['screenOrder']
								),
								array(
									'id' => $result['id']
								)
							);
							$changed = true;
						}
					} else {
						$is_father = ($old_screen_id < 0 || $old_screen_id != $screen_id);
						$wpdb->insert($prefix.'program_screen',
							array(
								'programId' => $program['id'],
								'screenId' => $screen_id,
								'screenOrder' => $prog_screen['screenOrder'],
								'is_father_of_screen' => $is_father
							)
						);
						$changed = true;
					}
					$known_ids[] = $screen_id;
				}
			}
			if (!$changed) {
				$new_max_changedate = $wpdb->get_var($wpdb->prepare('SELECT max(change_date) FROM '.$prefix.'screen WHERE id IN (SELECT screenId FROM '.$prefix.'program_screen WHERE programId = %d)', $program['id']));
				if ($old_max_changedate != $new_max_changedate) {
					$changed = true;
				}
			}
			$prev_amount_screen = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_screen WHERE programId = %d', $program['id']));
			$delete_query = 'DELETE FROM '.$prefix.'program_screen WHERE programId = %d';
			$preparelist = array($program['id']);
			if (count($known_ids) > 0) {
				$delete_query .= ' AND screenId NOT IN (';
				$first_elem = true;
				foreach ($known_ids as $known_id) {
					if ($first_elem) {
						$first_elem = false;
					} else {
						$delete_query .= ',';
					}
					$delete_query .= '%d';
					$preparelist[] = $known_id;
				}
				$delete_query .= ' )';
			}
			$wpdb->get_results($wpdb->prepare($delete_query, $preparelist));
			$known_schedule_ids = array();
			foreach ($program['schedules'] as $schedule) {
				$schedule_id = $this->create_or_update_schedule($schedule);
				if ($schedule_id > -1) {
					$result = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_screen_scheduling WHERE programId = %d AND schedulingId = %d', $program['id'], $schedule_id));
					if ($result == 0) {
						$wpdb->insert($prefix.'program_screen_scheduling',
							array(
								'programId' => $program['id'],
								'schedulingId' => $schedule_id
							)
						);
						$changed = true;
					}
					$known_schedule_ids[] = $schedule_id;
				}
			}
			$prev_amount_schedules = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_screen_scheduling WHERE programId = %d', $program['id']));
			$delete_query = 'DELETE FROM '.$prefix.'program_screen_scheduling WHERE programId = %d';
			$preparelist = array($program['id']);
			if (count($known_schedule_ids) > 0) {
				$delete_query .= ' AND schedulingId NOT IN (';
				$first_elem = true;
				foreach ($known_schedule_ids as $known_id) {
					if ($first_elem) {
						$first_elem = false;
					} else {
						$delete_query .= ',';
					}
					$delete_query .= '%d';
					$preparelist[] = $known_id;
				}
				$delete_query .= ')';
			}
			$wpdb->get_results($wpdb->prepare($delete_query, $preparelist));

			$known_program_ids = array();
			foreach($program['programs'] as $sub_prog) {
				$sub_prog_id = $this->insert_or_update_program($sub_prog);
				if ($sub_prog_id > -1) {
					$result = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'program_program WHERE programId = %d AND subProgId = %d', $program['id'], $sub_prog_id));
					if (isset($result)) {
						if ($result['programOrder'] != $sub_prog['programOrder']) {
							$wpdb->update($prefix.'program_program',
								array(
									'programOrder' => $sub_prog['programOrder']
								),
								array(
									'id' => $result['id']
								)
							);
							$changed = true;
						}
					} else {
						$wpdb->insert($prefix.'program_program',
							array(
								'programId' => $program['id'],
								'subProgId' => $sub_prog['id']
							)
						);
						$changed = true;
					}
					$known_program_ids[] = $sub_prog_id;
				}
			}
			$prev_amount_program = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_program WHERE programId = %d', $program['id']));
			$delete_query = 'DELETE FROM '.$prefix.'program_program WHERE programId = %d';
			$preparelist = array($program['id']);
			if (count($known_program_ids) > 0) {
				$delete_query .= ' AND subProgId NOT IN (';
				$first_elem = true;
				foreach ($known_program_ids as $known_id) {
					if ($first_elem) {
						$first_elem = false;
					} else {
						$delete_query .= ',';
					}
					$delete_query .= '%d';
					$preparelist[] = $known_id;
				}
				$delete_query .= ')';
			}
			$wpdb->get_results($wpdb->prepare($delete_query, $preparelist));
			if ($changed || $prev_program['name'] != $program['name']
					|| $prev_amount_screen != $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_screen WHERE programId = %d', $program['id']))
					|| $prev_amount_schedules != $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_screen_scheduling WHERE programId = %d', $program['id']))
					|| $prev_amount_program != $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'program_program WHERE programId = %d', $program['id']))
					) {
				$wpdb->update($prefix.'program',
					array(
						'name' => $program['name'],
						'change_date' => time()
					),
					array(
						'id' => $program['id']
					)
				);
				$wpdb->update($prefix.'device', array('changedate' => time()), array('programId' => $program['id']));
			}
			$program_id = $program['id'];
		} else {
			$program_id = $this->insert_program($program);
		}
		return $program_id;
	}

	private function insert_program( $program ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$wpdb->insert($prefix.'program',
			array(
				'name' => $program['name'],
				'change_date' => time()
			)
		);
		$program['id'] = $wpdb->insert_id;
		foreach ($program['screens'] as $prog_screen) {
			$old_screen_id = $prog_screen['id'];
			$screen_id = $this->insert_or_update_screen($prog_screen);
			if ($screen_id > -1) {
				$is_father = ($old_screen_id < 0 || $old_screen_id != $screen_id);
				$wpdb->insert($prefix.'program_screen',
					array(
						'programId' => $program['id'],
						'screenId' => $screen_id,
						'screenOrder' => $prog_screen['screenOrder'],
						'is_father_of_screen' => $is_father
					)
				);
				
			}
		}
		foreach ($program['schedules'] as $prog_schedule) {
			$schedule_id = $this->create_or_update_schedule($prog_schedule);
			if ($schedule_id > -1) {
				$wpdb->insert($prefix.'program_screen_scheduling',
					array(
						'programId' => $program['id'],
						'schedulingId' => $schedule_id
					)
				);
			}
		}
		return $program['id'];
	}

	private function update_device( $device ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$prev_device = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'device WHERE id = %d', $device['id']), ARRAY_A);
		if (isset($prev_device)) {
			$changed = false;
			$types = array('programId', 'name', 'location', 'street', 'city', 'zipcode', 'dtp', 'ua', 'ald', 'groupname');

			foreach($types as $type) {
				if ($device[$type] != $prev_device[$type]) {
					$changed = true;
					break;
				}
			}
			if ($changed) {
				$update_val = $device;
				unset($update_val['id']);
				$update_val['changedate'] = time();
				$wpdb->update($prefix.'device',
					$update_val,
					array(
						'id' => $device['id']
					)
				);
			}
			$deviceId = $device['id'];
		} else {
			$deviceId = $this->insert_device($device);
		}
		return $deviceId;
	}

	private function insert_device( $device ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$now = time();
		$wpdb->insert($prefix.'device',
			array(
				'programId' => $device['programId'],
				'name' => $device['name'],
				'location' => $device['location'],
				'street' => $device['street'],
				'city' => $device['city'],
				'zipcode' => $device['zipcode'],
				'last_request' => 0,
				'changedate' => $now,
				'dtp' => $device['dtp'],
				'ua' =>	$device['ua'],
				'ald' => $device['ald'],
				'groupname' => $device['groupname']
			)
		);
		return $wpdb->insert_id;
	}

	private function update_custom_template( $template ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$prev_template = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'custom_template WHERE id = %d', $template['id']), ARRAY_A);
		if (isset($prev_template)) {
			$changed = false;
			$prev_formatId = $template['formatId'];
			$template['formatId'] = $this->get_or_make_format_id($template['formatId'], $template['ratio'], $template['format_type']);
			if ($prev_formatId != $template['formatId']) {
				$changed = true;
			}
			if ($changed || $template['name'] != $prev_template['name'] || addslashes($template['htmlcode']) != $prev_template['htmlcode']) {
				$wpdb->update($prefix.'custom_template',
					array(
						'htmlcode' => addslashes($template['htmlcode']),
						'formatId' => $template['formatId'],
						'name' => $template['name']
					),
					array(
						'id' => $template['id']
					)
				);
				$now = time();
				$screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'screen WHERE customTemplateId = %d', $template['id']), ARRAY_A);
				if (isset($screens)) {
					foreach ($screens as $screen) {
						$program_screens = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'program_screen WHERE screenId = %d', $screen['id']), ARRAY_A);
						if (isset($program_screens)) {
							foreach ($program_screens as $program_screen) {
								$wpdb->update($prefix.'device', array('changedate' => $now), array('programId' => $program_screen['programId']));
							}
							$wpdb->query($wpdb->prepare("UPDATE ".$prefix."program SET change_date = %d WHERE id in (SELECT programId FROM ".$prefix."program_screen WHERE screenId = %d)", $now, $screen['id']));
						}
					}
					$wpdb->update($prefix.'screen', array('change_date' => $now), array('customTemplateId' => $template['id']));
				}
			}
			$template_id = $template['id'];
		} else {
			$template_id = $this->insert_custom_template($device);
		}
		return $template_id;
	}

	private function insert_custom_template( $template ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$template['formatId'] = $this->get_or_make_format_id($template['formatId'], $template['ratio'], $template['format_type']);
		$wpdb->insert($prefix.'custom_template',
			array(
				'formatId' => $template['formatId'],
				'name' => $template['name'],
				'htmlcode' => addslashes($template['htmlcode'])
			)
		);
		return $wpdb->insert_id;
	}
	
	public function make_new_devicewall($wall_rows, $wall_columns, $resolution_w , $resolution_h , $bezel_compensation_w , $bezel_compensation_h , $name, $location, $street, $city, $zipcode, $programId, $portrait, $devicewalldevices) {
		$devicewall = array();
		$devicewall['id'] = -1;
		$devicewall['wall_rows'] = $wall_rows;
		$devicewall['wall_columns'] = $wall_columns;
		$devicewall['resolution_w'] = $resolution_w;
		$devicewall['resolution_h'] = $resolution_h;
		$devicewall['bezel_compensation_w'] = $bezel_compensation_w;
		$devicewall['bezel_compensation_h'] = $bezel_compensation_h;
		$devicewall['name'] = $name;
		$devicewall['location'] = $location;
		$devicewall['street'] = $street;
		$devicewall['city'] = $city;
		$devicewall['zipcode'] = $zipcode;	
		$devicewall['programId'] = $programId;
		$devicewall['portrait'] = $portrait;	
		$devicewall['change_date'] = 0;
		$devicewall['devicewalldevices'] = $devicewalldevices;
		return $devicewall;
	} 
	
	public function make_new_devicewall_device( $devicewallId, $deviceId, $pos_x, $pos_y, $zoom, $resolution_w, $resolution_h, $programId, 
											$name, $location, $street, $city, $zipcode) {
		$devicewall_device = array();
		$devicewall_device['id'] = -1;
		$devicewall_device['devicewallId'] = $devicewallId;
		$devicewall_device['deviceId'] = $deviceId;
		$devicewall_device['pos_x'] = $pos_x;
		$devicewall_device['pos_y'] = $pos_y;
		$devicewall_device['zoom'] = $zoom;
		$devicewall_device['resolution_w'] = $resolution_w;
		$devicewall_device['resolution_h'] = $resolution_h;
		$devicewall_device['programId'] = $programId;
		$devicewall_device['name'] = $name;
		$devicewall_device['location'] = $location;
		$devicewall_device['street'] = $street;
		$devicewall_device['city'] = $city;
		$devicewall_device['zipcode'] = $zipcode;
		return $devicewall_device;
	}
	
	public function insert_or_update_devicewall( $devicewall ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_devicewall';
		$results = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$tablename.' WHERE id = %d', $devicewall['id']));
		if ($results > 0) {
			$devicewall_id = $this->update_devicewall($devicewall);
		} else {
			$devicewall_id = $this->insert_devicewall($devicewall);
		}
		return $devicewall_id;
	}
	
	private function insert_devicewall( $devicewall ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$wpdb->insert($prefix.'devicewall',
			array(
				'wall_rows' => $devicewall['wall_rows'],
				'wall_columns' => $devicewall['wall_columns'],
				'resolution_w' => $devicewall['resolution_w'],
				'resolution_h' => $devicewall['resolution_h'],
				'bezel_compensation_w' => $devicewall['bezel_compensation_w'],
				'bezel_compensation_h' => $devicewall['bezel_compensation_h'],
				'name' => $devicewall['name'],
				'location' => $devicewall['location'],
				'street' => $devicewall['street'],
				'city' => $devicewall['city'],
				'zipcode' => $devicewall['zipcode'],
				'programId' => $devicewall['programId'],
				'portrait' => $devicewall['portrait'],
				'change_date' => time()
			)
		);
		$devicewall['id'] = $wpdb->insert_id;
		foreach ($devicewall['devicewalldevices'] as $element) {
			$element['devicewallId'] = $devicewall['id'];
			$elem_id = $this->create_or_update_devicewall_devices($element );
			if ($elem_id > -1) {
				$element['id'] = $elem_id;
			}
		}
		return $devicewall['id'];
	}
	
	private function update_devicewall( $devicewall ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$prev_devicewall = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'devicewall WHERE id = %d', $devicewall['id']), ARRAY_A);
		if (isset($prev_devicewall)) {
			$changed = false;
			$force_changedate_update = false;
			$types = array('wall_rows', 'wall_columns', 'resolution_w', 'resolution_h', 'bezel_compensation_w', 'bezel_compensation_h', 'programId', 'portrait');

			foreach($types as $type) {
				if ($devicewall[$type] != $prev_devicewall[$type]) {
					$changed = true;
					$force_changedate_update = true;
					break;
				}
			}
			if (!$changed) {
				$types = array('name', 'location', 'street', 'city', 'zipcode', 'refpointcalcts', 'sequencevalidto', 'sequencedur');

				foreach($types as $type) {
					if ($devicewall[$type] != $prev_devicewall[$type]) {
						$changed = true;
						break;
					}
				}
			}
			if ($changed) {
				$devicewallUpdate = $devicewall;
				unset($devicewallUpdate['devicewalldevices']);  
				$update_val = $devicewallUpdate;
				unset($update_val['id']);
				$update_val['change_date'] = time();
				$wpdb->update($prefix.'devicewall',
					$update_val,
					array(
						'id' => $devicewall['id']
					)
				);
			}
			$devicewallId = $devicewall['id'];
			$checkedIds = array();
			foreach($devicewall['devicewalldevices'] as $devicewall_device) {
				$this->update_devicewall_device($devicewall_device);
				$checkedIds[] = $devicewall_device['id'];
				if ($force_changedate_update) {
					$wpdb->update($prefix.'device', array('changedate' => time()), array('id' => $devicewall_device['deviceId']));
				}
			}			
			$tablename = $wpdb->prefix.'ds_devicewall_device';
			$results = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$tablename.' where devicewallId = %d', $devicewallId) , ARRAY_A);
			if ( count($results) > 0 ) {
				foreach ($results as $result) {
					$founddev = false;
					foreach($checkedIds as $checkedId){
						if ($result['id'] == $checkedId){
							$founddev = true;
						}
					}
					if ($founddev == false){
						$this->delete_devicewall_device_by_id($result['id']);
					}
				}
			} 
			
		} else {
			$devicewallId = $this->insert_devicewall($devicewall);
		}
		return $devicewallId;
	}
	
	public function delete_devicewall_by_id( $id ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
                $wpdb->query($wpdb->prepare('DELETE FROM '.$prefix.'device WHERE id in (SELECT deviceId from '.$prefix.'devicewall_device WHERE devicewallId = %d)', $id));
                $wpdb->query($wpdb->prepare('DELETE FROM '.$prefix.'devicewall_device WHERE devicewallId = %d', $id));
		$wpdb->query($wpdb->prepare('DELETE FROM '.$prefix.'devicewall WHERE id = %d', $id));
	}	
	
	public function get_devicewall_by_id( $id ) {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_devicewall';
		$devicewall = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %d', $id), ARRAY_A);
		if (!isset($devicewall)) {
			$devicewall = null;
		} else {
			$tablename = $wpdb->prefix.'ds_devicewall_device';
			$results = $wpdb->get_results($wpdb->prepare('SELECT id FROM '.$tablename.' WHERE devicewallId = %d ORDER BY pos_y, pos_x', $devicewall['id']), ARRAY_A);
			if ( count($results) > 0 ) {
				$devicewalldevices = array();
				foreach ($results as $result) {
					$devicewalldevice = $this->get_devicewall_device_by_id( $result['id'] );
					$devicewalldevices[$devicewalldevice['id']] = $devicewalldevice;
				}				
				$devicewall['devicewalldevices'] = $devicewalldevices;	
			}		
		}
		return $devicewall;
	}
	
	public function get_all_devicewalls() {
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_devicewall';
		$results = $wpdb->get_results('SELECT id FROM '.$tablename.' ORDER BY id', ARRAY_A);
		if ( count($results) > 0 ) {
			$devicewalls = array();
			foreach ($results as $result) {
				$devicewalls[] = $this->get_devicewall_by_id( $result['id'] );
			}
		} else {
			$devicewalls = null;
		}
		return $devicewalls;
	}
	
	
	
	public function insert_or_update_devicewall_devices($devicewall_device ){
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_devicewall_device';
		$results = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$tablename.' WHERE id = %d', $devicewall_device['id']));
		if ($results > 0) {
			$devicewall_device_id = $this->update_devicewall_device($devicewall_device);
		} else {
			$devicewall_device_id = $this->insert_devicewall_device($devicewall_device);
		}
		return $devicewall_device_id;	
	}
	
	private function insert_devicewall_device( $devicewall_device ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		if ($devicewall_device['deviceId'] == -1){
			$device = $this->make_new_device($devicewall_device['name'], $devicewall_device['programId'], $devicewall_device['location'], $devicewall_device['street'], $devicewall_device['city'], $devicewall_device['zipcode']);
			$devicewall_device['deviceId'] = $this->insert_device( $device );
		}
		$wpdb->insert($prefix.'devicewall_device',
			array(
				'devicewallId' => $devicewall_device['devicewallId'],
				'deviceId' => $devicewall_device['deviceId'],
				'pos_x' => $devicewall_device['pos_x'],
				'pos_y' => $devicewall_device['pos_y'],
				'zoom' => $devicewall_device['zoom'],
				'resolution_w' => $devicewall_device['resolution_w'],
				'resolution_h' => $devicewall_device['resolution_h'],
				'change_date' => time()
			)
		);
		$devicewall_device['id'] = $wpdb->insert_id;

		return $devicewall_device['id'];
	}
	
	private function update_devicewall_device( $devicewall_device ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$prev_devicewall_device = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'devicewall_device WHERE id = %d', $devicewall_device['id']), ARRAY_A);
		if (isset($prev_devicewall_device)) {
			$changed = false;
			$types = array('devicewallId', 'deviceId', 'pos_x', 'pos_y', 'zoom', 'resolution_w', 'resolution_h');

			foreach($types as $type) {
				if ($devicewall_device[$type] != $prev_devicewall_device[$type]) {
					$changed = true;
					break;
				}
			}
			
			$prev_device = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'device WHERE id = %d', $devicewall_device['deviceId']), ARRAY_A);
			$changed_device = false;
			if (isset($prev_device)) {
				$types2 = array('programId', 'name', 'location', 'street', 'city', 'zipcode');
	
				foreach($types2 as $type) {
					if ($devicewall_device[$type] != $prev_device[$type]) {
						$prev_device[$type] = $devicewall_device[$type];
						$changed_device = true;

					}
				}
				$device = $prev_device;
			} else {
				$device = $this->make_new_device($devicewall_device['name'], $devicewall_device['programId'], $devicewall_device['location'], $devicewall_device['street'], $devicewall_device['city'], $devicewall_device['zipcode']);
				$devicewall_device['deviceId'] = $this->insert_device( $device );
			}
			if ($changed) {
				$update_val = $devicewall_device;
				unset($update_val['id']);
				unset($update_val['programId']);
				unset($update_val['name']);
				unset($update_val['location']);
				unset($update_val['street']);
				unset($update_val['city']);
				unset($update_val['zipcode']);
				$update_val['change_date'] = time();
				$wpdb->update($prefix.'devicewall_device',
					$update_val,
					array(
						'id' => $devicewall_device['id']
					)
				);
			}
			$devicewall_deviceId = $devicewall_device['id'];
			if ($changed_device) {
				$update_val = $device;
				unset($update_val['id']);
				$update_val['changedate'] = time();
				$wpdb->update($prefix.'device',
					$update_val,
					array(
						'id' => $device['id']
					)
				);
			}
		} else {
			$devicewall_deviceId = $this->insert_devicewall_device($devicewall_device);
		}
		return $devicewall_deviceId;
	}
	
	public function delete_devicewall_device_by_id( $id ) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$devicewall_device = $this->get_devicewall_device_by_id($id);
		$this->delete_device_by_id( $devicewall_device['deviceId'] );
		$wpdb->get_results($wpdb->prepare('DELETE FROM '.$prefix.'devicewall_device WHERE id = %d', $id));
	}

	public function get_devicewall_device_by_device_id( $id ) {
		if(!is_numeric($id)) {
                        return null;
                }
		global $wpdb;
                $tablename = $wpdb->prefix.'ds_devicewall_device';
                $devicewall_device_id = $wpdb->get_var($wpdb->prepare('SELECT id FROM '.$tablename.' WHERE deviceId = %d', $id));	
		return $this->get_devicewall_device_by_id($devicewall_device_id);
	}

	public function get_devicewall_device_by_pos( $devicewallId, $pos_x, $pos_y) {
		global $wpdb;
                $tablename = $wpdb->prefix.'ds_devicewall_device';
                $devicewall_device = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE devicewallId= %d AND pos_x= %d AND pos_y= %d', $devicewallId, $pos_x, $pos_y), ARRAY_A);
                return $devicewall_device;
        }
	
	public function get_devicewall_device_by_id( $id ) {
		if(!is_numeric($id)) {
                        return null;
                }
		global $wpdb;
		$tablename = $wpdb->prefix.'ds_devicewall_device';
		$devicewall_device = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$tablename.' WHERE id = %d', $id), ARRAY_A);
		if (!isset($devicewall_device)) {
			return null;
		} 
		
		$device = $this->get_device_by_id( $devicewall_device['deviceId'] );
		$types = array('programId', 'name', 'location', 'street', 'city', 'zipcode');
		foreach($types as $type) {
			$devicewall_device[$type] =  $device[$type];
		}
		return $devicewall_device;
	}

	public function get_devicewall_by_deviceId($id) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$devicewall = $wpdb->get_var($wpdb->prepare('SELECT id FROM '.$prefix.'devicewall WHERE id = (SELECT devicewallId FROM '.$prefix.'devicewall_device WHERE deviceId = %d LIMIT 1)', $id));
		return $this->get_devicewall_by_id($devicewall);
	}

	public function get_devicewall_device_by_deviceId($id) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$devicewall_device = $wpdb->get_var($wpdb->prepare('SELECT id FROM '.$prefix.'devicewall_device WHERE deviceId = %d LIMIT 1', $id));
		return $this->get_devicewall_device_by_id($devicewall_device);
	}

	public function update_device_programlist($deviceId, $programId) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$prev_device = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'device WHERE id = %d', $deviceId), ARRAY_A);
		if (isset($prev_device)) {
			if ($prev_device['programId'] != $programId) {
				$prog = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'program WHERE id = %d', $programId), ARRAY_A);
				if (isset($prog)) {
					$wpdb->update($prefix.'device',
						array(
							'programId' => $programId,
							'changedate' => time()
						),
						array(
							'id' => $deviceId
						)
					);
				}
			}
		}
	}
	
	public function update_devicewall_programlist($devicewallId, $programId) {
		global $wpdb;
		$prefix = $wpdb->prefix.'ds_';
		$prev_devicewall = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$prefix.'devicewall WHERE id = %d', $devicewallId), ARRAY_A);
		if (isset($prev_devicewall)) {
			if ($prev_devicewall['programId'] != $programId) {
				$changedate = time();
				$wpdb->update($prefix.'devicewall',
					array(
						'change_date' => $changedate,
						'programId' => $programId
					),
					array(
						'id' => $devicewallId
					)
				);
				$devicewall_devices = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$prefix.'devicewall_device WHERE devicewallId = %d', $devicewallId), ARRAY_A);
				foreach($devicewall_devices as $devicewall_device) {
					$wpdb->update($prefix.'devicewall_device',
						array(
							'change_date' => $changedate
						),
						array(
							'id' => $devicewall_device['id']
						)
					);
					$wpdb->update($prefix.'device',
						array(
							'changedate' => $changedate,
							'programId' => $programId
						),
						array(
							'id' => $devicewall_device['deviceId']
						)
					);
				}
			}
		}
	}
}
