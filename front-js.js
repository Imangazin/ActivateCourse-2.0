<custom-style>
<style>
.brock-org-status {
color: #664d03;
background-color: #fff3cd;
border-color: #ffecb5;
text-align: center;
}  
</style>
</custom-style>
<div id="brock-org-status"></div>
<script>
function format(resp) {
  try {
    var json = JSON.parse(resp);
    return JSON.stringify(json, null, '\t');
  } catch(e) {
    return resp;
  }
}

function brockOrgStatus (result) {
	dateMessage = "";
	message = "";

	dateActive = true;
    today = new Date();
	
    if (result.StartDate != null) {
		var startDate = new Date(result.StartDate);
		if (startDate.getTime() > today) { //Started
			dateActive = false;
			dateMessage = dateMessage + " Course Start Date in the future. Students unable to access site.";
		}
	}
    if (result.EndDate != null){
        var endDate = new Date(result.EndDate);
		if (result.IsActive == false && endDate.getTime() > today){
			document.getElementById('brock-org-status').innerHTML = '<iframe src="" style="overflow-y: hidden; height: 82px; width: 100%;" scrolling="no" frameborder="0"> </iframe>';
		} else	if (result.IsActive == true && dateActive == false) {
			message = "<strong>Site Status:</strong> "+dateMessage;
			document.getElementById('brock-org-status').innerHTML = message; //Place message in div}
			document.getElementById('brock-org-status').className = "brock-org-status";
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