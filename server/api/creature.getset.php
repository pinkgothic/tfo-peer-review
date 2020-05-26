<?php
header("Access-Control-Allow-Origin: ".$_SERVER['HTTP_ORIGIN']);
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// If preflight, return only the headers and not the content
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

// Include database and object file
include_once './db/db.php';
include_once './utilities/tokenbucket.php';
include_once './library/creature.php';
  
// Instantiate objects
$database = new Database();
$db = $database->getConnection();
$ratelimiter = new TokenBucket($db, $_SERVER['REMOTE_ADDR'], 100, 10);
$data = json_decode(file_get_contents("php://input"));

// Check ip against rate limits
if (!$ratelimiter->consume(10)){
    http_response_code(429);
    die(json_encode(array("message" => "(429) Too many requests.")));
}

// Validate uuid (stored in tfopr-uuid browser cookie)
if($_COOKIE['tfopr-uuid']!=null && strlen($_COOKIE['tfopr-uuid'])==36) {
    $uuid = $_COOKIE['tfopr-uuid'];
} else {
    http_response_code(400);
    die(json_encode(array("message" => "(400) Unable to get creature set. UUID token is invalid.")));
}

// How many creatures to fetch? (between 1 and 50; default 1)
if(!empty($data->count)) {
    $count = $data->count;
    if($count>50) $count = 50;
    if($count<1) $count = 1;
} else $count = 1;

// Initialize object
$creature = new Creature($db);
  
// Execute query and prepare return objects
$stmt = $creature->readSet($uuid, $count);
$output = array();
$output["found"] = '';
$output["creatures"] = array();

// If 0 records found, return false
if(!($stmt->rowCount()>0)) {
    $output["found"] = 'false';
    echo json_encode($output);
} else {
    // Otherwise, build array of objects...
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // $row['name'] -> $name
        extract($row);
        $item=array(
            "code" => $code,
            "imgsrc" => $imgsrc,
            "gotten" => $gotten,
            "name" => $name,
            "growthLevel" => $growthLevel
        );
        array_push($output["creatures"], $item);
    }

    // ... and return true + the array
    $output["found"] = 'true';
    http_response_code(200);
    echo json_encode($output);  
}