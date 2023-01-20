<div id="brock-org-status" class="brock-org-status" style="color: #664d03; background-color: #fff3cd; border-color: #ffecb5; height: 96px; display: flex; align-items: center;"></div>
<script>
  //Created by Matt Clare Saturday September 3, 2022 https://github.com/mclare/edtech_styles/blob/main/widgets/get-site-status.html
function format(resp) {
  try {
    var json = JSON.parse(resp);
    return JSON.stringify(json, null, '\t');
  } catch(e) {
    return resp;
  }
}

function brockOrgStatus (result) {
	message = '<p style="flex:1; text-align:center;"><strong>Site Status:</strong> Course <a href=\"/d2l/lp/manageCourses/course_offering_info_viewedit.d2l?ou={OrgUnitId}\">Start Date</a> in the future. Students unable to access site.</p>';

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
			document.getElementById('brock-org-status').innerHTML = '<iframe src="/d2l/common/dialogs/quickLink/quickLink.d2l?ou={orgUnitId}&amp;type=lti&amp;rcode=E3441D29-BE5A-4BE7-AA7C-8C696DC9DDED-80367&amp;srcou=6606" style="overflow-y: hidden; width: 100%; height: 96px;" scrolling="no" frameborder="0"> </iframe>';
		} else	if (result.IsActive == true && dateActive == false) {
			document.getElementById('brock-org-status').innerHTML = message; //Place message in div
                }
		else {
			document.getElementById('brock-org-status').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none'; //Remove this widget
		}
    }else {
		document.getElementById('brock-org-status').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none'; //Remove this widget
	}
}

function brockOrgStatusCheck () {
	//jQuery AJAX call for JSON info
	$.get("/d2l/api/lp/1.36/courses/{OrgUnitId}", function(data, status){
	  result = format(data);
	  brockOrgStatus(result);
	});
}

//Wait until the page is fully loaded!
window.addEventListener('load', function () {
   brockOrgStatusCheck();
})
</script>
