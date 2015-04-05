<?php
/*classes let us store information (and modify the information via functions), and is also used to create objects*/
/*takes and stores information that gets repeated over and over again*/

class Database{
	private $connection;
	private $host;
	private $username;
	private $password;
	private $database;
	public $error;
	/*means variable can only be accessed in this file [class]*/

	public function __construct($host, $username, $password, $database){
		$this->host = $host;
		$this->username = $username;
		$this->password = $password;
		$this->database = $database;

		$this->connection = new mysqli($host, $username, $password);
		/*connects to arguments in database.php; has to be in same order on both pgaes*/

		if($this->connection->connect_error){
			die("Error: " . $this->connection->connect_error);
		}
		/*this is here in case there is an error that requires the page to terminate*/
		$exists = $this->connection->select_db($database);

		if(!$exists){
			$query = $this->connection->query("CREATE DATABASE $database"); 
			/*query will be executed and stored in this variable*/
		if($query){
			echo "successfully created database: " . $database;
		}
		}
		else{
			echo "Database already exists.";
		}
		/*the "if statement" checks if the database does not exist, and creates it if it doesn't.*/
		/*If it does exist, then the else statement is run.*/	
		/*exclamation point means not*/
	}
	/*means variable can be accessed anywhere*/
	/*$this accesses the variables above, to only exist in that function [local variables]*/

	public function openConnection(){
		$this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
		/*creates new mysqli object*/
		if($this->connection->connect_error){
			die("Error: " . $this->connection->connect_error);
		}
		/*this is here in case there is an error that requires the page to terminate*/
	}

	public function closeConnection(){
		if(isset($this->connection)){
			/*isset deternines if a variable is set and is not NULL*/
			$this->connection->close();
		}
	}
	/*closes the connection from the afore created function*/

	public function query($string){
		$this->openConnection();
		/*calling on this function and executes the associated lines of code*/
		$query = $this->connection->query($string);
		/*uses the string of text to query the text from create-db*/

		if(!$query){
			$this->error = $this->connection->error;
		}
		/*gives the input of what the query stores*/
		$this->closeConnection();

		return $query;
	}
}