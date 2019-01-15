<?php
/* Attempt MySQL server connection. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
$link = mysqli_connect("localhost:3306", "bn_wordpress", "ee58c16529", "bitnami_wordpress");
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
 
// Escape user inputs for security
$devicecount = mysqli_real_escape_string($link, $_REQUEST['devicecount']);
$username = "admin";
$siteID = mysqli_real_escape_string($link, $_REQUEST['siteID']);

?>