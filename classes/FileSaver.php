<?php

/**
 * Created by PhpStorm.
 * User: Jasmin
 * Date: 25.04.2017
 * Time: 14:43
 */
class FileSaver
{
    private static $path = '/../data/created/';

    public static function saveFile($filename, $content) {
        $fp = fopen(dirname(__FILE__).self::$path.$filename, 'w');
        fwrite($fp, $content);
        fclose($fp);
    }

}