function activatePage(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId
}

function renderProfile(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// Getting elements from server and saving the in the variable data
	$.get("/profile", function(data) {
		$(data).appendTo(div)
	});
}

// <div>
// 	<!--User Profile-->
// 	<div class="userprofile">
// 	  <div class="avatar">
// 	    <img src="{% static 'images/no-photo-profile.png' %}" height="150" width="150">
// 	  </div>
// 	  <h2 id="emp_name">Name</h2>
// 	  <p id="emp_username">username</p>
// 	  <p id="emp_dob">DOB</p>
// 	  <p id="bins_collected">Bins Collected</p>
// 	</div>

// 	<!--map-->
// 	<div class="map", id="map"> </div>
// </div>
// <table class="container" id="binTable"></table>
function renderHomeMain(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// create another div element to wrap user card and map
	let div2 = document.createElement('div');

	// render user profile card
	renderProfileCard(div2);

	// render map
	renderMap(div2);

	// append div2 to main div
	div.appendChild(div2);

	// render table
	renderTable(div);

	// fill all the created elements with data
	fillMapData();
	fillUserCardData();
	fillBinTable();
}


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

	// create username element
	let empusername = document.createElement("p");
	empusername.id = "emp_username";

	// create DOB element
	let empdob = document.createElement("p");
	empdob.id = "emp_dob";

	// create Bin Collected element
	let binscollected = document.createElement("p");
	binscollected.id = "bins_collected";

	// append all element to userprofile div
	userprofile.appendChild(avatar);
	userprofile.appendChild(empname);
	userprofile.appendChild(empusername);
	userprofile.appendChild(empdob);
	userprofile.appendChild(binscollected);
	div.appendChild(userprofile)
}

// <div class="map", id="map">
function renderMap(div){
	let map = document.createElement("div");
	map.className = "map";
	map.id = "map";
	div.appendChild(map);
}

//<table class="container" id="binTable"></table>
function renderTable(div){
	let table = document.createElement("table");
	table.className = "container";
	table.id = "binTable";
	div.appendChild(table);
}