<?php



session_start();

if (!(isset($_SESSION['username']) && $_SESSION['username'] != '')) {

header ("Location: insertdevicelogin.php");

}

?>


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Add Record Form</title>
</head>
<body>
<form action="insertdevicecount.php" method="post">
    
    <p>
        <label for="siteID">Site ID</label>
        <input type="text" name="siteID" id="siteID">
    </p>

    <p>
        <label for="devicecount">No: of devices:</label>
        <input type="text" name="devicecount" id="devicecount">
    </p>
   
    <input type="submit" value="Submit">
</form>

Click here to <a href = "logout.php" tite = "Logout">Logout.

</body>
</html>

