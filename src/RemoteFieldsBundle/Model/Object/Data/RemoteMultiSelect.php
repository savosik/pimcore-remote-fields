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

    public function getDataForResource($data, $object = null, $params = [])
    {
        if (is_array($data)) {
            return implode(',', $data);
        }

        return null;
    }

    public function getDataFromResource($data, $object = null, $params = [])
    {
        if (strlen($data)) {
            return explode(',', $data);
        }

        return null;
    }

    public function getDataForQueryResource($data, $object = null, $params = [])
    {
        if (!empty($data) && is_array($data)) {
            return ','.implode(',', $data).',';
        }

        return null;
    }

    public function getDataForEditmode($data, $object = null, $params = [])
    {
        if (is_array($data)) {
            return implode(',', $data);
        }

        return null;
    }

    public function getDataForGrid($data, $object = null, $params = [])
    {
        return $this->getDataForEditmode($data, $object, $params);
    }


    public function getDataFromEditmode($data, $object = null, $params = [])
    {
        return $data;
    }


    public function getForCsvExport($object, $params = [])
    {
        $data = $this->getDataFromObjectParam($object, $params);
        if (is_array($data)) {
            return implode(',', $data);
        }

        return '';
    }

    /**
     * {@inheritdoc}
     */
    public function getDataForSearchIndex($object, $params = [])
    {
        $data = $this->getDataFromObjectParam($object, $params);
        if (is_array($data)) {
            return implode(' ', $data);
        }

        return '';
    }

}