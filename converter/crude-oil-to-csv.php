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
foreach($array as $data) {
    $price = $data[1];

    /// 1 barrel = 158,987294928 Liter
    // 1 euro = price form data

    $price = @($price/158.987294928);
    $date = $data[0];
    $year = date('Y', strtotime($date));
    if($year != $oldYear) {
        if($oldYear != null) {
            FileSaver::saveFile('crude-oil/crude-oil-' . $oldYear . '.csv', $output);
        }
        $output = "DATE,VALUE\n";
        $oldYear = $year;
    }
    if(isset($price) && $price > 0) {
        $output .= $date.",".round($price,2)."\n";
    }
}

FileSaver::saveFile('crude-oil/crude-oil-' . $oldYear . '.csv', $output);