<?php
defined( 'ABSPATH' ) or die();
$wp_timezone = get_option('timezone_string');
if (in_array($wp_timezone, DateTimeZone::listIdentifiers())) {
	date_default_timezone_set($wp_timezone);
}
?>
<div class="FullWidthRow">
	<div class="wrapper">
	<?php require_once('navigation_header.php'); ?>
	  	<div class="content-panel col_12_nm mcontent">
	  		<div class="col_12_nm">
				<div class="step-content signage format">
					<table class="program_table">
						<tr>
							<th></th>
							<th colspan="4"><?php _e('Playlistname','digitalsignagepress'); ?></th>
							<th><?php _e('Slides','digitalsignagepress'); ?></th>
							<th><?php _e('Showing','digitalsignagepress'); ?></th>
							<th colspan="2"><?php _e('Format','digitalsignagepress'); ?></th>
							<th colspan="4"><?php _e('Slidenames','digitalsignagepress'); ?></th>
							<th colspan="2"><?php _e('Last Change','digitalsignagepress'); ?></th>
							<th colspan="2"><?php _e('Valid From','digitalsignagepress'); ?></th>
							<th colspan="2"><?php _e('Valid To','digitalsignagepress'); ?></th>
							<th><?php _e('Edit','digitalsignagepress'); ?></th>
							<th><?php _e('Delete','digitalsignagepress'); ?></th>
						</tr>
						<?php
							if (!isset($dsdbh)) {
								require_once(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
								$dsdbh = new DS_DB_Handler();
							}
							global $wpdb;
							function clickableProgramname($progname, $progId) {
								return '<a href="?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_home&PID='.$progId.'">'
									.$progname
									.'</a>';
							}
							function clickableScreenname($screenname, $progId, $screenId) {
								return '<a href="?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_home&PID='.$progId
									.'&SID='.$screenId.'">'
									.$screenname
									.'</a>';
							}
							function editButton($progId, $screenId) {
								return '<a href="?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_home&PID='.$progId
									.($screenId > 0 ? '&SID='.$screenId : '')
									.'">'
									.'<img src="'.SIGNAGE_PLUGIN_DIR.'/icons/edit.svg" style="height:24px;">'
									.'</a>';
							}
							function deleteButton($progId, $screenId, $hasDevice = false) {
								if ($screenId > 0) {
									$onclick = 'onclick="deleteProgramScreen('.$progId.', '.$screenId.');"';
									$help_text = __('Remove this slide from the playlist.','digitalsignagepress');
								} else {
									$onclick = 'onclick="deleteProgram('.$progId.', '.($hasDevice ? "true" : "false").');"';
									$help_text = __('Delete this playlist.','digitalsignagepress');
								}
								return '<img src="'.SIGNAGE_PLUGIN_DIR.'/icons/delete.svg" class="program_delete_button" style="height:24px;" '.$onclick.' title="'.$help_text.'">';
							}
							function tdStartTag($cols, $id, $add_tag) {
								return '<td class="hiddenRow'.($add_tag ? ' dark_bg' : '').'"'.($cols > 1 ? 'colspan="'.$cols.'"' : '').'><div class="collapse collapse_row_'.$id.'">';
							}
							function tdEndTag() {
								return '</div></td>';
							}
							function active_state($id) {
								return '<img '.($id > 0 ? 'id="img_'.$id.'"' : '').' src="'.SIGNAGE_PLUGIN_DIR.'/icons/active.svg" style="height:32px;" title="'
									.($id > 0 ? '' : __('This slide is currently active.','digitalsignagepress')).'">';
							}
							function inactive_state($id) {
								return '<img '.($id > 0 ? 'id="img_'.$id.'"' : '').' src="'.SIGNAGE_PLUGIN_DIR.'/icons/inactive.svg" style="height:32px;" title="'
									.($id > 0 ? '' : __('This slide is currently not showing because of scheduling.','digitalsignagepress')).'">';
							}
							$programs = $dsdbh->get_all_programs(true);
							$day_of_month = intval(date('j'), 10);
							$day_of_week = intval(date('w'), 10) + 1;
							$hour_of_day = intval(date('H'), 10);
							$min_of_day = intval(date('i'), 10) + 60 * $hour_of_day;
							$time = time();
							if (isset($programs)) {
							foreach($programs as $program) {
								$format = '';
								if (isset($program['screens']) && !empty($program['screens'])) {
									$format = current($program['screens']);
									$format = $format['format_type'];
									if ($format == 1) {
										$format = 'Landscape';
									} else {
										$format = 'Portrait';
									}
								}
								$valid_from = '';
								$valid_to = '';
								if (count($program['screens']) > 0) {
									$state = active_state($program['id']);
								} else {
									$state = inactive_state($program['id']);
								}
								echo '<tr id="prog_'.$program['id'].'">';
								echo '<td>'.(count($program['screens']) ? '<div data-toggle="collapse" data-target=".collapse_row_'.$program['id'].'" class="collapse_image collapse collapse_row_'.$program['id'].'"></div></td>' : '</td>');
								echo '<td colspan="4">'.clickableProgramname(!empty($program['name']) ? $program['name'] : '('.__('nameless playlist', 'digitalsignagepress').')', $program['id']).'</td>';
								echo '<td id="count_'.$program['id'].'">'.count($program['screens']).'</td>';
								echo '<td>'.$state.'</td>';
								echo '<td colspan="2">'.$format.'</td>';
								echo '<td colspan="4"></td>';
								echo '<td colspan="2">'.date('Y-m-d H:i', $program['change_date']).'</td>';
								echo '<td colspan="2">'.$valid_from.'</td>';
								echo '<td colspan="2">'.$valid_to.'</td>';
								echo '<td>'.editButton($program['id'], -1).'</td>';
								$devices = $wpdb->get_var($wpdb->prepare('SELECT count(*) FROM '.$wpdb->prefix.'ds_device WHERE programId = %d', $program['id']));
								echo '<td>'.deleteButton($program['id'], -1, ($devices > 0)).'</td></tr>';
								foreach($program['screens'] as $screen) {
									$state = inactive_state(-1);
									$valid_from = '0000-00-00';
									$valid_to = '0000-00-00';
									if (count($screen['schedules']) > 0) {
										foreach($screen['schedules'] as $schedule) {
											if ($schedule['permanent']) {
												$valid_from = date('Y-m-d', $screen['change_date']);
												$valid_to = '2999-12-31';
											} else {
												if ($schedule['startdate'] <= 0 || $schedule['enddate'] <= 0) {
													$valid_from = date('Y-m-d', $screen['change_date']);
													$valid_to = '2999-12-31';
												} else {
													$valid_from = date('Y-m-d', $schedule['startdate']);
													$valid_to = date('Y-m-d', $schedule['enddate']);
												}
											}
											if (!$schedule['permanent']) {
												if ($schedule['startdate'] > 0 && $schedule['startdate'] > $time
													|| $schedule['enddate'] > 0 && $schedule['enddate'] < $time) {
													continue;
												}
											}
											if ($schedule['weekday_start'] > 0 && $schedule['weekday_start'] < 8 && $schedule['weekday_start'] > $day_of_week
												|| $schedule['weekday_end'] > 0 && $schedule['weekday_end'] < 8 && $schedule['weekday_end'] < $day_of_week
												|| $schedule['weekday_start_time_h'] > 0 && $schedule['weekday_start_time_m'] > 0 &&
													($schedule['weekday_start_time_m'] + 60*$schedule['weekday_start_time_h'] > $min_of_day)
												|| $schedule['weekday_end_time_h'] > 0 && $schedule['weekday_end_time_m'] > 0 &&
													($schedule['weekday_end_time_m'] + 60*$schedule['weekday_end_time_h'] < $min_of_day)
												|| $schedule['weekday_start'] > 1000 && $schedule['weekday_start'] > $time
												|| $schedule['weekday_end'] > 1000 && $schedule['weekday_end'] < $time) {
												continue;
											}
											$state = active_state(-1);
											break;
										}
									} else {
										$valid_from = date('Y-m-d', $screen['change_date']);
										$valid_to = '2999-12-31';
										$state = active_state(-1);
									}
									echo '<tr id="prog_'.$program['id'].'_'.$screen['id'].'" class="prog_'.$program['id'].'" style="display:none;">'.tdStartTag(1, $program['id'], false).tdEndTag();
									echo tdStartTag(4, $program['id'], false).tdEndTag();
									echo tdStartTag(1, $program['id'], false).tdEndTag();
									echo tdStartTag(1, $program['id'], true).$state.tdEndTag();
									$format = $screen['format_type'];
									if ($format == 1) {
										$format = 'Landscape';
									} else {
										$format = 'Portrait';
									}
									echo tdStartTag(2, $program['id'], true).$format.tdEndTag();
									echo tdStartTag(4, $program['id'], true).clickableScreenname(!empty($screen['name']) ? $screen['name'] : '('.__('nameless slide', 'digitalsignagepress').')', $program['id'], $screen['id']).tdEndTag();
									echo tdStartTag(2, $program['id'], true).date('Y-m-d H:i', $screen['change_date']).tdEndTag();
									echo tdStartTag(2, $program['id'], true).$valid_from.tdEndTag();
									echo tdStartTag(2, $program['id'], true).$valid_to.tdEndTag();
									echo tdStartTag(1, $program['id'], true).editButton($program['id'], $screen['id']).tdEndTag();
									echo tdStartTag(1, $program['id'], true).deleteButton($program['id'], $screen['id'], false).tdEndTag().'</tr>';
								}
							}
							}
						?>
					</table>		
				</div>	
			</div>
	  	</div>
  	</div>
	<script type="text/javascript">
		jQuery('.hiddenRow').on('hidden.bs.collapse', function(e) {
			e.currentTarget.parentElement.style.display='none';
		});
		jQuery('.hiddenRow').on('show.bs.collapse', function(e) {
			e.currentTarget.parentElement.style.display='';
		});
		function deleteProgram(progId, hasDevice) {
			var confirmation = "<?php _e('Are you sure you want to permanently delete this playlist?','digitalsignagepress'); ?>";
			if (hasDevice) {
				confirmation = "<?php _e('Are you sure you want to permanently delete this playlist?','digitalsignagepress');?>\n<?php _e('Devices that use this playlist will have their playlist entry removed.','digitalsignagepress'); ?>";
			}
			if (confirm(confirmation)) {
				jQuery.ajax({
					url:"<?php echo admin_url( 'admin-ajax.php' ); ?>",
					data:{"action": "signage_delete_program_ajax",
						"program": progId
					},
					type:"post",
					cache:false
				}).done (function(data) {
					if (data=="success") {
						jQuery('.prog_'+progId).remove();
						jQuery('#prog_'+progId).remove();
					}
				});
			}
		}
		function deleteProgramScreen(progId, screenId) {
			if (confirm("<?php _e('Are you sure you want to remove this slide from the program?','digitalsignagepress'); ?>")) {
				jQuery.ajax({
					url:"<?php echo admin_url( 'admin-ajax.php' ); ?>",
					data:{"action": "signage_delete_programscreen_ajax",
						"program": progId,
						"screen":screenId
					},
					type:"post",
					cache:false
				}).done (function(data) {
					if (data=="success") {
						jQuery('#prog_'+progId+'_'+screenId).remove();
						if (jQuery('.prog_'+progId).length == 0) {
							jQuery('img[src="<?php echo SIGNAGE_PLUGIN_DIR.'/icons/active.svg';?>"]#img_'+progId).attr('src', "<?php echo SIGNAGE_PLUGIN_DIR.'/icons/inactive.svg';?>");
							jQuery('.collapse_row_'+progId).css('display', 'none');
						}
						document.getElementById('count_'+progId).innerHTML = ""+jQuery('.prog_'+progId).length;
					}
				});
			}
		}
	</script>
 </div>
