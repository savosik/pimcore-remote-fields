<?php

namespace Savosik\RemoteFieldsBundle\Model\Object\Data;
use Pimcore\Model\DataObject\ClassDefinition;


class RemoteMultiSelect extends ClassDefinition\Data\Multiselect{

    public $fieldtype = "remoteMultiSelect";

    public $remoteStorageUrl = null;


    public function getRemoteStorageUrl(){
        return $this->remoteStorageUrl;
    }

    public function setRemoteStorageUrl($remoteStorageUrl){
        $this->remoteStorageUrl = $remoteStorageUrl;
        return $this;
    }

}