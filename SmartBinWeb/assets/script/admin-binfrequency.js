function renderBinFrequency(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// render the bin frequency content
	$.get("/binfrequency", function(data) {
		$(data).appendTo(div)
		renderBinFrequencyChart(div);
	});

	/* LOCAL FUNCTIONS */
	function renderBinFrequencyChart(div){
		// create chart
		anychart.theme(anychart.themes.darkEarth);
		anychart.onDocumentReady(function() {
		    var request = new XMLHttpRequest()
			var path = 'http://127.0.0.1:8000/getbinfrequency/'

			request.open('GET', path, true);
			request.onload = function () {

				if (request.status >= 200 && request.status < 400) {
					var data = JSON.parse(this.response).data;
					var chartData = [];
					for (var bin_num in data) {
						if (data.hasOwnProperty(bin_num)) { 
						    chartData.push([ bin_num, data[bin_num] ])
						}
					}
				  	// create a data object
				  	var dataSet = anychart.data.set(chartData);
				  	var view = dataSet.mapAs();
				  	var sortedView = view.sort("value", "desc");

					// create the chart
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
				} 
				else {
					console.log('error')
				}
			}
			request.send()
		});
	}
}