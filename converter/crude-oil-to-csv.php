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

$oldYear = null;
$output = '';
$fileLoader = new FileLoader('prices.json', 'created/dollar-prices/', 'json');
$priceArray = $fileLoader->getArray();


$output = "DATE,VALUE\n";
foreach($array as $data) {
    $price = $data[1];

    /// 1 barrel = 158,987294928 Liter
    // 1 euro = price form data

    $price = @($price/158.987294928);
    $date = $data[0];

    if($priceArray[$date] != null) {
        $price = 1 / $priceArray[$date] * $price;
        if (isset($price) && $price > 0) {
            $output .= $date . "," . round($price*1000) . "\n";
        }
    }
}

FileSaver::saveFile('crude-oil/crude-oil.csv', $output);