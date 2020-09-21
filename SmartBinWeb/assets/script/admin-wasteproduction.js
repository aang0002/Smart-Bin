function renderWasteProduction(elemId){
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// fill div with a bar chart
	renderWasteProductionChart(div);

	/* LOCAL FUNCTIONS */
	function renderWasteProductionChart(div){
		let chartDiv = document.createElement("div"); 
		chartDiv.id = 'chart'
		chartDiv.style = 'height:400px; margin-top:10px'
		div.appendChild(chartDiv)

		// create chart
		anychart.theme(anychart.themes.darkEarth);
		anychart.onDocumentReady(function() {
		    // the data 
		    var chartData = [ ];

		    var request = new XMLHttpRequest()
			var path = 'http://127.0.0.1:8000/getwasteproduction/'

			request.open('GET', path, true)
				request.onload = function () {
				// Begin accessing JSON data here
				var data = JSON.parse(this.response).data

				if (request.status >= 200 && request.status < 400) {
				  	for (var key in data) {
						if (data.hasOwnProperty(key)) {
						    chartData.push({x: key, value: data[key]})
						}
					}
					// create the chart
					var chart = anychart.pie(chartData);

					// set the chart title
					chart.title("Waste Production");

					// render the chart
					chart.container('chart');
					chart.palette(anychart.palettes.defaultPalette);
					chart.fill("aquastyle");
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