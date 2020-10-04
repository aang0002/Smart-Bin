function changeEmpPerformanceChartFilter(btnId){
	// disactivate the currently active button
	$('#'+active_filter_id).removeClass('active');
	active_filter_id = btnId;

	// activate the selected button
	$('#'+btnId).addClass('active');

	// display a loader
	document.getElementById("employeeperformanceChart").innerHTML = '';
	document.getElementById("employeeperformanceChart").innerHTML = `<div class="loader" style="margin: auto; margin-top:200px"></div>`;

	// construct API path
	var path = '/getemployeeperformance'
	switch(btnId) {
		case "btn-day-1":
			path += "/days/1"
			break;
		case "btn-day-7":
			path += "/days/7"
			break;
		case "btn-mon-1":
			path += "/months/1"
			break;
		case "btn-mon-6":
			path += "/months/6"
			break;
		default:
			path = "/getemployeeperformance/alltime/alltime"
	}

	// make a request
	var request = new XMLHttpRequest();
	request.open('GET', path, true);
	request.onload = function () {

		if (request.status >= 200 && request.status < 400) {
			// remove the loader
			document.getElementById("employeeperformanceChart").innerHTML = '';
			// Begin accessing JSON data here
			let chartData = [];
			let data = JSON.parse(this.response).data;
		  	for (let emp_username in data) {
				if (data.hasOwnProperty(emp_username)) { 
				    chartData.push([ emp_username, data[emp_username] ])
				};
			};
			// create a data object
		  	let dataSet = anychart.data.set(chartData);
		  	let view = dataSet.mapAs();
		  	let sortedView = view.sort("value", "desc");
			// create chart
			anychart.theme(anychart.themes.darkEarth);
			anychart.onDocumentReady(function() {
			   	let chart = anychart.bar();
				let series = chart.bar(sortedView);

				// render the chart
				chart.title("Employee Performance");
		        chart.yAxis().title('# Bin Collected');
		        chart.xScroller().enabled(true);	// turn on Y-scroller
		        chart.palette(anychart.palettes.defaultPalette);
		        chart.container('employeeperformanceChart');
				chart.draw(); 
			});		
		}
		else{
			console.log("error");
		}
	}
	request.send();
};

function renderEmployeePerformance(elemId) {
	var today = new Date();
	var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
	console.log(date); 
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// render spinner while loading for data to be ready
	div.innerHTML = `<div class="loader" style="margin: auto; margin-top:200px"></div>`

	// Getting elements from server and saving the in the variable data
	renderEmployeePerformanceChart(div);


	/* LOCAL FUNCTIONS */
	function renderEmployeePerformanceChart(div){
		var request = new XMLHttpRequest()
		var path = '/getemployeeperformance/alltime/alltime'

		request.open('GET', path, true)
		request.onload = function () {

			if (request.status >= 200 && request.status < 400) {
				// delete loader from UI
				div.innerHTML = '';
				// Begin accessing JSON data here
				let chartData = [];
				let data = JSON.parse(this.response).data;
			  	for (let emp_username in data) {
					if (data.hasOwnProperty(emp_username)) { 
					    chartData.push([ emp_username, data[emp_username] ])
					}
				}
			  	// create a data object
			  	let dataSet = anychart.data.set(chartData);
			  	let view = dataSet.mapAs();
			  	let sortedView = view.sort("value", "desc");

				// create the chart
				$.get("/employeeperformance", function(data) {
					$(data).appendTo(div)
					// create chart
					anychart.theme(anychart.themes.darkEarth);
					anychart.onDocumentReady(function() {
					   	let chart = anychart.bar();
						let series = chart.bar(sortedView);

						// render the chart
						chart.title("Employee Performance");
				        chart.yAxis().title('# Bin Collected');
				        chart.xScroller().enabled(true);	// turn on Y-scroller
				        chart.palette(anychart.palettes.defaultPalette);
				        chart.container('employeeperformanceChart');
						chart.draw(); 
					});
				});
			} 
			else {
				console.log('error')
			}
		}
		request.send();
	}
}