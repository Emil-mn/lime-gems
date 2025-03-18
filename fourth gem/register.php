<?php
    //open and check db connection
    $connection = new mysqli("localhost", "root", "loremipsum", "lime_gems");
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    echo "Connected successfully <br>";
    
    $username = $_POST["username"];
    $password = $_POST["password"];
    
    $compQuery = "SELECT Username FROM logins WHERE Username='$username'";
    $result = $connection->query($compQuery);
    
    if ($result === false) {
        die( "Check failed: " . $compQuery . "<br>" . $connection->error);
    }
    else {
        if ($result->num_rows > 0) {
            return "username" . $username . "already exists";
        } 
        else {
            echo "no match found<br>";
        }
    }
    
    $regQuery = "INSERT INTO logins (Username, Password) VALUES ('$username', '$password')";
    if ($connection->query($regQuery) === TRUE) {
        return "New account created successfully";
    } 
    else {
        echo "Registering error: " . $regQuery . "<br>" . $connection->error;
    }
    
    $connection->close();
?>