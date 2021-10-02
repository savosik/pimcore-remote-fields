<?php
namespace Savosik\RemoteFieldsBundle\Model\Object\Data;

use Pimcore\Model\DataObject\ClassDefinition;
use Pimcore\Logger;

class RemoteSelect extends ClassDefinition\Data\Select{


    public $fieldtype = "remoteSelect";

    public $remoteStorageUrl = null;


    public function getRemoteStorageUrl(){
        return $this->remoteStorageUrl;
    }

    public function setRemoteStorageUrl($remoteStorageUrl){
        $this->remoteStorageUrl = $remoteStorageUrl;
        return $this;
    }


    public function getDataForGrid($data, $object = null, $params = [])
    {

        return $data;
    }
}