<?php
$allowBackground = true;
$smilxml='<?xml version="1.0"?>
<!DOCTYPE smil PUBLIC "-//W3C//DTD SMIL 3.0 Language//EN"
                      "http://www.w3.org/2008/SMIL30/SMIL30Language.dtd">
<smil xmlns="http://www.w3.org/ns/SMIL" version="3.0" baseProfile="Language">
 <head>
  <meta name="title" content="fullscreenSequence" />
  <meta http-equiv="Refresh" content="60" />
  <layout>
   <root-layout xml:id="rootLayout" />
     <region xml:id="fullScreen" />
  </layout>
 </head>
 <body>
  <seq repeatCount="indefinite">'.PHP_EOL;
$needlevideo='ds-vid-container-2';
$needleimage='ds-image-container';
$needle2='src="';
$needleend='"';
$now_month = date('Y-m', time());
$now_day = date('Y-m-d', time());
$firstscreen = current($program['screens']);
unset($content);
$screens = $program['screens'];
foreach($screens as $screen) {
  $elements = $screen['elements'];
  unset($htmlcode);$htmlcode='';
  foreach($elements as $element) {
    if($element['pos_nr'] == 1) {
       $htmlcode = stripslashes($element['htmlcode']);
       break;
    }
  }
  if(!$allowBackground && !isset($htmlcode)) continue;
  if(strpos($htmlcode, $needlevideo) === false && strpos($htmlcode, $needleimage) === false) {
    $foundcontent = false;
    if($allowBackground || ($screen['templateId'] != 1 && $screen['templateId'] != 59)) {
      foreach($elements as $element) {
        if($allowBackground || $element['pos_nr'] > 1) {
          $htmlcode = stripslashes($element['htmlcode']);
          if(strpos($htmlcode, $needlevideo) !== false || strpos($htmlcode, $needleimage) !== false) {
            $foundcontent = true;
            break;
          }
        }
      }
    }
    if(!$foundcontent) continue;
  }
  $firstschedule=current($screen['schedules']);
  $dur=$firstschedule['playduration'];
  if($dur == 0) {
    $rule5condition = false;
    $durations = array();
    $tmpscreens = $program['screens'];
    foreach($tmpscreens as $tmpscreen) {
      if($tmpscreen['id'] == $screen['id']) continue;
      $firstschedule=current($tmpscreen['schedules']);
      $tmpdur = $firstschedule['playduration'];
      if($tmpdur > 0) $rule5condition = true;
      $durations[] = $tmpdur;
    }
    $sum = 0;
    foreach($durations as $tmpdur) {
      $sum = $sum + $tmpdur;
    }
    if($rule5condition) {
      $dur_avg = $sum / (sizeof($durations));
    } else {
      unset($dur_avg);
    }
  }
  if(strpos($htmlcode, $needlevideo) !== false) {
    $firstmatch = strpos($htmlcode, $needlevideo);
    $firstmatch = strpos($htmlcode, $needle2, $firstmatch) + strlen($needle2);
    $endmatch = strpos($htmlcode, $needleend, $firstmatch);
    $videouri = substr($htmlcode, $firstmatch, $endmatch-$firstmatch);
    if($dur > 0) {
      $content ='<video xml:id="v'.$screen['id'].'" region="fullScreen" src="'.$videouri.'" fit="meet" dur="'.$dur.'s" />'.PHP_EOL;
    } else {
      $content ='<video xml:id="v'.$screen['id'].'" region="fullScreen" src="'.$videouri.'" fit="meet" />'.PHP_EOL;
    }
  } else if(strpos($htmlcode, $needleimage) !== false) {
    $firstmatch = strpos($htmlcode, $needleimage);
    $firstmatch = strpos($htmlcode, $needle2, $firstmatch) + strlen($needle2);
    $endmatch = strpos($htmlcode, $needleend, $firstmatch);
    $imageuri = substr($htmlcode, $firstmatch, $endmatch-$firstmatch);
    if($dur > 0) {
      $content ='<img xml:id="i'.$screen['id'].'" region="fullScreen" src="'.$imageuri.'" fit="meet" dur="'.$dur.'s" />'.PHP_EOL;
    } else if(isset($dur_avg)) {
      $content ='<img xml:id="i'.$screen['id'].'" region="fullScreen" src="'.$imageuri.'" fit="meet" dur="'.$dur_avg.'s" />'.PHP_EOL;
    } else {
      $content ='<img xml:id="i'.$screen['id'].'" region="fullScreen" src="'.$imageuri.'" fit="meet" dur="indefinite" />'.PHP_EOL;
    }
  } else {
    continue;
  }

  if(!$firstschedule['permanent'] && $firstschedule['startdate'] > 0) {
    $smil_startdate = 'begin="wallclock('.date('c', $firstschedule['startdate']).')"';
    $smil_enddate = 'end="wallclock('.date('c', $firstschedule['enddate']).')"';
  } else {
    unset($smil_startdate);
    unset($smil_enddate);
  }

  unset($smil_weekday_start);
  unset($smil_weekday_end);
  unset($smil_day_of_month_start);
  unset($smil_day_of_month_end);

  $schedules=$screen['schedules'];
  foreach($schedules as $schedule) {
    $day_of_month_start = $schedule['day_of_month_start'];
    if($day_of_month_start > 0) {
      if($day_of_month_start < 10) {
        $day_of_month_start = '0'.$day_of_month_start;
      }
      $smil_day_of_month_start = 'begin="wallclock(R/'.$now_month.'-'.$day_of_month_start.'/P1M)"';
      $day_of_month_end = $schedule['day_of_month_end'];
      if($day_of_month_end < 10) {
        $day_of_month_end = '0'.$day_of_month_end;
      }
      $smil_day_of_month_end = 'end="wallclock(R/'.$now_month.'-'.$day_of_month_end.'/P1M)"';
    } else {
      unset($day_of_month_start);
      unset($day_of_month_end);
    }
    $weekday_start = $schedule['weekday_start'];
    if($weekday_start > 0) {
      if($weekday_start == 1) {
        $weekday_start = 7;
      } else {
        $weekday_start--;
      }
      $weekday_start_time_h = $schedule['weekday_start_time_h'];
      if($weekday_start_time_h < 10) {
        $weekday_start_time_h = '0'.$weekday_start_time_h;
      }
      $weekday_start_time_m = $schedule['weekday_start_time_m'];
      if($weekday_start_time_m < 10) {
        $weekday_start_time_m = '0'.$weekday_start_time_m;
      }
      $smil_weekday_start = 'begin="wallclock(R/'.$now_day.'+w'.$weekday_start.'T'.$weekday_start_time_h.':'.$weekday_start_time_m.'/P1W)"';
      $weekday_end = $schedule['weekday_end'];
      if($weekday_end == 1) {
        $weekday_end = 7;
      } else {
        $weekday_end--;
      }
      $weekday_end_time_h = $schedule['weekday_end_time_h'];
      if($weekday_end_time_h < 10) {
        $weekday_end_time_h = '0'.$weekday_end_time_h;
      }
      $weekday_end_time_m = $schedule['weekday_end_time_m'];
      if($weekday_end_time_m < 10) {
        $weekday_end_time_m = '0'.$weekday_end_time_m;
      }
      $smil_weekday_end = 'end="wallclock(R/'.$now_day.'+w'.$weekday_end.'T'.$weekday_end_time_h.':'.$weekday_end_time_m.'/P1W)"';
    } else {
      unset($weekday_start);
      unset($weekday_end);
    }
    if(isset($smil_startdate)) {
      if(isset($smil_day_of_month_start) || isset($smil_weekday_start)) {
        $smilxml .= '<par '.$smil_startdate.' '.$smil_enddate.'>'.PHP_EOL;
      } else {
        if($dur > 0) {
          $smilxml .= '<par '.$smil_startdate.' '.$smil_enddate.' dur="'.$dur.'s" >'.PHP_EOL;
        } else if(isset($dur_avg)) {
          $smilxml .= '<par '.$smil_startdate.' '.$smil_enddate.' dur="'.$dur_avg.'s" >'.PHP_EOL;
        } else {
          $smilxml .= '<par '.$smil_startdate.' '.$smil_enddate.' dur="indefinite" >'.PHP_EOL;
        }
      }
    }
    if(isset($smil_day_of_month_start)) {
      if(isset($smil_weekday_start)) {
        $smilxml .= '<par '.$smil_day_of_month_start.' '.$smil_day_of_month_end.'>'.PHP_EOL;
      } else {
        if($dur > 0) {
          $smilxml .= '<par '.$smil_day_of_month_start.' '.$smil_day_of_month_end.' dur="'.$dur.'s" >'.PHP_EOL;
        } else if(isset($dur_avg)) {
          $smilxml .= '<par '.$smil_day_of_month_start.' '.$smil_day_of_month_end.' dur="'.$dur_avg.'s" >'.PHP_EOL;
        } else {
          $smilxml .= '<par '.$smil_day_of_month_start.' '.$smil_day_of_month_end.' dur="indefinite" >'.PHP_EOL;
        }
      }
    }
    if(isset($smil_weekday_start)) {
      if($dur > 0) {
        $smilxml .= '<par '.$smil_weekday_start.' '.$smil_weekday_end.' dur="'.$dur.'s" >'.PHP_EOL;
      } else if(isset($dur_avg)) {
        $smilxml .= '<par '.$smil_weekday_start.' '.$smil_weekday_end.' dur="'.$dur_avg.'s" >'.PHP_EOL;
      } else {
        $smilxml .= '<par '.$smil_weekday_start.' '.$smil_weekday_end.' dur="indefinite" >'.PHP_EOL;
      }
    }
    $smilxml .= $content;
    if(!isset($smil_startdate) && !isset($smil_weekday_start) && !isset($smil_day_of_month_start)) {
       $smilxml .= '</par>'.PHP_EOL;
    }
    if(isset($smil_startdate)){
      if(isset($smil_day_of_month_start) || isset($smil_weekday_start)) {
        $smilxml .= '</par>'.PHP_EOL;
      } else {
        $smilxml .= '</par>'.PHP_EOL;
      }  
    }
    if(isset($smil_day_of_month_start)) {
      if(isset($smil_weekday_start)) {
        $smilxml .= '</par>'.PHP_EOL;
      } else {
        $smilxml .= '</par>'.PHP_EOL;
      }
    }
    if(isset($smil_weekday_start)) {
      $smilxml .= '</par>'.PHP_EOL;
    }
  }
  if($dur == 0 && !isset($dur_avg) && strpos($htmlcode, $needlevideo) === false) break; 
}
if(isset($content)) {
  $smilxml.='  </seq>
 </body>
</smil>';
  $uploads = wp_upload_dir();
    $path = $uploads['basedir'].'/digitalsignagepress/smil/';
  if (!is_dir($path)) {
    mkdir($path, 0777, true);
  }
  $fp = fopen($path.$program['id'].'.smil', 'w');
  fwrite($fp, $smilxml);
  fclose($fp);
}
