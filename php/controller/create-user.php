<?php
	require_once(__DIR__ . "/../model/config.php");

	$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
	$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
	/*FILTER deletes invalid characters*/

	$salt = "$5$" . "rounds=5000$" . uniqid(mt_rand(), true) . "$";
	/*salt makes hashed password unique to us*/
	$hashedPassword = crypt($password, $salt);
	/*prevents a duplicate password from hasing the same input*/
	$query = $_SESSION["connection"]->query("INSERT INTO users SET "
		. "username = '$username', "
		. "password = '$hashedPassword', "
		. "salt = '$salt', "
		. "exp = 0, "
		. "exp1 = 0, "
		. "exp2 = 0, "
		. "exp3 = 0, "
		. "exp4 = 0");

	$_SESSION["name"] = $username;

	if($query){
		echo "true";
	}
	else{
		echo "<p>" . $_SESSION["connection"]->error . "</p>";
	}
	/*prints an error to the screen if the user is not created successfully*/
