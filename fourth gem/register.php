<?php
    //open and check db connection
    $connection = new mysqli("localhost", "root", "loremipsum", "lime_gems");
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    echo "Connected successfully <br>";
    
    $username = $_POST["username"];
    $password = $_POST["password"];
    $repeat = $_POST["repeat"];

    //validation
    //check if username is unique   get username from database if it exists. if true show error(close the tab and return something???), otherwise continue
    $regQuery = "INSERT INTO logins (Username, 'Password') VALUES ('$username', '$password')";
    if ($connection->query($regQuery) === TRUE) {
        echo "New account created successfully <br>";
    } 
    else {
        echo "Error: " . $regQuery . "<br>" . $connection->error;
    }
    
    $connection->close();
?>