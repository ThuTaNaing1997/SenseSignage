<?php
defined( 'ABSPATH' ) or die();
$plugindir = SIGNAGE_PLUGIN_DIR;
require_once(SIGNAGE_PLUGIN_DIR_PATH.'/pages/ds_loading_header.php');
?>
<div class="FullWidthRow">
<div id="wrapper">
<script>var bcolor="1783C6"</script>
	<?php
		if (!isset($dsdbh)) {
			require_once(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
			$dsdbh = new DS_DB_Handler();
		}
		$allTemplatesString = "";
		$allLandscIconsString = "";
		$allPortraitIconsString = "";
		$allTemplatesIconsString = "";
		$fav_templates = array();
		$allLandscIconsString .= "<div id=\"layout-custom-landscape\"><img src=\"". $plugindir."/templates/screen_custom_landscape.jpg\" id=\"plandscape\" class=\"pict-l owlselected\" onclick=\"ds_updateTemplateBorder(event); jQuery.fn.changeDisplayedTemplate(true, 0, '', '')\">";
		$allLandscIconsString .= "<div style='/*padding-top: 8px;*/ padding-left: 17px; position: absolute; color: white; margin-top: -71px;' id=\"plandscapetext\">". __('custom editor','digitalsignagepress') ."</div></div>";
		$allPortraitIconsString .= "<div id=\"layout-custom-portrait\"><img src=\"". $plugindir."/templates/screen_custom_portrait.jpg\" id=\"pportrait\" class=\"pict-p\" onclick=\"ds_updateTemplateBorder(event); jQuery.fn.changeDisplayedTemplate(true, 0, '', '')\">";
		$allPortraitIconsString .= "</div>";
		$templates = $dsdbh->get_regular_templates();
		$counter = 1;
		if (isset($templates)) {
			foreach ($templates as $template) {
				$filepathT = SIGNAGE_PLUGIN_DIR_PATH.'/templates/'.$template['filename'];
				$templString = file_get_contents($filepathT);
				$allTemplatesString .= "wordPressTemplateArray[".$counter."] = ".json_encode($templString)." \n\n";
				$allTemplatesIconsString .= " wordPressTemplateIconArray[".$counter."] = \"". $plugindir.'/templates/'. $template['preview_filename'] . "\" \n\n";
				$fav_class='';
				if ($template['formatId'] == 1) {
					$allLandscIconsString .= "<div id=\"owl-item-landscape\"".$fav_class."><img src=\"". $plugindir.'/templates/'. $template['preview_filename'] . "\" id=\"plandscape\" class=\"pict-l template".$template['id']."\" onclick=\"ds_updateTemplateBorder(event); jQuery.fn.changeDisplayedTemplate(" . "false, ". $template['number'] .", '', '' )\">";
					$allLandscIconsString .= "</div>";
				} else if ($template['formatId'] == 2){
					$allPortraitIconsString .= "<div id=\"owl-item-portrait\"".$fav_class."><img src=\"". $plugindir.'/templates/'. $template['preview_filename']. "\" id=\"pportrait\" class=\"pict-p template".$template['id']."\" onclick=\"ds_updateTemplateBorder(event); jQuery.fn.changeDisplayedTemplate(" . "false, ". $template['number'] .", '', '' )\">";
					$allPortraitIconsString .= "</div>";

				}
			
				$counter++;
			}
		}
		$customTemplatesString = "";
		$templates = $dsdbh->get_custom_templates();
		$counter = 1;
		if (isset($templates)) {
			foreach ($templates as $template) {
				$customTemplatesString .= "customTemplateArray[".$counter."] = ".json_encode($template['htmlcode'])." \n\n";
				$counter++;
			}
		}
		require_once('navigation_header.php');
		require_once(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_handle_load.php');
		?>
                <div id="titletabs_placeholder"></div>
		<div id="side-panel" style="width: 12.8%; z-index:5; overflow-x:hidden;" class="col_02 side-panel">
		    <div id="side-panel_box" class="col_12">
		      <div class="box-bg">
		       <div class="lable"><?php _e('Signage Playlist Name:','digitalsignagepress'); ?></div>
			<div class="required">
			  <input id="signage-title" type="text" autofocus="" value="" maxlength="50" autocomplete="off" onchange="ds_updateProgramTitle()" onkeyup="ds_updateProgramTitle()">
			</div>
			<div class="spacer_01"></div>
			<button id="tabhead_new_button" class="big-icon-button" onclick="ds_createNewSlide();">
			  <div class="navi-icon icon-nav-home" style="float: right;"></div>
			  <div class="createslide_button"><?php _e('Create New Slide','digitalsignagepress'); ?></div>
			</button>
			<div id="screen-list_spacer" class="spacer_01" style="display: none;"></div>
			<div id="screen-list_label" class="lable" style="display: none;"><?php _e('Slides of this Playlist','digitalsignagepress'); ?></div>
			<div id="screen-list" class="screen-list" style="display: none;">
			  <ul id="titletabs" style="min-width:150px; max-width: 257px;">
			    <li id="tabhead0" class="tabheads active" onclick="ds_switchTab(0);ds_unhideTab(0);" draggable="true" ondragstart="ds_drag(0);"  style="background-color: #1783C6; padding-bottom: 1px;">
				<a id="tabtitle0" class="screen-list-button-active"><?php _e('New Slide','digitalsignagepress'); ?> 1</a>
				<div class="screen-quick-menu">
				<ul class="screen-submenu">
				  <li id="litabdelete0" onclick="ds_deleteTab(event, 0);"><a class="screen-delete"></a></li>
				  <li id="litabswitch0"><a id="litabmodal0" href="#" class="screen-edit" onclick="ds_callModal(0);" data-toggle="modal" data-target="#modal0"></a></li>
				</ul>
				</div>
					<img id="tabheadsimg0" src="" style="margin-left: auto; margin-right: auto; height: 124px; /*width: 149px;*/ display:none; max-width: 100%;" class="tabheadsimg" onclick="" >
					<div id="tabheadsdplayd0" style="display: none; margin-bottom: 12px;">
						<div class="lable text-left" style="margin-top: 7px; margin-left: 1px;"><?php _e('Slideduration','digitalsignagepress'); ?></div>
						<input placeholder="0" type="number" id="playduration0" name="playduration0" onkeyup="ds_updatePlayduration(0)" onchange="ds_updatePlayduration(0)" style="position: absolute; right: 32px; bottom: 6px; width: 7em;" min="0" max="99999" value="" class="ds-input-check-value">
						<span style="position: absolute; right: 3px; bottom: 12px; color: white;"> <?php _e('Sec.','digitalsignagepress'); ?> </span>
					</div>
			     </li>
			  </ul>
			</div>
		      </div>
		    </div>
		</div>
		<div id="side-panel_sub" style="width: 12.8%; z-index: 5; " class="col_02 side-panel_sub">
		    <div id="side-panel_box_sub" class="col_12">
		      <div class="box-bg">
		        <input class="big-btn lead-button-big myDS_savebutton" onclick="saveinput();" value="<?php _e('Save','digitalsignagepress'); ?>" type="button" style="float: left">
		        <input class="big-btn lead-button-big myDS_previewbutton" onclick="previewds();" value="<?php _e('Preview','digitalsignagepress'); ?>" type="button" style="float: right">
		      </div>
		    </div>
		</div>
		<div class="col_10 right content-panel" style="width: 84.48148% ; z-index: 0; position: inherit; position: initial; ">
			<div class="col_12_nm">
				<div id="box-bg-overlay1" class="box-bg" style="z-index:1000; background-color: rgba(30,30,30,0.5);position:absolute;height:100%;">
				</div>
				<div class="box-bg">
				<div class="col_02">
					<div class="col_12_nm">
						<div class="lable text-left" style="margin-top: 0px;"><?php _e('Layout', 'digitalsignagepress'); ?>:</div>
						</div>
					<div class="col_12_nm" id="layout">
							<div class="col_04 layout_selector" title="<?php _e('Choose landscape or portrait layout as your page orientation.', 'digitalsignagepress'); ?>">
								<div class="col_square_ratio"></div>
								<div id="selector_landscape">
									<img id="btn-switch-landscape-original" class="centered_element" src="<?php echo $plugindir.'/img/screen_landscape.gif'; ?>" alt="landscape" onclick="ds_call_hideportrait();" style="width: 95%;max-height:100%;">
									<img id="btn-switch-landscape-original_selected" class="centered_element_nopointer" src="<?php echo $plugindir.'/img/screen_landscape_selected.gif'; ?>" alt="landscape" style="width: 95%;max-height:100%;">
								</div>
							</div>
							<div class="col_04 layout_selector" title="<?php _e('Choose landscape or portrait layout as your page orientation.', 'digitalsignagepress'); ?>">
								<div class="col_square_ratio"></div>
								<div id="selector_portrait">
									<img id="btn-switch-portrait-original" class="centered_element" src="<?php echo $plugindir.'/img/screen_portrait.gif'; ?>" alt="portrait" onclick="ds_call_hidelandscape();" style="height: 95%;max-width:100%;">
									<img id="btn-switch-portrait-original_selected" class="centered_element_nopointer" src="<?php echo $plugindir.'/img/screen_portrait_selected.gif'; ?>" alt="portrait" style="height: 95%;max-width:100%;">
								</div>
							</div>
					</div>
				</div>
				<div class="col_10">
					<div class="template-slider">
						<div id="step-content-layout" title="<?php _e('Choose the page or menu card template or use custom template to freely place elements on the entire page.', 'digitalsignagepress'); ?>">
							<div class="carousel_nav_prev" onclick="carousel_nav(0);">
								<img class="centered_element" src="<?php echo $plugindir.'/img/screen_nav_left.png'; ?>">
							</div>
							<div class="carousel_nav_next" onclick="carousel_nav(1);">
								<img class="centered_element" src="<?php echo $plugindir.'/img/screen_nav_right.png'; ?>">
							</div>
							<div id="themelandscapepreview">
								<div class="owl-carousel_padder">
									<div class="owl-carousel1">
									<?php
										echo $allLandscIconsString;
									?>
									</div>
								</div>
							</div>					
							<div id="themeportraitpreview">
								<div class="owl-carousel_padder">
									<div class="owl-carousel2">
									<?php
										echo $allPortraitIconsString;
									?>
									</div>
								</div>			
							</div>
						</div>
					</div>
				</div>
			</div></div>
			<script type="text/javascript">var lmzcal = true;var uploadUrl = "<?php echo admin_url( 'admin-ajax.php' ); ?>";</script>
			<script type="text/javascript" src="<?php echo $plugindir.'/js/ds_admin.js';?>"></script>
				<div class="col_12_nm">
					<div id="box-bg-overlay2" class="box-bg" style="z-index:1000; background-color: rgba(30,30,30,0.5);position:absolute;height:100%;">
					</div>
					<div id="workbench_box" class="box-bg">
						<div class="step-content signage format" style="width:1300px;display:inline-block;">
								<script type="text/javascript">
								var wordPressTemplateArray = new Array();
								var customTemplateArray = new Array('');
								var wordPressTemplateIconArray = new Array();
								jQuery.fn.loadTemplates = function(){

                                                                    <?php
                                                                    echo $allTemplatesString;
                                                                    echo $customTemplatesString;
                                                                    echo $allTemplatesIconsString;
                                                                    ?>
                                                                };
								var owl_position = 0;
								</script>
							<?php
								include('editor.php');
							?> 
							<script type="text/javascript" src="<?php echo $plugindir.'/js/ds-editor.js';?>"></script>
							<script type="text/javascript" src="<?php echo $plugindir.'/js/ds-editor-functions.js';?>"></script>
							<script type="text/javascript" src="<?php echo $plugindir.'/js/ds-editor-presentation.js';?>"></script>
							<script type="text/javascript" src="<?php echo $plugindir.'/js/own-scripts-1.js';?>"></script>
						</div>
					</div>
				</div>
				<div class="col_12_nm">
					<div id="box-bg-overlay3" class="box-bg" style="z-index:1000; background-color: rgba(30,30,30,0.5);position:absolute;height:100%;">
					</div>
					<div class="box-bg">
					<div class="w1280">
						<div class="ds-editor-label" style="float: left; padding-right: 5px;"><?php _e('Scheduling of','digitalsignagepress'); ?></div><div id="schedule_slidetitle" class="ds-editor-label" title="<?php _e('If you do not schedule something the slide will be always active','digitalsignagepress'); ?>"></div>
						<div class="col_12" title="<?php _e('Number of seconds this slide will be shown each repetition. Use 0 for endless.','digitalsignagepress'); ?>">
						<div class="col_12_nm">
                                                    <div class="label text-left" style="padding-bottom: 5px;">
                                                        <input type="radio" id="sched_rad_1" name="sched_rad" value="show24h" checked onclick="ds_deleteAllScheduling(); jQuery('.collapse_scheduling').css('height','0px');">
                                                        <label for="sched_rad_1" style="font-size: 16px"><?php _e('show 24h every Day','digitalsignagepress'); ?></label>
                                                    </div>
						</div>
						<div class="col_12_nm">
                                                    <div class="label text-left">
                                                        <input type="radio" id="sched_rad_2" name="sched_rad" value="showsched" onclick="jQuery('.collapse_scheduling').css('visibility', 'visible'); jQuery('.collapse_scheduling').css('height','100%');jQuery('.collapse_scheduling').css('display', ''); loadCalendar();">
                                                        <label for="sched_rad_2" style="font-size: 16px"><?php _e('define scheduling','digitalsignagepress'); ?></label>
                                                    </div>
						</div>
					</div>
					<div class="col_12 collapse_scheduling" style="visibility: hidden;height:0px;" title="<?php _e('Here you can limit that the slide is only visible during certain times each week. Leave empty to not restrict show time.','digitalsignagepress'); ?>" >
		 				<script src="<?php echo $plugindir; ?>/jquery/jquery-ui.min.js"></script> <!-- required for resizing in weekly scheduling; CAN'T BE LOADED VIA WORDPRESS OR WON'T WORK PROPERLY!!-->
            <a name="scheduling"></a>
		<div class=""><?php _e('Limit Showtime by Weekdays','digitalsignagepress'); ?></div>	
            <style type="text/css">.closeon {
			color:white;
			position: absolute;
			top: 0;
			right: 5px;
			z-index: 2;
			width:15px;
			height: 15px;
			text-align:center;
			font-size: 14px;
			font-weight: bold;
			cursor: pointer;}
						</style>

						<div id="fullCalModal" class="modal fade">
						    <div class="modal-dialog">
						        <div class="modal-content">
						            <div class="modal-header">
						                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
						                <h4 id="modalTitle" class="modal-title"></h4>
						            </div>
						            <div id="modalBody" class="modal-body">
																										<table>
																												<tr style="height:50px; vertical-align: top;">
																												<td><?php _e('Start Date','digitalsignagepress'); ?>:</td>
<td><input type="text" id="startd" size="15" style="width: auto;"></td>
<td><?php _e('Start Time','digitalsignagepress'); ?>:</td>
<td style="width:246px;"><div class="timepickerc1 input-group bootstrap-timepicker timepicker">
<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
</div>
</td>
</tr>

<tr style="height:50px; vertical-align: top;">
<td><?php _e('End Date','digitalsignagepress'); ?>:</td>
<td><input type="text" id="endd" size="15" style="width: auto;"></td>
<td><?php _e('End Time','digitalsignagepress'); ?>:</td>
<td style="width:246px;"><div class="timepickerc2 input-group bootstrap-timepicker timepicker">
																															<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
</div></td>																											</tr></table>
																										<button type="button" class="button"><?php _e('Save','digitalsignagepress'); ?></button>

												</div>
						            <div class="modal-footer">


						            </div>
						        </div>
						    </div>
						</div>
<div id="calendar">
		<div class="title-row">
			<div class="title-spacer"></div>
								<div class="title-spacer"><div class="create" id="day2"><?php _e('MON','digitalsignagepress'); ?></div></div>
								<div class="title-spacer"><div class="create" id="day3"><?php _e('TUE','digitalsignagepress'); ?></div></div>
								<div class="title-spacer"><div class="create" id="day4"><?php _e('WED','digitalsignagepress'); ?></div></div>
								<div class="title-spacer"><div class="create" id="day5"><?php _e('THU','digitalsignagepress'); ?></div></div>
								<div class="title-spacer"><div class="create" id="day6"><?php _e('FRI','digitalsignagepress'); ?></div></div>
								<div class="title-spacer"><div class="create" id="day7"><?php _e('SAT','digitalsignagepress'); ?></div></div>
								<div class="title-spacer"><div class="create" id="day1"><?php _e('SUN','digitalsignagepress'); ?></div></div>
		</div>			
		<div class="time_col">
			<div class="time-title"></div>
			<div class="time-title">1</div>
			<div class="time-title">2</div>
			<div class="time-title">3</div>
			<div class="time-title">4</div>
			<div class="time-title">5</div>
			<div class="time-title">6</div>
			<div class="time-title">7</div>
			<div class="time-title">8</div>
			<div class="time-title">9</div>
			<div class="time-title">10</div>
			<div class="time-title">11</div>
			<div class="time-title">12</div>
			<div class="time-title">13</div>
			<div class="time-title">14</div>
			<div class="time-title">15</div>
			<div class="time-title">16</div>
			<div class="time-title">17</div>
			<div class="time-title">18</div>
			<div class="time-title">19</div>
			<div class="time-title">20</div>
			<div class="time-title">21</div>
			<div class="time-title">22</div>
			<div class="time-title">23</div>
		</div>
			<div class="day_box" onmousemove="ds_showDrop(event, 0);">
				<div class="day2" ondrop="ds_drop(event, 2)" onmousemove="ds_showDrop(event, 2);"></div>
				<div class="day3" ondrop="ds_drop(event, 3)" onmousemove="ds_showDrop(event, 3);"></div>
				<div class="day4" ondrop="ds_drop(event, 4)" onmousemove="ds_showDrop(event, 4);"></div>
				<div class="day5" ondrop="ds_drop(event, 5)" onmousemove="ds_showDrop(event, 5);"></div>
				<div class="day6" ondrop="ds_drop(event, 6)" onmousemove="ds_showDrop(event, 6);"></div>
				<div class="day7" ondrop="ds_drop(event, 7)" onmousemove="ds_showDrop(event, 7);"></div>
				<div class="day1" ondrop="ds_drop(event, 1)" onmousemove="ds_showDrop(event, 1);"></div>
			</div>
		</div>
</div>
					<div class="col_12_nm">
					
					<div class="box-bg">
					<input type="button" id="schedule_slidetitle" class="label collapse_scheduling big-btn lead-button-big" onclick="if(jQuery('#moopcol').css('display') != 'none') {jQuery('#moopcol').css('display', 'none');} else {jQuery('#moopcol').css('display', 'block');}" value="<?php _e('More Options', 'digitalsignagepress');?>">
					<div id="moopcol" class="w1280" style="display: none;">
						
						
						<div class="col_06 collapse_scheduling" title="<?php _e('Here you can limit that this slide is only visible between the two given dates.', 'digitalsignagepress');?>">
							<div class="col_12_nm"><?php _e('Limit Showtime by Date', 'digitalsignagepress');?></div>
							<div class="col_12_nm time-scheuduler bgcolor-1">
								<div class="col_04"><?php _e('Active', 'digitalsignagepress');?><input type="checkbox" onchange="updateTime();" name="cb_active_show_by_date" id="cb_active_show_by_date" value="cb_active_show_by_date" style="margin-left: 3px;"></div>
								<div class="col_08">
									<input name="cb_startdate" id="cb_startdate" class="dateinput" type="text" onchange="updateTime();"> - <input name="cb_enddate" id="cb_enddate" class="dateinput" type="text" onchange="updateTime();">
									<input type="hidden" id="startdate" name="startdate">
									<input type="hidden" id="enddate" name="enddate">
									<input type="hidden" id="active_show_by_date" name="active_show_by_date">
									<input type="hidden" id="active_show_by_day_of_month" name="active_show_by_day_of_month">
								</div>
							</div>
						</div>
						<div class="col_06 collapse_scheduling" title="<?php _e('Here you can limit that this slide is only visible between two days of a month. This will be repeated for every month.', 'digitalsignagepress');?>">
							<div class="col_12_nm"><?php _e('Limit Showtime by Day of Month', 'digitalsignagepress');?></div>
							<div class="col_12_nm time-scheuduler bgcolor-1">
								<div class="col_04"><?php _e('Active', 'digitalsignagepress');?><input type="checkbox" onchange="updateDayOfMonth();" id="cb_active_show_by_day_of_month" name="cb_active_show_by_day_of_month" value="cb_active_show_by_day_of_month" style="margin-left: 3px;"></div>
								<div class="col_08">
									<select id="dayofmonthstart" name="dayofmonthstart" class="cb_dropdown">
										<option value="0"> </option>
									<?php
										for ($i = 1; $i <= 31; $i++) {
										    echo "<option value=".$i.">".$i."</option>";
										}							    
									    
									    ?>
									 </select> - <select id="dayofmonthend" name="dayofmonthend" class="cb_dropdown">
										<option value="0"> </option>
									<?php
										for ($i = 1; $i <= 31; $i++) {
										    echo "<option value=".$i.">".$i."</option>";
										}							    
									    
									    ?>
									  </select>
								</div>
							</div>
						</div>
						
					</div>
				</div>
				</div>		
			</div>
		</div>
 </div>
		<?php
			include('editor_modal.html');
		?>
		<div class="step-content signage format">
			<div id="modaldelete" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-body">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<div class="step-content-title cannotbeempty">
								<div id="deletecontent" class="titles active">
								</div>
								<div class="titles">
									<input id="deleteanyway" class="big-btn lead-button-big" type="button" onclick="ds_trueDeleteTab(0);" data-dismiss="modal" value="<?php _e('Delete', 'digitalsignagepress');?>">
									<input class="big-btn lead-button-big" type="button" data-dismiss="modal" value="<?php _e('Close', 'digitalsignagepress');?>">
								</div>	
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="step-content signage format">
			<div id="modalwarn" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-body">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<div class="step-content-title cannotbeempty">
								<div id="warncontent" class="titles active">
								</div>
								<div class="titles">
									<input id="saveanyway" class="big-btn lead-button-big" type="button" onclick="ds_programmodified = 0;document.save_myDS_form.submit();" data-dismiss="modal" value="<?php _e('Save Anyway','digitalsignagepress') ?>">
									<input class="big-btn lead-button-big" type="button" data-dismiss="modal" value="<?php _e('Close','digitalsignagepress') ?>">
								</div>	
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="step-content signage format">
			<div id="pageorientationmodal" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-body">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<div class="step-content-title cannotbeempty">
								<div id="pageorientationmodal_content" class="titles active">
								</div>
								<div class="titles">
									<input id="pageorientationmodal_proceed" class="big-btn lead-button-big" type="button" onclick="" data-dismiss="modal" value="<?php _e('Proceed','digitalsignagepress'); ?>">
									<input class="big-btn lead-button-big" type="button" data-dismiss="modal" value="<?php _e('Cancel','digitalsignagepress'); ?>">
								</div>	
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="step-content signage format" id="titlecontent">
			<div id="modal0" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-body">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<div id="tab0" class="step-content-title cannotbeempty">
								<div id="tabcontent" class="titles active"><?php _e('Name of this Slide', 'digitalsignagepress');?>:
									<input id="screen-title_0" type="text" autofocus="" value="" maxlength="50" autocomplete="off" onkeyup="ds_updateTitle(0)" onchange="ds_updateTitle(0)"><input id="save0" class="big-btn lead-button-big" type="button" onclick="ds_updateTitle(0)" data-dismiss="modal" value="<?php _e('Save', 'digitalsignagepress');?>"><input class="big-btn lead-button-big" type="button" data-dismiss="modal" value="<?php _e('Cancel', 'digitalsignagepress');?>">
								</div> 				
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
                
         <div class="step-content signage format" id="previewmodal_top" style="">
			<div id="previewmodal" class="modal fade" role="dialog" style="height: 820px; width: 1920px; top: 10px !important ">
				<div class="modal-dialog" style="height: 760px; width: 1325px; ">
					<div class="modal-content" style="">
						<div style="padding: 20px;">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
							<?php _e('PREVIEW OF YOUR PLAYLIST', 'digitalsignagepress'); ?>
						</div>
						<div class="modal-body" style="padding: 0px; margin-left: 20px; margin-right: -7px; position: static;" >
							
							<div id="allDSScreens" style="height: 720px; width: 1280px; position: relative;">
							</div>
							<div id="tab0" class="step-content-title cannotbeempty">
								<div id="tabcontent" class="titles active"><input class="big-btn lead-button-big" type="button" data-dismiss="modal" value="<?php _e('Close', 'digitalsignagepress'); ?>">
									
								</div> 				
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>	
		<?php
