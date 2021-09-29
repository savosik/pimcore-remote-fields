<?php

namespace Savosik\RemoteFieldsBundle\Model\Object\Data;
use Pimcore\Model\DataObject\ClassDefinition;


class RemoteSelect extends ClassDefinition\Data\Select{

    public $fieldtype = "RemoteSelect";

    public $remoteStorageUrl = null;


    public function getRemoteStorageUrl(){
        return $this->remoteStorageUrl;
    }

    public function setRemoteStorageUrl($remoteStorageUrl){
        $this->remoteStorageUrl = $remoteStorageUrl;
        return $this;
    }
}