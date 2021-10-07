<?php

namespace Savosik\RemoteFieldsBundle\Model\Object\Data;
use Pimcore\Model\DataObject\ClassDefinition;
use Pimcore\Model\DataObject\ClassDefinition\Data\Multiselect;
use Pimcore\Model\DataObject\ClassDefinition\Service;


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


    private function isJson($string) {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    /**
     * @see ResourcePersistenceAwareInterface::getDataForResource
     *
     * @param array|null $data
     * @param null|DataObject\Concrete $object
     * @param mixed $params
     *
     * @return string|null
     */
    public function getDataForResource($data, $object = null, $params = [])
    {
        if (is_array($data)) {
            return json_encode($data);
        }

        return null;
    }

    /**
     * @see ResourcePersistenceAwareInterface::getDataFromResource
     *
     * @param string $data
     * @param null|DataObject\Concrete $object
     * @param mixed $params
     *
     * @return array|null
     */
    public function getDataFromResource($data, $object = null, $params = [])
    {
        if (strlen($data)) {
            return json_decode($data, TRUE);
        }

        return null;
    }

    /**
     * @see QueryResourcePersistenceAwareInterface::getDataForQueryResource
     *
     * @param array $data
     * @param null|DataObject\Concrete $object
     * @param mixed $params
     *
     * @return string|null
     */
    public function getDataForQueryResource($data, $object = null, $params = [])
    {
        if (!empty($data) && is_array($data)) {
            return json_encode($data);
        }

        return null;
    }

    /**
     * @see Data::getDataForEditmode
     *
     * @param array|null $data
     * @param null|DataObject\Concrete $object
     * @param mixed $params
     *
     * @return string|null
     */
    public function getDataForEditmode($data, $object = null, $params = [])
    {
        if (is_array($data)) {
            return json_encode($data);
        }

        return null;
    }

    /**
     * @param array $data
     * @param null|DataObject\Concrete $object
     * @param mixed $params
     *
     * @return string
     */
    public function getDataForGrid($data, $object = null, $params = [])
    {
        return $this->getDataForEditmode($data, $object, $params);
    }

    /**
     * @see Data::getDataFromEditmode
     *
     * @param string $data
     * @param null|DataObject\Concrete $object
     * @param mixed $params
     *
     * @return string
     */
    public function getDataFromEditmode($data, $object = null, $params = [])
    {

        return json_encode(json_decode($data,TRUE));
    }

    /**
     * @see Data::getVersionPreview
     *
     * @param array|null $data
     * @param null|DataObject\Concrete $object
     * @param mixed $params
     *
     * @return string|null
     */
    public function getVersionPreview($data, $object = null, $params = [])
    {
        if (is_array($data)) {

            return htmlspecialchars(json_encode($data), ENT_QUOTES, 'UTF-8');
        }

        return null;
    }


    /**
     * {@inheritdoc}
     */
    public function getForCsvExport($object, $params = [])
    {
        $data = $this->getDataFromObjectParam($object, $params);
        if (is_array($data)) {
            return json_encode($data);
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
            return json_encode($data);
        }

        return '';
    }











}