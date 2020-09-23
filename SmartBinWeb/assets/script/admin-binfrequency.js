function renderBinFrequencyWithFilter(btnId){
	// disactivate the current button
	document.getElementById(active_filter_id).className = document.getElementById(active_filter_id).className.replace(' active', '');

	// activate the selected button
	document.getElementById(btnId).className += " active";
}

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
		var path = 'http://127.0.0.1:8000/getbinfrequency/'

		request.open('GET', path, true);
		request.onload = function () {

			if (request.status >= 200 && request.status < 400) {
				// delete loader from UI
				div.innerHTML = ''
				// start reading data
				var data = JSON.parse(this.response).data;
				var chartData = [];
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
					  	var dataSet = anychart.data.set(chartData);
					  	var view = dataSet.mapAs();
					  	var sortedView = view.sort("value", "desc");
					  	
						var chart = anychart.bar();
						var series = chart.bar(sortedView);

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