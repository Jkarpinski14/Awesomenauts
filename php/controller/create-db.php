<?php
	require_once(__DIR__ . "/../model/config.php");
	/*links to config.php; initially set to (now deleted) database.php, serves the purpose of simplifying [refactoring] to make it easier to edit and more usable, improves the look of the code wo/ affecting  the workability*/

	$query = $_SESSION["connection"]->query("CREATE TABLE posts ("
		. "id int(11) NOT NULL AUTO_INCREMENT,"
		. "title varchar(255) NOT NULL,"
		. "post text NOT NULL,"
		. "DateTime datetime NOT NULL,"
		. "PRIMARY KEY (id))"); 
	/*creates a table using a query, just like the database on line 15*/

	if($query) {
		echo "Successfully created table: posts";
	}
	/*checks to see if table exists*/
	else{
		echo "<p>" . $_SESSION["connection"]->error. "</p>";
	}
	
	/*HTML tags are compatible in PHP*/
	/*query fucntion attatched to connection variable stored in session*/
	$query = $_SESSION["connection"]->query("CREATE TABLE users ("
		. "id int(11) NOT NULL AUTO_INCREMENT,"
		. "username varchar(30) NOT NULL,"
		. "email varchar(50) NOT NULL,"
		. "password char(128) NOT NULL,"
		. "salt char(128) NOT NULL,"
		. "PRIMARY KEY(id))");
	/*increments id intervals automatically*/
	/*want to make sure no values entered can be allowed blank*/
	/*creates new table called users in phpMyAdmin for permitting a user to log into the blog*/
	/*salt provides additional data to protect blog against hacking*/

	if($query){
		echo "<p>Successfully created table: users</p>";
	}
	else{
		echo "<p>" . $_SESSION["connection"]->error . "</p>";
	}
