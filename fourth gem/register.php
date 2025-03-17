<?php
    //open and check db connection
    $connection = new mysqli("localhost", "root", "loremipsum", "lime_gems");
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    echo "Connected successfully <br>";
    
    $username = $_POST["username"];
    $password = $_POST["password"];
    
    $compQuery = "SELECT Username FROM logins WHERE Username IS '$username'";
    if ($connection->query($compQuery) === TRUE) {
        echo "no match found<br>"; 
    }
    else {
        die("username already exists");//close the tab and return something to show error on register dialog???
    }
    
    $regQuery = "INSERT INTO logins (Username, 'Password') VALUES ('$username', '$password')";
    if ($connection->query($regQuery) === TRUE) {
        echo "New account created successfully <br>";
    } 
    else {
        echo "Error: " . $regQuery . "<br>" . $connection->error;
    }
    
    $connection->close();
?>