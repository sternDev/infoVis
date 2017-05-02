<?php
/**
 * Author: Jasmin Stern
 * Date: 01.05.2017
 * Time: 22:36
 */

$myFile = dirname(__FILE__)."/../data/test.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $_POST["data"];
fwrite($fh, $stringData);
fclose($fh);