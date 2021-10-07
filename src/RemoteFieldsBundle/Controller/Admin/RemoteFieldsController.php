<?php
namespace Savosik\RemoteFieldsBundle\Controller\Admin;

use Pimcore\Bundle\AdminBundle\Controller\AdminController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use GuzzleHttp\Client as GuzzleClient;

/**
 * @Route("/admin/remote-fields")
 */
class RemoteFieldsController extends AdminController{

    /**
     * @Route("/store-data")
     */
    public function storeDataAction(Request $request){

        $client = new GuzzleClient();

        $remote_url = $request->get("remote_url");

        $res = $client->request('GET', $remote_url, [
            'query' => [
                'query' => $request->get("query"),
                'page' => $request->get("page"),
                'start' => $request->get("start"),
                'limit' => $request->get("limit")
            ]
        ]);

        $data = [];

        if($res->getStatusCode() == 200){
            $result =  $res->getBody();

            /* we want same json {data:[{key: label, value: value},{key: label, value: value}]} */
            $data = json_decode($result, TRUE);

        }

        return $this->adminJson($data);
    }

}