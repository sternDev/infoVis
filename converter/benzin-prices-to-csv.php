<?php
/**
 * Author: Jasmin Stern
 * Date: 02.05.2017
 * Time: 07:38
 */


require_once(dirname(__FILE__) . '/../classes/FileLoader.php');
require_once(dirname(__FILE__) . '/../classes/FileSaver.php');


$fileLoader = new FileLoader('prices-flensburg-star.json', null, 'json');
$array = $fileLoader->getArray();

var_dump($array);


$output = "DATE,VALUE\n";

foreach ($array as $tankstelle) {
    foreach($tankstelle as $date => $data) {
        $price = $data['diesel'];
        $date = strtotime($date);
        $date = date('H:i:s',$date);
        //$date = date('Y-m-d',$date);

        if (isset($price) && $price > 0) {
            $output .= $date . "," . $price . "\n";
        }
    }
}

FileSaver::saveFile('diesel/diesel.csv', $output);