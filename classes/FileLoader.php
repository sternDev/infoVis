<?php

/**
 * Created by PhpStorm.
 * User: Jasmin
 * Date: 25.04.2017
 * Time: 14:15
 */
class FileLoader
{
    private $filename;
    private $data = array();
    private $path = '/../data/external/';
    private $fileContent ;

    public function __construct($filename)
    {
        $this->filename = $filename;
        $this->loadFile();
    }

    private function loadFile()
    {
        $file = dirname(__FILE__) . $this->path . $this->filename;
        $this->fileContent = file_get_contents($file);

        $this->loadCsvToArray();
    }

    private function loadCsvToArray() {

        $this->data = array_map("str_getcsv", explode("\n", $this->fileContent));
    }

    public function getJSON() {
        return json_encode($this->data);
    }

    public function getArray() {
        return $this->data;
    }


}