function renderEmployeePerformance(elemId) {
	// change the UI of active tab
	document.getElementById(active_id).className = "";
	document.getElementById(elemId).className = "active";
	active_id = elemId

	// clear all content
	let div = document.getElementById('content');
	div.innerHTML = ''

	// fill div with a table
	let chartDiv = document.createElement("div"); 
	chartDiv.id = 'chart'
	chartDiv.style = 'height:300px; margin-top:10px'
	div.appendChild(chartDiv)

	// create chart
	anychart.theme(anychart.themes.darkEarth);
	anychart.onDocumentReady(function() {
	    // the data 
	    var data = {
	      header: ["Name", "Death toll"],
	      rows: [
	        ["San-Francisco (1906)", 1500],
	        ["Messina (1908)", 87000],
	        ["Ashgabat (1948)", 175000],
	        ["Chile (1960)", 10000],
	        ["Tian Shan (1976)", 242000],
	        ["Armenia (1988)", 25000],
	        ["Iran (1990)", 50000]
	    ]};
	    // create the chart
		var chart = anychart.column();
		 
		// add the data
		chart.data(data);

		// set the chart title
		chart.title("Employee Performance");

		// render the chart
		chart.container('chart');
		chart.draw();
	});
}