<?php
//sample connection to mongodb 
//based on our example data
//datase is assumed to be named test and collection is zipcoll
//refer to the following references:
/*
http://php.net/manual/en/mongoclient.construct.php
http://php.net/manual/en/mongo.core.php
http://php.net/manual/en/class.mongocollection.php
http://php.net/manual/en/class.mongodb.php
http://docs.mongodb.org/manual/reference/default-mongodb-port/
rnc recario revised 2015
*/
// Config

//Connect DB
$dbhost = 'localhost';
$dbname = 'fruitdb';
 
function get_db(){
	$db = new MongoClient('mongodb://localhost', array());
	return $db;
}
//$cursor = $c1->find();
function get_fruit_collection($db){
	$fruits = $db->selectCollection("fruitdb", "fruits");

	return $fruits;
}


function add_fruit($db){
	$fruits = get_fruit_collection($db);

	$name = $_POST['name'];
	$quantity = $_POST['quantity'];
	$distributor = $_POST['distributor'];
	$price = $_POST['price'];
	//$date_added = $_POST['dateAdded'];
	$date_added = date("Ymd"); /* SysDate/ format: 201504287 */

	$fruit_price = array(
		"amount" => $price,
		"dateUpdated" => $date_added
	);

	$fruit = array(
	    "name" => $name,
	    "quantity" => $quantity,
		"distributor" => $distributor,
		"price" => $price,
		"priceHistory" => array($fruit_price),
		"dateAdded" => $date_added
	);

	$fruits->insert($fruit);
	
	$fruit_id = $fruit['_id'];

	echo $fruit_id;
}

function get_fruits($db){
	$fruits = get_fruit_collection($db);

	$cursor = $fruits->find();

	$fruit_array = array();
	foreach($cursor as $fruit){
		array_push($fruit_array, $fruit);
	}

	echo json_encode($fruit_array);
}

function edit_fruit($db){
	$fruits = get_fruit_collection($db);

	$date_updated = date("Ymd"); /* SysDate/ format: 201504287 */

	$raw_update = $_POST['update'];
	if(isset($raw_update['price'])){
		$price = $raw_update['price'];
		$fruit_price = array(
			"amount" => $price,
			"dateUpdated" => $date_updated
		);
	}

	$query = array("_id"=>new MongoId($_POST['id']));
	$update = array('$set' => $raw_update);

	if(isset($fruit_price))
		$update['$push'] = array('priceHistory' => $fruit_price);

	var_dump($update);
	$result = $fruits->update($query, $update);

	var_dump($result);
}

function delete_fruit($db){
	$fruits = get_fruit_collection($db);

	$id = new MongoId($_POST['id']);

	$fruits->remove(array("_id" => $id));
}

if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    $db = get_db();
    switch($action) {
        case 'add_fruit' : add_fruit($db);break;
        case 'get_fruits' : get_fruits($db); break;
        case 'edit_fruit' : edit_fruit($db); break;
        case 'delete_fruit' : delete_fruit($db); break;
    }
}

?>