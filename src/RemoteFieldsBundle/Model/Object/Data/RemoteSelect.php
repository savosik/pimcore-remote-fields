<?php

namespace Savosik\RemoteFieldsBundle\Model\Object\Data;
use Pimcore\Model\DataObject\ClassDefinition\Data\Select;


class RemoteSelect extends Select{

    public $fieldtype = "RemoteSelect";

    public $remoteStorage = null;


    public function getRemoteStorage(){
        return $this->remoteStorage;
    }


    public function setRemoteStorage($remoteStorage){
        $this->remoteStorage = $remoteStorage;
        return $this;
    }
}