<?php
require_once("info.php");

// Load up the LTI Support code
require_once 'ims-blti/blti.php';



//Initialize, all secrets as 'secret', do not set session, and do not redirect
$context = new BLTI($lti_auth['secret'], false, false);

$currentCookieParams = session_get_cookie_params();
$cookie_domain= $_SERVER['HTTP_HOST'];
if (PHP_VERSION_ID >= 70300) {
session_set_cookie_params([
    'lifetime' =>  $currentCookieParams["lifetime"],
    'path' => '/',
    'domain' => $cookie_domain,
    'secure' => "1",
    'httponly' => "1",
    'samesite' => 'None',
]);
} else {
session_set_cookie_params(
    $currentCookieParams["lifetime"],
    '/; samesite=None',
    $cookie_domain,
    "1",
    "1"
);
}

session_start();
$_SESSION['toolKey'] = $context->info['oauth_consumer_key'];
$_SESSION['OrgUnitId'] = $context->info['context_id'];
session_write_close();


//Check the key is correct
if($lti_auth['key'] == $context->info['oauth_consumer_key']){
        //bring activate course HTML page
        readfile("publish.html");
}
else{
        echo 'LTI credentials not valid. Please refresh the page and try again. If you continue to receive this message please contact <a href="mailto:'.$supportEmail.'?Subject=Campus Store in Sakai" target="_top">'.$supportEmail.'</a>';
}

?>
