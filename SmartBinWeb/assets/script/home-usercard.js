/*
Prepares a usercard elemeents in the UI
*/
function renderProfileCard(div){
	let userprofile = document.createElement("div");
	userprofile.className = "userprofile";

	// create avatar
	let avatar = document.createElement("div");
	avatar.className = 'avatar';
	let img = document.createElement('img');
	img.src = GLOBAL_PATH + '/static/images/no-photo-profile.png'//"{% 'static images/no-photo-profile.png' %}";
	img.height = "150";
	img.width = "150";
	avatar.appendChild(img);

	// create emp name element
	let empname = document.createElement("h2");
	empname.id = "emp_name";
	empname.innerHTML = "";

	// create username element
	let empusername = document.createElement("p");
	empusername.id = "emp_username";
	empusername.innerHTML = "Username: ";

	// create DOB element
	let empdob = document.createElement("p");
	empdob.id = "emp_dob";
	empdob.innerHTML += "D.O.B: ";

	// create Bin Collected element
	let binscollected = document.createElement("p");
	binscollected.id = "bins_collected";
	binscollected.innerHTML += "Bins Collected: ";

	// append all element to userprofile div
	userprofile.appendChild(avatar);
	userprofile.appendChild(empname);
	userprofile.appendChild(empusername);
	userprofile.appendChild(empdob);
	userprofile.appendChild(binscollected);
	div.appendChild(userprofile)
}

/*
 Fill in user profile card with user data
*/
function fillUserCardData(){
	let userdata = localStorage.getItem('user');
	userdata = JSON.parse(userdata);
	document.getElementById("emp_name").innerHTML += userdata.emp_firstname + ' ' + userdata.emp_lastname;
	document.getElementById("emp_username").innerHTML += userdata.emp_username;
	document.getElementById("emp_dob").innerHTML += userdata.emp_dob;
	document.getElementById("bins_collected").innerHTML += userdata.bins_collected;
}