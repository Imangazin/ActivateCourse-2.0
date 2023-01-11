<?php
require_once("info.php");
require_once 'lib/D2LAppContextFactory.php';

//read LTI tool Key and OrgUnitID passed by session from main page index.php

session_start();
$toolKey = $_SESSION['toolKey'];
$orgUnitId =$_SESSION['OrgUnitId'];
$roleId =end(explode(",", $_SESSION['RoleId']));
session_write_close();


function doValenceRequest($verb, $route, $postFields = array()){
    /**
 * Copyright (c) 2012 Desire2Learn Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the license at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
    global $config;
    // Create authContext
    $authContextFactory = new D2LAppContextFactory();
    $authContext = $authContextFactory->createSecurityContext($config['appId'], $config['appKey']);

    // Create userContext
    $hostSpec = new D2LHostSpec($config['host'], $config['port'], $config['scheme']);
    $userContext = $authContext->createUserContextFromHostSpec($hostSpec, $config['userId'], $config['userKey']);

    // Create url for API call
    $uri = $userContext->createAuthenticatedUri($route, $verb);

    // Setup cURL
    $ch = curl_init();
    $options = array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $verb,
        CURLOPT_URL            => $uri,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_POSTFIELDS     => json_encode($postFields),
        CURLOPT_HTTPHEADER     => array('Accept: application/json', 'Content-Type: application/json'),
    );
    curl_setopt_array($ch, $options);

    // Do call
    $response = curl_exec($ch);

    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $responseCode = $userContext->handleResult($response, $httpCode, $contentType);
    curl_close($ch);

    return(array('Code'=>$httpCode, 'response'=>json_decode($response)));
}

//Check the LTI key is correct and allow only Instructor or Administrator role to active the site

if(($lti_auth['key'] == $toolKey) && ($roleId == "Instructor" || $roleId == "Administrator")){

    $offeringDetails = doValenceRequest('GET','/d2l/api/lp/' . $config['LP_Version'] . '/courses/'. $orgUnitId);

    if ($offeringDetails['Code']==200){
        $currentDate = new DateTime('UTC');
        $postOfferingData = array("Name"=>$offeringDetails['response']->Name,
                                  "Code"=>$offeringDetails['response']->Code,
                                  "StartDate"=>$currentDate->format("Y-m-d\TH:i:s.u\Z"),
                                  "EndDate"=>$offeringDetails['response']->EndDate,
                                  "IsActive"=>true,
                                  "Description"=>array("Content"=>$offeringDetails['response']->Description->Html, "Type"=>"Html"),
                                  "CanSelfRegister"=>$offeringDetails['response']->CanSelfRegister);

        $updateOffering = doValenceRequest('PUT','/d2l/api/lp/' . $config['LP_Version'] . '/courses/'. $orgUnitId, $postOfferingData);
    }
    if ($updateOffering['Code']==200){
        echo "success";
    }
}
?>
