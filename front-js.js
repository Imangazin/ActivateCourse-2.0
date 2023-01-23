//Created by Matt Clare Saturday September 3, 2022 https://github.com/mclare/edtech_styles/blob/main/widgets/get-site-status.html
function format(resp) {
  try {
    var json = JSON.parse(resp);
    return JSON.stringify(json, null, '\t');
  } catch(e) {
    return resp;
  }
}

function brockOrgStatus (result, orgUnitId) {
	message = '<p style="flex:1; text-align:center;"><strong>Site Status:</strong> Course <a href=\"/d2l/lp/manageCourses/course_offering_info_viewedit.d2l?ou='+orgUnitId+'\">Start Date</a> in the future. Students unable to access site.</p>';

	dateActive = true;
    today = new Date();
	
    if (result.StartDate != null) {
		var startDate = new Date(result.StartDate);
		if (startDate.getTime() > today) { //Started
			dateActive = false;		
		}
	}
  
    if (result.EndDate != null){
        var endDate = new Date(result.EndDate);
		if (result.IsActive == false && endDate.getTime() > today){
			// populate src parameter of the iframe with quicklink to the LTI tool, and replace within the link {OrgUnitId} with '+orgUnitId+'
			document.getElementById('brock-org-status').innerHTML = '<iframe src="" style="overflow-y: hidden; width: 100%; height: 96px;" scrolling="no" frameborder="0"> </iframe>';
			document.getElementById('brock-org-status').style.display='flex';
		} else	if (result.IsActive == true && dateActive == false) {
			document.getElementById('brock-org-status').innerHTML = message; //Place message in div
			document.getElementById('brock-org-status').style.display='flex';
                }
		else {
			document.getElementById('brock-org-status').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none'; //Remove this widget
		}
    }else {
		document.getElementById('brock-org-status').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none'; //Remove this widget
	}
}
/* 
//The following code should be in the widget
<div id="brock-org-status" class="brock-org-status" style="color: #664d03; background-color: #fff3cd; border-color: #ffecb5; height: 96px; display: none; align-items: center;"></div>
//populate src parameter with path to this js file, you can place it in BS public files folder
<script type="text/javascript" src=""></script>
<script>
window.addEventListener('load', function () {
  console.log('My Role: '+{RoleId});
   $.get("/d2l/api/lp/1.36/courses/{OrgUnitId}", function(data, status){
	  result = format(data);
	  brockOrgStatus(result, {OrgUnitId});
	});
})
</script>
*/
