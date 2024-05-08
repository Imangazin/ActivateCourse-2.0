# ActivateCourse
LTI 1.0 tool to activate Brightspace course offerings

## instructions
* Create Brightspace ID Key Authorization app
* Fillout the info.php file and config.js file. Note that 'host' takes url without "https:\\".
* activation_js.js, config.js and activation_styles.css should be placed into Brightspace's Public Files.
* Add the tool as External Learning Tool to Brightspace
  * New Tool Provider
  * Launch Point: should point index.php file in clients server
  * OAuth Signature Method: HMAC-SHA1
  * Secret: generate one, and populate the $lti_auth = array('key' => '', 'secret' => ''); in info.php as well
  * Check "Use custom tool consumer information instead of default"
  * Key: generate one, and populate the $lti_auth = array('key' => '', 'secret' => ''); in info.php as well
  * Name, Description, Contact email: Any
  * Check Allow users to use this tool provider
  * Check all Security Settings
  * Make it available to every course offering under the Organization
  * Save
  * Manage External Learning Tool Links
  * New Link
  * Title: Any
  * URL: should point index.php file in clients server
  * Allow users to view this link. Note this setting will make the tool available everywhere in BLE. Should be toggled while setting it up. Once the tool is set, turn it off.
  * Check all "Use link security settings"
  * Make it available to all course offerings under organization.
* Create Custom Widget
  * Widget is Sandboxed is unchecked
  * Render in IFrame is checked
  * Make it available every course offering under organization
  * Copy the widget.html file content into the source code
  * Then <link rel="stylesheet" href=""> should point to activation_styles.css file in Public Files (placed in earlier steps)
  * Then two <script src=""></script> lines should point to config.js and activation_js.js files in Public Files.
  * Customize Widget Style, uncheck all three Widget Settings
* config.js file
  * lti_link : Once the external learning tool and link are set up, open a Brightspace text editor anywhere (content, announcement), and add the created External Learning tool from Insert Quicklink and copy the link from the text editor's source code.
  * widget_title: must match the widget name
  * populate the rest with your language
* activation_js.js file modifies/replaces some keywords from the config.js messages (see messageFormat function), if you do not use those keywords it should ignore, otherwise feel free to make any modifications. 
* info.php file
  * $roles array should be populated with roleIds (separate by comma if more than one) who you think should have access to activate the course offerings. RoleIds can be find from the URL, as admin open Roles and Permissions and click Instructor (or any other), copy the value of the roleId in the URL. Usually you want to paste here Instructor, Admin and any other instructional team roles ids.
  * $css_link: should be the absolute link to the activation_styles.css file in Public Files.


## contact nimangazin@brocku.ca for any questions
