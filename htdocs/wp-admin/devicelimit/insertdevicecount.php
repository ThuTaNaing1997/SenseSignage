<?php

require_once "insertdeviceconfig.php";



session_start();

if (!(isset($_SESSION['username']) && $_SESSION['username'] != '')) {

header ("Location: insertdevicelogin.php");

}


// Attempt insert query execution
$sql = "INSERT INTO devicelimit (siteID, username, devicecount) VALUES ('$siteID', '$username', '$devicecount')";
if(mysqli_query($link, $sql)){
    echo "Records added successfully.";
    
} else{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
}



// Close connection
mysqli_close($link);
?>

<p>
Click here to <a href = "insertdeviceform.php" tite = "Add">Next Site.<br />
Click here to <a href = "logout.php" tite = "Logout">Logout.<br />
</p>

