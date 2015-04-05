<?php
	require_once(__DIR__ . "/../model/config.php");
	/*links to config.php; initially set to (now deleted) database.php, serves the purpose of simplifying [refactoring] to make it easier to edit and more usable, improves the look of the code wo/ affecting  the workability*/

	$query = $_SESSION["connection"]->query("CREATE TABLE users ("
		. "id int(11) NOT NULL AUTO_INCREMENT,"
		. "username varchar(30) NOT NULL,"
		. "email varchar(50) NOT NULL,"
		. "password char(128) NOT NULL,"
		. "salt char(128) NOT NULL,"
		. "exp int(4),"
		. "exp1 int(4),"
		. "exp2 int(4),"
		. "exp3 int(4),"
		. "exp4 int(4),"
		. "PRIMARY KEY(id))");