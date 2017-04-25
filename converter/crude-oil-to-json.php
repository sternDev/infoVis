<?php
/**
 * Author: Jasmin Stern
 * Date: 24.04.2017
 * Time: 19:21
 */


require_once (dirname(__FILE__).'/../classes/FileLoader.php');
require_once (dirname(__FILE__).'/../classes/FileSaver.php');


$fileLoader = new FileLoader('crude-oil.csv');
$array = $fileLoader->getArray();


$output = array();
foreach($array as $data) {
    $price = $data[1];

    /// 1 barrel = 158,987294928 Liter

    $price = @($price/158.987294928);
    $date = $data[0];
    $year = date('Y', strtotime($date));
    if(isset($price) && $price > 0) {
        $output[$year][] = round($price,2);
    }
}
$json = json_encode($output);
echo $json;


foreach($output as $year => $data) {
    FileSaver::saveFile('crude-oil/crude-oil-' . $year . '.json', json_encode($data));
}
