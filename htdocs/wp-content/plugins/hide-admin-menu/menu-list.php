<?php
//add css
add_action( 'admin_enqueue_scripts', 'bhm_load_admin_style' );  

function bhm_load_admin_style() {
  wp_enqueue_style( 'admin_css', plugin_dir_url( __FILE__ ) . 'css/style-admin.css', false, '1.0.0' );
}

function app_output_buffer() {
  ob_start();
  session_start();
} // soi_output_buffer
add_action('init', 'app_output_buffer');

function bhm_get_menu_list(){
  if (isset($_POST['save'])) {
 
    //check administrator access required
    if(current_user_can('administrator'))
    {
          //check wpnonce
      if(check_admin_referer('menu-remove')){
        
        //here we have to check this is array or not. (array check validation)
        $menu_list = isset( $_POST['menu_list'] ) ? (array) $_POST['menu_list'] : array();
        $sub_menu_list = isset( $_POST['sub_menu_list'] ) ? (array) $_POST['sub_menu_list'] : array();
       
        /// data sanitization functions used for valid text (text validation)
        $menu_list = array_map( 'sanitize_text_field', $menu_list );
        $sub_menu_list = array_map( 'sanitize_text_field', $sub_menu_list );

        $new_menu_list = array(); //define array for side menu array
        $new_sub_menu_list = array(); //define array for side sub menu array
        foreach ($menu_list as $list_data) {
            if (is_numeric($list_data)) { //validate the data
               //we check input will be only number then after we process further. 
               $new_menu_list[] = $_SESSION['all_side_menus'][$list_data][2];
            }
        }

        foreach ($sub_menu_list as $list_data) {
                //we get parent and child key 
                $key_data = explode('_',$list_data);
                $parent_key = $key_data[0];
                $child_key = $key_data[1];
               //we find parent of child
               $parent_value = $_SESSION['all_side_menus'][$parent_key][2];

               //we check input will be only number then after we process further. 
               $new_sub_menu_list[] = $parent_value.'__con__'.$_SESSION['all_side_sub_menus'][$parent_value][$child_key][2];
          
        }


        $remove_side_array = $new_menu_list;
        $json_remove_side_array = json_encode($remove_side_array); //json array.

        $remove_sub_side_array = $new_sub_menu_list;
        $json_remove_sub_side_array = json_encode($remove_sub_side_array); //json array.
        
        //remove menus form the admin top menu.
        //here we have to check this is array or not.(array check validation)
        $top_menu_list = isset( $_POST['top_menu_list'] ) ? (array) $_POST['top_menu_list'] : array();

        // data sanitization functions for valid text(text validation)
        $top_menu_list = array_map( 'sanitize_text_field', $top_menu_list );
        
        $new_menu_list = array(); //array define for top menu 
        foreach ($top_menu_list as $list_data) {          
             $new_menu_list[] = $_SESSION['all_top_menus'][$list_data]->id; 
        }

        $remove_top_array = $new_menu_list;
        $json_remove_top_array = json_encode($remove_top_array); //json array.
        
        //update the values
        update_option('hide_menu_bh_plugin',$json_remove_side_array);
        update_option('hide_sub_menu_bh_plugin',$json_remove_sub_side_array);
        update_option('hide_top_menu_bh_plugin',$json_remove_top_array);
        $_SESSION['msg'] =  '<div id="message" class="updated notice notice-success is-dismissible"><p>Your changes has been updated.</div>';
         
         //echo dirname(__FILE__);
         wp_redirect('?page='.$_GET['page']);    
         exit;  
      }//end of wpnonce   
    }//end of administrator check 
    
   } //complete post
?>
<div class="wrap">
<h2>Hide Menus</h2>
<div class="tablenav top">

<br class="clear">
</div>
<?php
//insert
if(isset($_SESSION['msg'])){
  echo $_SESSION['msg'];
  unset($_SESSION['msg']);
}

//now we have to fetch all hide_menu_array from the db for side bar
$get_data = get_option('hide_menu_bh_plugin');
if($get_data!='null' && $get_data!='' ){
   $fetch_hide_menu_array = json_decode($get_data);
}
else{
   $fetch_hide_menu_array = array();
}

//now we have to fetch all hide_sub_menu_array from the db for side bar
$get_data = get_option('hide_sub_menu_bh_plugin');
if($get_data!='null' && $get_data!='' ){

   
   $get_data2 = json_decode($get_data);

   //now we remove the paren key
   foreach ($get_data2 as $gets_data) {
     $new_get_data = explode('__con__', $gets_data);
     $fetch_hide_sub_menu_array[] = $new_get_data['1']; 
   }
   

}
else{
   $fetch_hide_sub_menu_array = array();
}

//now we have to fetch all hide_menu_array from the db for top bar
$get_data = get_option('hide_top_menu_bh_plugin');
if($get_data!='null' && $get_data!='' ){
 $fetch_hide_top_menu_array = json_decode($get_data);
}
else{
  $fetch_hide_top_menu_array = array();
}
?>

<form method="post" >
<?php
  //create wpnonce
  wp_nonce_field( 'menu-remove' );
?>
<div class="col-md-3">
  <table class='wp-list-table widefat fixed striped posts'>
 <tr>
 <th><b>Menus Of Side Bar<b/></th>
 <th ><b>Status<b/></th>
 </tr>
  <?php

   $all_menu = $_SESSION['all_side_menus'];
   $all_sub_menu = $_SESSION['all_side_sub_menus'];
   
  foreach ($all_menu as $key=>$row) { 
   if(isset($row['6']) && $row['6']!=''){

   
    $sub_menu_array = isset($all_sub_menu[$row['2']]) ? $all_sub_menu[$row['2']] : array() ;
    //check it is array or not
    $sub_menu_array = isset( $sub_menu_array ) ? (array) $sub_menu_array : array();
   ?>
    <tr class='my_text'>
     <td ><span class="dashicons-before  <?php echo esc_attr($row['6']); ?>"></span> 
      <span><?php echo  esc_attr(strip_tags($row['0'])); ?></span></td>
     <td>
     <input
      <?php if(in_array($row['2'],$fetch_hide_menu_array)) echo 'checked'; ?>
      type="checkbox" name="menu_list[]" value="<?php echo esc_attr($key); ?>">
     </td>  
    </tr>

    <?php
       //now we add the sub menu to parent menu

        foreach ($sub_menu_array as $keys=>$rows) {

          $fetch_hide_sub_menu_array = isset($fetch_hide_sub_menu_array) ?  $fetch_hide_sub_menu_array : array();
          ?>
          
          <tr class='my_text sub-menu'>
           <td ><span>-</span> 
            <span><?php echo  esc_attr(strip_tags($rows['0'])); ?></span></td>
           <td>
           <input <?php if(in_array($rows['2'], $fetch_hide_sub_menu_array )) echo 'checked'; ?>
            type="checkbox" name="sub_menu_list[]" value="<?php echo $key; ?>_<?php echo esc_attr($keys); ?>">
           </td>  
          </tr>

        <?php
        }//end foreach
    }//if
   }  //for 
?>
</table>
</div>

<div class="col-md-3">
   <table class='wp-list-table widefat fixed striped posts'>
 <tr>
 <th><b>Menus of Top Bar<b/></th>
 <th ><b>Status<b/></th>
 </tr>
  <?php

   $all_menu = $_SESSION['all_top_menus'];
  foreach ($all_menu as $row) { 

   if($row->title!=''){
   ?>
    <tr class='my_text'>

     <td ><span id="wp-admin-bar-<?php echo esc_attr($row->id); ?>"></span> 
      <span><?php echo  esc_attr(strip_tags($row->title)); ?></span></td>
     <td>
     <input
      <?php if(in_array($row->id,$fetch_hide_top_menu_array)) echo 'checked'; ?>
      type="checkbox" name="top_menu_list[]" value="<?php echo esc_attr($row->id); ?>">
     </td>  
    </tr>

    <?php
    }//if
   }  //for
?>
</table>
</div>


<div class="">
   <input name="page" type="hidden" value="social-option-2">
   <input name="save" type="submit" class="button button-primary button-large" id="publish" value="Update">
</div>

</form>
</div>
<?php }

//remove menu from the admin at side bar
function bhm_custom_side_menu_page_removing() {
 
  global $menu;
  global $submenu;

  $_SESSION['all_side_menus']  = $menu;
  $_SESSION['all_side_sub_menus']  = $submenu;
  
  $all_menu = $_SESSION['all_side_menus'];
  //now we have to fetch all hide_menu_array from the db
  $get_data = get_option('hide_menu_bh_plugin'); 
  if($get_data!='null' && $get_data!='' ){
   $fetch_hide_menu_array = json_decode($get_data);
  }
  else{
    $fetch_hide_menu_array = array();
  }

  //now fetch sub menu data
  $get_data = get_option('hide_sub_menu_bh_plugin'); 
  if($get_data!='null' && $get_data!='' ){
   $fetch_hide_sub_menu_array = json_decode($get_data);
  }
  else{
    $fetch_hide_sub_menu_array = array();
  }

  foreach ($fetch_hide_menu_array as $hide_menu_array) {
     remove_menu_page( $hide_menu_array );
  }

  foreach ($fetch_hide_sub_menu_array as $hide_menu_array) {
     //now we ge the parent key and child key
     $pare_child = explode('__con__', $hide_menu_array);
     remove_submenu_page($pare_child[0], $pare_child[1] );
  }

}
  add_action( 'admin_menu', 'bhm_custom_side_menu_page_removing' ,'9999');

  //remove menu from the admin at top bar
function bhm_custom_top_menu_page_removing() {

  global $wp_admin_bar;

  $_SESSION['all_top_menus']  = $wp_admin_bar->get_nodes();
  
  $all_menu = $_SESSION['all_top_menus'];

  //now we have to fetch all hide_menu_array from the db
  $get_data = get_option('hide_top_menu_bh_plugin');
  if($get_data!='null' && $get_data!='' ){
   $fetch_hide_menu_array = json_decode($get_data);
  }
  else{
    $fetch_hide_menu_array = array();
  }

  foreach ($fetch_hide_menu_array as $hide_menu_array) {  
     $wp_admin_bar->remove_node( $hide_menu_array );
  }    
}
  add_action( 'admin_bar_menu', 'bhm_custom_top_menu_page_removing' ,'9999');