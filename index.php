<?php
require_once("src/info.php");
require_once("src/doValence.php");
// Load up the LTI Support code
require_once 'ims-blti/blti.php';

//All of the LTI Launch data gets passed through in $_REQUEST
if(isset($_REQUEST['lti_message_type'])) {    //Is this an LTI Request?
    
    $context = new BLTI($lti_auth['secret'], false, false);

    if($context->complete) exit(); //True if redirect was done by BLTI class
    if($context->valid) { //True if LTI request was verified

        $orgUnitId = $context->info['context_id'];

        //check if who ever called this tool is allowed to activate the site
        $userId = preg_match('/_(\d+)/', $context->info['user_id'], $matches) ? $matches[1] : '-1';
        $isAllowed = doValenceRequest('GET','/d2l/api/lp/' . $config['LP_Version'] . '/enrollments/orgUnits/'.$orgUnitId.'/users/'.$userId);

        if ($isAllowed['Code']=200){
          if (!in_array($isAllowed['response']->RoleId, $roles)){
            return;
          }
        }else{
          return;
        }

        $offeringDetails = doValenceRequest('GET','/d2l/api/lp/' . $config['LP_Version'] . '/courses/'. $orgUnitId);

        if ($offeringDetails['Code']==200){
          $activate = $offeringDetails['response']->IsActive;
          $startDate  = new DateTime('UTC');
          $currentDate = new DateTime('UTC');
 
          if($offeringDetails['response']->StartDate != null){
            $startDate = DateTime::createFromFormat('Y-m-d\TH:i:s.u\Z', $offeringDetails['response']->StartDate);
          }

          if($activate &&  $startDate > $currentDate) {
            $activate = true;
            $startDate = $currentDate;
          } else{
            $activate = !$activate;
          }

          if($activate){
            $startDate = $currentDate;
          }
          
          $postOfferingData = array("Name"=>$offeringDetails['response']->Name,
                                    "Code"=>$offeringDetails['response']->Code,
                                    "StartDate"=>$startDate->format("Y-m-d\TH:i:s.u\Z"),
                                    "EndDate"=>$offeringDetails['response']->EndDate,
                                    "IsActive"=>$activate,
                                    "Description"=>array("Content"=>$offeringDetails['response']->Description->Html, "Type"=>"Html"),
                                    "CanSelfRegister"=>$offeringDetails['response']->CanSelfRegister);
    
          $updateOffering = doValenceRequest('PUT','/d2l/api/lp/' . $config['LP_Version'] . '/courses/'. $orgUnitId, $postOfferingData);
        }

        $message = $activate ? 'activated' : 'deactivated';

        if ($updateOffering['Code']==200){
            echo '<!DOCTYPE html>
            <html lang="en">
            <head>
              <link rel="stylesheet" href="'.$css_link.'">
            </head>
            <body>
              <div id="course_offering_status" class="activation-container lti-activated-feedback">
                The site has been '.$message.' successfully.
              </div>
            </body>
            </html>
            ';
        }
    } else {
        echo 'LTI credentials not valid. Please refresh the page and try again. If you continue to receive this message please contact <a href="mailto:'.$supportEmail.'?Subject=Activation Widget Issue" target="_top">'.$supportEmail.'</a>';
    }
}
else { 
    echo 'LTI credentials not valid. Please refresh the page and try again. If you continue to receive this message please contact <a href="mailto:'.$supportEmail.'?Subject=Activation Widget Issue" target="_top">'.$supportEmail.'</a>';
}
?>