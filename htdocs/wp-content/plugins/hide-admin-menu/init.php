<?php
/*
Plugin Name: Hide admin menu
Plugin URI: 
Description: User can hide the admin menu of side bar and top bar that he want.
Author: Bhavin Thummar & Maulik Patel
Version: 1.0.2
Author URI: 
*/

//for table create when plgin activate
function bhm_create_db_process(){

 global $wpdb;
 $table_name= $wpdb->prefix ."options";
 $wpdb->insert(
 $table_name, //table
 array('option_name' => 'hide_menu_bh_plugin'));

 $wpdb->insert(
 $table_name, //table
 array('option_name' => 'hide_sub_menu_bh_plugin'));
 
 $wpdb->insert(
 $table_name, //table
 array('option_name' => 'hide_top_menu_bh_plugin'));

 $wpdb->insert(
 $table_name, //table
 array('option_name' => 'menu_order_bh_plugin'));

}
register_activation_hook(__FILE__,'bhm_create_db_process');
function bhm_Hide_Menus()
{
 add_menu_page("Hide Menu","Hide Menu",4,"hide-admin-menu","bhm_get_menu_list");

}

add_action("admin_menu","bhm_Hide_Menus");

require_once(plugin_dir_path(__FILE__).'menu-list.php');