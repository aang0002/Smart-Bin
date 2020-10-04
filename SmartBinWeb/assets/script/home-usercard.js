// fill in user profile card with user data
function fillUserCardData(){
	let userdata = localStorage.getItem('user');
	userdata = JSON.parse(userdata);
	document.getElementById("emp_name").innerHTML += userdata.emp_firstname + ' ' + userdata.emp_lastname;
	document.getElementById("emp_username").innerHTML += userdata.emp_username;
	document.getElementById("emp_dob").innerHTML += userdata.emp_dob;
	document.getElementById("bins_collected").innerHTML += userdata.bins_collected;
}