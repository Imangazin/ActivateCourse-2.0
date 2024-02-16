// Formatting response object
function format(resp) {
  try {
    var json = JSON.parse(resp);
    return JSON.stringify(json, null, '\t');
  } catch(e) {
    return resp;
  }
}

// Prints the date in specific format 
function formatDate(date) {
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	return date.toLocaleDateString(undefined, options);
}

// Function to calculate days until end date
function daysUntilEndDate(end_date, today) {
	const daysDiff = Math.ceil((end_date-today) / (1000 * 60 * 60 * 24));
	if (daysDiff<=0) return 15; else return daysDiff;
}

// Creates a lti link and formats it as a button and adds it to the div(parentElement)
function addButton(parentElement, action, lti_link){
	let action_button = document.createElement("a");
	action_button.classList.add("button-like-link");
	action_button.setAttribute("style", "color:#fff");
	action_button.setAttribute("target", "_self");
	action_button.setAttribute("href", lti_link);
	action_button.innerHTML = action;
	parentElement.append(action_button);
}

// Main function called from widget content document.  
function courseOfferingStatus (result, orgUnitId, role) {
	var course_offering_status = document.getElementById('course_offering_status');
	if (result.Access.EndDate === null) {
		// Hide the widget
		hideTheWidget();
	} else {
		// current date
		const today = new Date();
		
		// set start date to Yesterday, then change if it is not null
		var start_date = new Date(today);
		start_date.setDate(today.getDate()-1)
		if (result.Access.StartDate != null){
			start_date = new Date(result.Access.StartDate);
		}
		// end date
		var end_date = new Date(result.Access.EndDate);
		// course status
		const active = result.Access.IsActive;

		// link to Course offering info page 
		offering_info_link =  '/d2l/lp/manageCourses/course_offering_info_viewedit.d2l?ou='+orgUnitId;
		
		course_offering_status.classList.add("activation-container");

		if (!active && end_date>today){
			//Pre Start Date & Inactive
			course_offering_status.classList.add("pre-active-state");
			course_offering_status.innerHTML = messageFormat(pre_start_date_inactive);
			//add activate button to admins and instructor
			if (role==105 || role==116 || role==109){
				addButton(course_offering_status, 'Activate Now', messageFormat(lti_link));
			}
		} else if (active && start_date>today){
			//Pre Start Date & Active
			course_offering_status.classList.add("pre-active-state");
			course_offering_status.innerHTML = messageFormat(pre_start_date_active);
			//add activate button to admins and instructor
			if (role==105 || role==116 || role==109){
				addButton(course_offering_status, 'Activate Now', messageFormat(lti_link));
			}
		} else if (active && daysUntilEndDate(end_date, today) <= 14){
			//Countdown Status: 14 days until date.
			//Hide from student and readonly
			if (role == 110 || role == 111) { 
				hideTheWidget();	
			  } else {
				course_offering_status.innerHTML = messageFormat(countdown_status);
				course_offering_status.classList.add("post-active-state");
			  }
		} else if (active && end_date<today){
			//Post <date>, Active
			if (role == 110 || role == 111) {
				course_offering_status.classList.add("post-active-state");
				course_offering_status.innerHTML = messageFormat(post_date_active_student);
			  } else {
				course_offering_status.classList.add("post-active-state");
				course_offering_status.innerHTML = messageFormat(post_date_active_instructor);	
				//add deactivate button to admins and instructor
				if (role==105 || role==116 || role==109){
					addButton(course_offering_status, 'Deactivate Now', messageFormat(lti_link));
				}
			}
		} else if (!active && end_date<today){
			//Post <date>, Inactive
			course_offering_status.classList.add("post-active-state");
			course_offering_status.innerHTML = messageFormat(post_date_inactive);
		}
		else {
		  // Hide the widget
		  hideTheWidget();
		}
	}	

	// Makes status message somewhat dynamic
	function messageFormat(message){
		message = message.replace('orgUnitId', orgUnitId);
		message = message.replace('offering_info_link', offering_info_link);
		message = message.replace('start_date', formatDate(start_date));
		message = message.replace('end_date', formatDate(end_date));
		return message;
	}
}

// Hides the widget
function hideTheWidget(){
	var parentDocument = window.parent.document;
	var parentIframe =  parentDocument.querySelector('[title="'+widget_title+'"]');
	parentIframe.parentNode.parentNode.parentNode.parentNode.style.display='none';
}