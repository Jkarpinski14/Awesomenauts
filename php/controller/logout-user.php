<?php
	require_once(__DIR__ . "/../model/config.php");

	unset($_SESSION["authenticated"]);

	session_destroy();
	header("Location: " . $path . "index.php");
	/*eliminates the session variable to negate the login*/
	/*this page is for logging out of the blog*/