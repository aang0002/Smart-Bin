function activatePage(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId
}

function renderProfile(elemId){
	// scroll to top
	window.scrollTo(0,0);
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// Getting elements from server and saving the in the variable data
	$.get("/profile", function(data) {
		$(data).appendTo(div);
		// pre-fill data
		fillDefaultPofileData();
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
	// scroll to top
	window.scrollTo(0,0);
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId;

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = '';

	// if the user currently clearning bin
	if (bigMapLoaded){
		renderBigMap(inProgressBinNum);
		return;
	}

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

// <div class="map", id="map">
// <div class='map-overlay' id='legend'></div>
function renderMap(div){
	// <div class="map", id="map">
	let map = document.createElement("div");
	map.className = "map";
	map.id = "map";
	div.appendChild(map);

	// <div class='map-overlay' id='legend'></div>
	let legend = document.createElement('div');
	legend.className = 'map-overlay';
	legend.id = 'legend';
	div.appendChild(legend);
}

//<table class="container" id="binTable"></table>
function renderTable(div){
	// create search bar
	div.innerHTML += '<input class="form-control" id="searchInput" type="text" style="margin-top: 10px" placeholder="Search..">';

	// render table 
	let table = document.createElement("table");
	table.className = "container";
	table.id = "binTable";
	div.appendChild(table);

	// run the search engine once the bins data is filled
	$(document).ready(function(){
	  $("#searchInput").on("keyup", function() {
	      var value = $(this).val().toLowerCase();
	      $("#binTable tr").filter(function() {
	          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	      });
	  });
	});
}

function fillDefaultPofileData(){
	var user = JSON.parse(localStorage.getItem("user"));
	var address = user['emp_address'].split(",");
	document.getElementById("emp_firstname").value = user['emp_firstname'];
	document.getElementById("emp_lastname").value = user['emp_lastname'];
	document.getElementById("bank_acc_name").value = user['bank_acc_name'];
	document.getElementById("bank_acc_bsb").value = user['bank_acc_bsb'];
	document.getElementById("bank_acc_number").value = user['bank_acc_number'];
	document.getElementById("email").value = user['email'];
	document.getElementById("emp_address_street").value = address[0].trim();
	document.getElementById("emp_address_suburb").value = address[1].trim();
	document.getElementById("emp_address_state").value = address[2].trim();
	document.getElementById("emp_address_postcode").value = address[3].trim();
	document.getElementById("emp_phone").value = user['emp_phone'];
	//document.getElementById("employment_type").value = user['employment_type'];
}