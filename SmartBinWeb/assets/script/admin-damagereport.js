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