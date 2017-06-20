<?php
/**
 * Created by PhpStorm.
 * User: Jasmin
 * Date: 07.06.2017
 * Time: 20:03
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../config/database.php');

$db = new PDO("pgsql:dbname=" . $dbname . ";host=" . $host, $dbuser, $dbpass);

if (isset($_GET['gasStationId'])) {

    $gasStationId = $_GET['gasStationId'];
    $startDate = date('Y-m-d', time() - 60 * 60 * 24 * 14); // 14 days
    $endDate = date('Y-m-d');
    if (isset($_GET['startDate'])) {
        $startDate = $_GET['startDate'];
    }
    if (isset($_GET['endDate'])) {
        $endDate = $_GET['endDate'];
    }
    $type = 'diesel';
    if (isset($_GET['type'])) {
        switch ($_GET['type']) {
            case'diesel':
                $type = 'diesel';
                break;
            case 'e5':
                $type = 'e5';
                break;
            case 'e10':
                $type = 'e10';
                break;
            default:
                $type = 'diesel';
                break;
        }
    }

    $sql = "SELECT * FROM gas_station_information_history WHERE stid = '" . $gasStationId . "' ";
    $sql .= "AND date >= '" . $startDate . "' AND date <= '" . $endDate . "' ";
    $sql .= "AND " . $type . " > 0 ";
    $sth = $db->prepare($sql);
    $res = $sth->execute();


    $csv = "DATE,VALUE\n";
    $data = $sth->fetchAll(PDO::FETCH_ASSOC);


    function sortDate($a, $b)
    {
        return strtotime($a['date']) - strtotime($b['date']);
    }

    usort($data, "sortDate");

    $oldDate = null;
    $oldPrice = null;
    foreach ($data as $row) {
        if ($oldDate != null && $oldPrice != $row[$type]) {
            $csv .= date('Y-m-d H:i:s', strtotime($row['date'])-1) . "," . $oldPrice . "\n";
        }
        $csv .= date('Y-m-d H:i:s', strtotime($row['date'])) . "," . $row[$type] . "\n";
        $oldPrice = $row[$type];
        $oldDate = strtotime($row['date']);
    }

    header('Access-Control-Allow-Origin: *');
    header('Content-type: text/csv');
//header('Content-type: application/json; charset=utf-8');
    echo $csv;


}