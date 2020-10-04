function generateTableHead(table, headers) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    headers.forEach((header) => {
        let th = document.createElement("th");
        let text = document.createTextNode(header);
        th.appendChild(text);
        row.appendChild(th);
        })
}

function generateTableContent(table, attributes, dataURI) {
    let binsToGet =5
    let request = new XMLHttpRequest()
    let path = dataURI
    
    request.open('GET', path, true)
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response).data

      if (request.status >= 200 && request.status < 400) {
        // store data into local storage
        // display the 5 nearest bin entries in the HTML table
        data.forEach((object) => {
            // render a row in the table
            let row = table.insertRow();
            attributes.forEach((key) => {
                let cell = row.insertCell();
                let content = document.createTextNode(object.attributes[key])
                cell.appendChild(content);
            })
        })}
      else {
        console.log('error');
      }
    }

    request.send();
}

function renderEmployeesTable(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// fill div with a table
	let headers = ["Username", "Firstname", "Lastname", "D.O.B", "Address", "Phone", "Bins Collected"]
	let attributes = ["emp_username", "emp_firstname", "emp_lastname", "emp_dob", "emp_address", "emp_phone", "bins_collected"]
	let table = document.createElement("table"); 
	table.className = 'container'
	div.appendChild(table)
	generateTableHead(table, headers);
	generateTableContent(table, attributes, '/employees');
}


function renderBinsTable(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// fill div with a table
	let headers = ["Num", "Type", "Installation Date", "Status", "Postcode"]
	let attributes = ['bin_num', 'bin_type', 'installation_date', 'bin_status', 'postcode']
	let table = document.createElement("table"); 
	table.className = 'container'
	div.appendChild(table)
	generateTableHead(table, headers);
	generateTableContent(table, attributes, '/getbins');
}