<?php
	require_once(__DIR__ . "/../model/config.php");

	$array = array(
		'exp'=> '',
		'exp1'=> '',
		'exp2'=> '',
		'exp3'=> '',
		'exp4'=> '',
	);

	$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
	$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
	$query = $_SESSION["connection"]->query("SELECT * FROM users WHERE username = '$username'");
	/*retrievs the salt and the password from the users table, and makes sure to only get it from the table with information attached to a designated username*/
	/*the * is a representation for ALL*/

	if($query->num_rows == 1){
		$row = $query->fetch_array();
		if($row["password"] === crypt ($password, $row["salt"])){
			$_SESSION["authenticated"] = true;
			$array["exp"] = $row["exp"];
			$array["exp1"] = $row["exp1"];
			$array["exp2"] = $row["exp2"];
			$array["exp3"] = $row["exp3"];
			$array["exp4"] = $row["exp4"];
			/*takes the experience variable from the "row," which is where the queries are pulled*/
			$_SESSION["name"] = $username;
			echo json_encode($array);
			/*allows the array to be echoed out as one statement thanks to JSON*/
		}
		else{
			echo "Invalid username and/or password";
		}
	}
	else{
		echo "Invalid username and/or password";
		/*doesn't permait false users to know which paramater they are entering incorrectly*/
	}
	/*checks that information is stored in the query*/

?>