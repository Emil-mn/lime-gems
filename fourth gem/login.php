<?php
    //open and check db connection
    $connection = new mysqli("localhost", "root", "loremipsum", "lime_gems");
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    echo "Connected successfully <br>";
    
    $username = $_POST["username"];
    $password = $_POST["password"];
    
    $compQuery = "SELECT * FROM logins WHERE Username='$username' && Password='$password'";
    $result = $connection->query($compQuery);
    
    if ($result === false) {
        die( "Check failed: " . $compQuery . "<br>" . $connection->error);
    }
    else {
        if ($result->num_rows > 0) {
            echo "account exists, signing in";
        } 
        else {
            die("account" . $username . "does not exist");
        }
    }
    
    $connection->close();
?>