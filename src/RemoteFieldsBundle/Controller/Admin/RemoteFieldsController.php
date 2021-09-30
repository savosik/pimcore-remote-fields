<?php
namespace Savosik\RemoteFieldsBundle\Controller\Admin;

use Pimcore\Model\Asset;
use Pimcore\Model\Document;
use Pimcore\Model\DataObject;
use Pimcore\Bundle\AdminBundle\Controller\AdminController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/admin/remote-fields")
 */
class RemoteFieldsController extends AdminController{

    /**
     * @Route("/store-data")
     */
    public function storeDataAction(Request $request){
        $list = [
            ["key" => "label1", "value" => "value1"],
            ["key" => "label2", "value" => "value2"],
            ["key" => "label3", "value" => "value3"],
            ["key" => "label4", "value" => "value4"],
            ["key" => "label5", "value" => "value5"],
            ["key" => "label6", "value" => "value6"],
        ];

        return $this->adminJson(['data' => $list]);
    }

}