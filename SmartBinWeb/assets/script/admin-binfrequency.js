function changBinFreqChartFilter(btnId){
	// disactivate the currently active button
	$('#'+active_filter_id).removeClass('active');
	active_filter_id = btnId;

	// activate the selected button
	$('#'+btnId).addClass('active');

	// display a loader
	document.getElementById("binfrequencyChart").innerHTML = '';
	document.getElementById("binfrequencyChart").innerHTML = `<div class="loader" style="margin: auto; margin-top:200px"></div>`;

	// construct API path
	var path = '/getbinfrequencyfiltered'
	switch(btnId) {
		case "btn-day-1":
			path += "/days/1/"
			break;
		case "btn-day-7":
			path += "/days/7/"
			break;
		case "btn-mon-1":
			path += "/months/1/"
			break;
		case "btn-mon-6":
			path += "/months/6/"
			break;
		default:
			path = "/getbinfrequency"
	}

	// make a request
	var request = new XMLHttpRequest();
	request.open('GET', path, true);
	request.onload = function () {
		// remove the loader
		document.getElementById("binfrequencyChart").innerHTML = '';
		// start reading data
		if (request.status >= 200 && request.status < 400) {
			let data = JSON.parse(this.response).data;
			let chartData = [];
			for (let bin_num in data) {
				if (data.hasOwnProperty(bin_num)) { 
				    chartData.push([ bin_num, data[bin_num] ])
				}
			}
			console.log(chartData)
			anychart.theme(anychart.themes.darkEarth);
			anychart.onDocumentReady(function() {
				// create a data object
			  	let dataSet = anychart.data.set(chartData);
			  	let view = dataSet.mapAs();
			  	let sortedView = view.sort("value", "desc");
			  	
				let chart = anychart.bar();
				let series = chart.bar(sortedView);

				// render the chart
				chart.title("Bin Frequency");
				chart.xAxis().title('Bin Num');
		        chart.yAxis().title('# of times collected');
		        chart.palette(anychart.palettes.defaultPalette);
		        chart.xScroller().enabled(true);	// turn on Y-scroller
		        chart.container('binfrequencyChart');
				chart.draw();
			});
		}
		else{
			console.log("error");
		}
	}
	request.send();
};


function renderBinFrequency(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// render spinner while loading for data to be ready
	div.innerHTML = `<div class="loader" style="margin: auto; margin-top:200px"></div>`

	// render the bin frequency content
	renderBinFrequencyChart(div);

	/* LOCAL FUNCTIONS */
	function renderBinFrequencyChart(div){
		var request = new XMLHttpRequest()
		var path = '/getbinfrequency/'

		request.open('GET', path, true);
		request.onload = function () {

			if (request.status >= 200 && request.status < 400) {
				// delete loader from UI
				div.innerHTML = ''
				// start reading data
				let data = JSON.parse(this.response).data;
				let chartData = [];
				for (var bin_num in data) {
					if (data.hasOwnProperty(bin_num)) { 
					    chartData.push([ bin_num, data[bin_num] ])
					}
				}
				// create chart
				$.get("/binfrequency", function(data) {
					$(data).appendTo(div)
					anychart.theme(anychart.themes.darkEarth);
					anychart.onDocumentReady(function() {
						// create a data object
					  	let dataSet = anychart.data.set(chartData);
					  	let view = dataSet.mapAs();
					  	let sortedView = view.sort("value", "desc");
					  	
						let chart = anychart.bar();
						let series = chart.bar(sortedView);

						// render the chart
						chart.title("Bin Frequency");
						chart.xAxis().title('Bin Num');
				        chart.yAxis().title('# of times collected');
				        chart.palette(anychart.palettes.defaultPalette);
				        chart.xScroller().enabled(true);	// turn on Y-scroller
				        chart.container('binfrequencyChart');
						chart.draw(); 
					});
				});
			} 
			else {
				console.log('error')
			}
		}
		request.send();

	};
};