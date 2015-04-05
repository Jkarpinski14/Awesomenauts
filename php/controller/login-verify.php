<?php
	require_once(__DIR__ . "/../model/config.php");

	function authenticateUser(){
		if(!isset($_SESSION["authenticated"])){
			return false;
		}
		else{
			if($_SESSION["authenticated"] != true){
				return false;
			}
			else{
				return true;
			}
		}
	}
	/*checks if the authenticated variable hasn't been set*/