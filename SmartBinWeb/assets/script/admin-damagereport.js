function renderDamageReportsTable(elemId){
    // scroll to top
    window.scrollTo(0,0);
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
                <select onchange="changeReportFilter(this.value);">
                  <option value="all">All</option>
                  <option value="solved">Solved Reports</option>
                  <option value="notsolved">Unsolved Reports</option>
                </select>
                `
    div.appendChild(filter);

    // fill div with a table
    let headers = ["Id", "Report Date", "Reporter", "Bin Num", "Damage Type", "Is Solved?", "Solved Date"]
    let attributes = ['dmg_id', 'reported_at', 'emp_username_id', 'bin_num_id', 'dmg_type', 'is_solved', 'datetime_solved']
    let table = document.createElement("table"); 
    table.className = 'container'
    div.appendChild(table)
    generateTableHead(table, headers);
    generateTableContentDmgReport(table, attributes, '/getdamagereports/all');
    
    // update the total damage reports
    document.getElementById('totalDamageReports').innerHTML = 'TOTAL: ' + totalDamageReports;
}

function changeReportFilter(selectedOption){
    // scroll to top
    window.scrollTo(0,0);
    
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
        filter.innerHTML += ` <select onchange="changeReportFilter(this.value);">
                                  <option value="all">All</option>
                                  <option value="solved" selected>Solved Reports</option>
                                  <option value="notsolved">Unsolved Reports</option>
                              </select>`
    }
    else if (selectedOption == 'notsolved'){
        filter.innerHTML += ` <select onchange="changeReportFilter(this.value);">
                                  <option value="all">All</option>
                                  <option value="solved">Solved Reports</option>
                                  <option value="notsolved" selected>Unsolved Reports</option>
                              </select>`
    }
    else if (selectedOption == 'all'){
        filter.innerHTML += ` <select onchange="changeReportFilter(this.value);">
                                  <option value="all" selected>All</option>
                                  <option value="solved">Solved Reports</option>
                                  <option value="notsolved">Unsolved Reports</option>
                              </select>`
    }
    
    div.appendChild(filter);

    // fill div with a table
    let headers = ["Id", "Report Date", "Reporter", "Bin Num", "Damage Type", "Is Solved?", "Solved Date"]
    let attributes = ['dmg_id', 'reported_at', 'emp_username_id', 'bin_num_id', 'dmg_type', 'is_solved', 'datetime_solved']
    let table = document.createElement("table"); 
    table.className = 'container';
    table.style.padding = "5px";
    div.appendChild(table)
    generateTableHead(table, headers);
    generateTableContentDmgReport(table, attributes, '/getdamagereports/' + selectedOption);

    // update the total damage reports
    document.getElementById('totalDamageReports').innerHTML = 'TOTAL: ' + totalDamageReports;
}

/*
This function is to generate a damage report datas into the table
*/
function generateTableContentDmgReport(table, attributes, dataURI) {
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
            // render button
            let cell = row.insertCell();
            if (object.attributes['is_solved'] == false){
                let solveButton = document.createElement('BUTTON');
                solveButton.innerHTML = "Solve"
                solveButton.className = "btn btn-primary"
                solveButton.onclick = function() {
                    solveReport(object.attributes['dmg_id'], solveButton);
                }
                cell.appendChild(solveButton);
            }
        })
      }
      else {
        console.log('error');
      }
    }

    request.send();
}

function solveReport(dmg_id, button){
    alertify.confirm('',                           // title
                    `Solve report id with ${dmg_id} ?`,      // message
                    function () { proceedSolveReport(); },        // onok function
                    function () {}  // oncancle function (do nothing)
                    );

    function proceedSolveReport () {
        // get the current datetime
        let today = new Date();
        let DD = String(today.getDate()).padStart(2, '0');
        let MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let YYYY = today.getFullYear();
        let hh = String(today.getHours()).padStart(2, '0');
        let mm = String(today.getMinutes()).padStart(2, '0');
        let ss = String(today.getSeconds()).padStart(2, '0');
        let datetimeString = YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss //e.g. 2007-01-01 10:00:00

        let request = new XMLHttpRequest();
        let path = '../solvedamagereport/' + dmg_id + '/' + datetimeString

        request.open("GET", path, false);
        request.onload = function() {

            if (request.status >= 200 && request.status < 400) {
                alertify.success(`Sucessfully solved report with id ${dmg_id}`);
                renderDamageReportsTable('damagereport');
            }
            else{
                alertify.error("Error");
            }
        }
        request.send();
    }
}