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
    
    request.open('GET', path, false)
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response).data

      if (request.status >= 200 && request.status < 400) {
        // reset total damage reports
        totalDamageReports = 0;
        // read the data
        data.forEach((object) => {
            // incerement total damage report by 1
            totalDamageReports += 1;
            // render a row in the table
            let row = table.insertRow();
            attributes.forEach((key) => {
                let cell = row.insertCell();
                let content = document.createTextNode(object.attributes[key])
                cell.appendChild(content);
            })
        })
      }
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

function renderDamageReportsTable(elemId){
    // change the UI of active tab
    document.getElementById(active_id).className = "";
    document.getElementById(elemId).className = "active";
    active_id = elemId

    // clear all content
    let div = document.getElementById('content');
    div.innerHTML = ''

    // create a filter
    let filter = document.createElement('div')
    // set top margin
    filter.setAttribute("style", "margin-top: 1%;");
    // set the filter
    filter.innerHTML = 
                `
                <div id="totalDamageReports">TOTAL: </div>
                <select name="cars" id="cars" onchange="changeReportFilter(this.value);">
                  <option value="all">All</option>
                  <option value="solved">Solved Reports</option>
                  <option value="notsolved">Unsolved Reports</option>
                </select>
                `
    div.appendChild(filter);

    // fill div with a table
    let headers = ["Id", "Report Date", "Reporter Username", "Bin Num", "Description", "Severity", "Is Solved?"]
    let attributes = ['dmg_id', 'reported_at', 'emp_username_id', 'bin_num_id', 'desc', 'severity', 'is_solved']
    let table = document.createElement("table"); 
    table.className = 'container'
    div.appendChild(table)
    generateTableHead(table, headers);
    generateTableContent(table, attributes, '/getdamagereports/all'); 
    
    // update the total damage reports
    document.getElementById('totalDamageReports').innerHTML = 'TOTAL: ' + totalDamageReports;
}

function changeReportFilter(selectedOption){
    // clear all content
    let div = document.getElementById('content');
    div.innerHTML = ''

    // create a filter
    let filter = document.createElement('div')
    // set top margin
    filter.setAttribute("style", "margin-top: 1%;");
    // set the filter
    filter.innerHTML = '<div id="totalDamageReports">TOTAL: </div>'
    if (selectedOption == 'solved'){
        filter.innerHTML += ` <select name="cars" id="cars" onchange="changeReportFilter(this.value);">
                                  <option value="all">All</option>
                                  <option value="solved" selected>Solved Reports</option>
                                  <option value="notsolved">Unsolved Reports</option>
                              </select>`
    }
    else if (selectedOption == 'notsolved'){
        filter.innerHTML += ` <select name="cars" id="cars" onchange="changeReportFilter(this.value);">
                                  <option value="all">All</option>
                                  <option value="solved">Solved Reports</option>
                                  <option value="notsolved" selected>Unsolved Reports</option>
                              </select>`
    }
    else if (selectedOption == 'all'){
        filter.innerHTML += ` <select name="cars" id="cars" onchange="changeReportFilter(this.value);">
                                  <option value="all" selected>All</option>
                                  <option value="solved">Solved Reports</option>
                                  <option value="notsolved">Unsolved Reports</option>
                              </select>`
    }
    
    div.appendChild(filter);

    // fill div with a table
    let headers = ["Id", "Report Date", "Reporter Username", "Bin Num", "Description", "Severity", "Is Solved?"]
    let attributes = ['dmg_id', 'reported_at', 'emp_username_id', 'bin_num_id', 'desc', 'severity', 'is_solved']
    let table = document.createElement("table"); 
    table.className = 'container'
    div.appendChild(table)
    generateTableHead(table, headers);
    generateTableContent(table, attributes, '/getdamagereports/' + selectedOption);

    // update the total damage reports
    document.getElementById('totalDamageReports').innerHTML = 'TOTAL: ' + totalDamageReports;
}