<?php
    //open and check db connection
    $connection = new mysqli("localhost", "root", "loremipsum", "accounts");
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    echo "Connected successfully <br>";
    
    $username = $_POST["username"];
    $password = $_POST["table"];
    $repeat = $_POST["repeat"];

    //validation
    //1 check if username is unique   get username from database if it exists. if true show error(how?), otherwise continue
    //check if password is same in both places???  maybe do that with js??? can probably just validate password with pattern 
    $regQuery = "INSERT INTO logins (Username, 'Password') VALUES ('$username', '$password')";
    if ($connection->query($regQuery) === TRUE) {
        echo "New account created successfully <br>";
    } 
    else {
        echo "Error: " . $regQuery . "<br>" . $connection->error;
    }
    
    $connection->close();
?>