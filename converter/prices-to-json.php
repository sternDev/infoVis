<?php
/**
 * Author: Jasmin Stern
 * Date: 24.04.2017
 * Time: 19:21
 */


require_once (dirname(__FILE__).'/../classes/FileLoader.php');
require_once (dirname(__FILE__).'/../classes/FileSaver.php');


$fileLoader = new FileLoader('prices-dollar-to-euro.csv');
$array = $fileLoader->getArray();


$output = array();
$outputNew = array();
foreach($array as $data) {
    $price = $data[1];
    $date = $data[0];
    $year = date('Y', strtotime($date));
    if($year >= 2014) {
        if (isset($price) && $price > 0) {
            $output[$year][$date] = floatval($price);
            $outputNew[$date] = floatval($price);
        }
    }
}


FileSaver::saveFile('dollar-prices/prices.json', json_encode($outputNew));

foreach($output as $year => $data) {
   // FileSaver::saveFile('dollar-prices/prices-' . $year. '.json', json_encode($data));
}