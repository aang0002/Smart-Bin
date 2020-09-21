function renderEmployeePerformance(elemId) {
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// Getting elements from server and saving the in the variable data
	$.get("/employeeperformance", function(data) {
		$(data).appendTo(div)
		renderEmployeePerformanceChart(div);
	});


	/* LOCAL FUNCTIONS */
	function renderEmployeePerformanceChart(div){
		// create chart
		anychart.theme(anychart.themes.darkEarth);
		anychart.onDocumentReady(function() {
		    var request = new XMLHttpRequest()
			var path = 'http://127.0.0.1:8000/getemployees/'

			request.open('GET', path, true)
			request.onload = function () {

				if (request.status >= 200 && request.status < 400) {
					// Begin accessing JSON data here
					var chartData = [];
					var data = JSON.parse(this.response).data;
				  	data.forEach((emp) => {
				  		let emp_name = emp.attributes['emp_name'];
				  		let bins_collected = emp.attributes['bins_collected'];
				  		chartData.push([emp_name, bins_collected])
				  	})
				  	// create a data object
				  	var dataSet = anychart.data.set(chartData);
				  	var view = dataSet.mapAs();
				  	var sortedView = view.sort("value", "desc");

					// create the chart
					var chart = anychart.bar();
					var series = chart.bar(sortedView);

					// render the chart
					chart.title("Employee Performance");
			        chart.yAxis().title('# Bin Collected');
			        chart.xScroller().enabled(true);	// turn on Y-scroller
			        chart.palette(anychart.palettes.defaultPalette);
			        chart.container('employeeperformanceChart');
					chart.draw();
				} 
				else {
					console.log('error')
				}
			}
			request.send()
		});
	}
}

function sortEmployeePerformanceChart(e){
	if (e.target.value === "asc") {
		alert("implement an asc ordering mechanism")
	}
	else if (e.target.value === "desc") {
		alert("implement a desc ordering mechanism")
	}
}