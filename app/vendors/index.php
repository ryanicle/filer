<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;

$folderId = 65;
$token = '#POST /rest/folders/{id}/actions/initiateUpload';

#POST /rest/folders/{id}/actions/initiateUpload
$client = new GuzzleHttp\Client(['base_uri' => 'https://ryan-tfa.accellion.net/rest/']);

$client->setDefaultOption('headers', array('Authorization' => 'Bearer ' . $token, 'Content-Type' => 'application/json'));

$response = $client->get('folders/' . $folderId . '/actions/initiateUpload');

print_r($response);