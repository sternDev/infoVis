<?php
/**
 * Created by PhpStorm.
 * User: Jasmin
 * Date: 07.06.2017
 * Time: 18:56
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../config/database.php');

$db = new PDO("pgsql:dbname=".$dbname.";host=".$host, $dbuser, $dbpass);

//$sth = $db->prepare("SELECT * FROM gas_station WHERE post_code LIKE '21%' OR post_code LIKE '22%' OR post_code LIKE '23%' OR post_code LIKE '24%' OR post_code LIKE '25%' ");


//$sth = $db->prepare("SELECT * FROM gas_station WHERE place IN('Lensahn', 'Selent', 'Plön','Flensburg') ");
$sth = $db->prepare("SELECT * FROM gas_station WHERE post_code IN('24937','24939','24941','24943','24944') ");
$sth->execute();

$array = $sth->fetchAll(PDO::FETCH_ASSOC);
$json = json_encode($array, JSON_PRETTY_PRINT);

header('Access-Control-Allow-Origin: *');
//header('Content-type: application/json; charset=utf-8');
echo $json;
