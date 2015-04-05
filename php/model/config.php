<?php
	require_once(__DIR__ . "/Database.php");
	session_start();
	session_regenerate_id(true);
	/*keeps the id constant throughtout the entire session everytime the file is called upon*/

	$path = "/Awesomenauts/php/";
	/*Requires the path an its location*/

	$host = "localhost";
	$username = "root";
	$password = "root";
	$database = "awesomenauts_db";

	if(!isset($_SESSION["connection"])) {
		$connection = new Database($host, $username, $password, $database);
		$_SESSION["connection"] = $connection;
		/*try to access session variable, called connection, in the brackets*/
	}
	/*runs when the session variable is empty, or has not been set*/