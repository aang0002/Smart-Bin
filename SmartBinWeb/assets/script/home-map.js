function fillMapData(){
    // make sure that all of the local variables are set to origin values
    map = null;
    binMarkers = {};
    inProgressBinNum = null;
    clickedBinNum = null;
    bigMapLoaded = false;

    // API token
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWFuZzAwMDIiLCJhIjoiY2tldmdmamttMXk3ZzJ4bXJseGt4cDBybyJ9.FPvgW8PxjOUeEV33WTfABg';
    let binsToGet;

    /* Uncomment this to track user location */
    // if ("geolocation" in navigator) { 
    //     navigator.geolocation.getCurrentPosition(position => { 
    //         console.log(position.coords.latitude, position.coords.longitude); 
    //         myLatitude = position.coords.latitude;
    //         myLongitude = position.coords.longitude;
    //     }); 
    // } 
    // else { 
    //     console.log("Default position will be used")
    // }

    // map instance
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [myLongitude, myLatitude], // starting position
        zoom: 14
    });

    // Add map controler UI
    map.addControl(new mapboxgl.NavigationControl({position: 'top-left'}));

    // map onload definition
    map.on('load', function() {

        // Add starting point to the map
        map.loadImage(
             GLOBAL_PATH + '/static/images/human-icon.png',
            function (error, image) {
                if (error) throw error;
                map.addImage('currentPosition', image);
                map.addSource('currentPosition', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [myLongitude, myLatitude]
                            }
                            }
                        ]
                    }
                });
                map.addLayer({
                    'id': 'currentPosition',
                    'type': 'symbol',
                    'source': 'currentPosition',
                    'layout': {
                        'icon-image': 'currentPosition',
                        'icon-size': 0.06
                    }
                });
            }
        );

        map.on("styleimagemissing", e => {
            map.loadImage('images/' + e.id + ".png", (error, image) => {
                if (error) throw error;
                if (!map.hasImage(e.id)) map.addImage(e.id, image);
                map.getSource('markers').setData(url);
            });
        });

        // Add legends on the map
        let layers = ['0-24%', '25-49%', '50-74%', '75-100%'];
        let colors = ['#008000', '#FFFF00', '#FFA500', '#FF0000'];
            for (i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var color = colors[i];
            var item = document.createElement('div');
            var key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            var value = document.createElement('span');
            value.innerHTML = layer;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        }

        // Add BIN MARKERS
        addBinMarkers();

        // Add COLLECTION CENTER MARKERS
        addColCenMarkers();

        // update bin data in the map every a certain period of time
        if (!updateBinsLoop){
            updateBinsLoop = window.setInterval(function(){
                updateBins();
            }, 3500);
        }
    });

}


/* Adds COLLECTION CENTER MARKERS*/
function addColCenMarkers(){
    let request = new XMLHttpRequest()
    let binsToGet = 5;
    let path = '/getcolcens/'

    request.open('GET', path, false)
    request.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response).data

        // store the bins data to local storage
        window.localStorage.setItem('colcens', JSON.stringify(data));

        if (request.status >= 200 && request.status < 400) {
            data.forEach((colcen) => {
                // create a popup object inside the map
                let colcenPos = [parseFloat(colcen.attributes.colcen_longitude), parseFloat(colcen.attributes.colcen_latitude)]
                let colcen_text =  "<p>" +
                                  "Manager: " + colcen.attributes.manager_name + "<br>" +
                                  "Phone: " + colcen.attributes.colcen_phone +
                                  "</p>"
                let popup = new mapboxgl.Popup()
                            .setHTML(colcen_text)
                            .addTo(map);
                // render collection center icon on map
                let imgName = 'colcen' + colcen.attributes.colcen_id;
                let sourceName = 'colcen' + colcen.attributes.colcen_id;
                let layerId = 'colcen' + colcen.attributes.colcen_id;
                map.loadImage(
                     GLOBAL_PATH + '/static/images/colcen-icon2.png',
                    function (error, image) {
                        if (error) throw error;
                        map.addImage(imgName, image);
                        map.addSource(sourceName, {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                    {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': colcenPos
                                    }
                                    }
                                ]
                            }
                        });
                        map.addLayer({
                            'id': layerId,
                            'type': 'symbol',
                            'source': imgName,
                            'layout': {
                                'icon-image': imgName,
                                'icon-size': 0.2
                            }
                        });
                    }
                );
            })
        } else {
            console.log('error')
        }
    }
    request.send();
}


/* Adds BIN MARKERS to the map*/
function addBinMarkers(){
    let request = new XMLHttpRequest()
    binsToGet = 5;
    let path = '/getbins/'

    request.open('GET', path, true)
    request.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response).data

        // store the bins data to local storage
        window.localStorage.setItem('bins', JSON.stringify(data));

        // access each bin
        data.forEach((bin) => {
            // get bin attributes
            let binPos = [parseFloat(bin.attributes.bin_longitude), parseFloat(bin.attributes.bin_latitude)];
            let binFullness = parseInt(bin.attributes.bin_fullness);
            let binDistance = get_bin_distance(bin.attributes.bin_num);
            // find the nearest colcen's distance
            let distanceToColcen = Infinity;
            let nearestColcenId = null;
            let colcens = JSON.parse(localStorage.getItem('colcens'));
            colcens.forEach(colcen => {
                // get the longitude and latitude
                let colcenLng = parseFloat(colcen.attributes['colcen_longitude']);
                let colcenLat = parseFloat(colcen.attributes['colcen_latitude']);
                // compute the x and y distance
                let x_distance = Math.abs(Math.abs(binPos[0])-Math.abs(colcenLng)) * 111; // in km
                let y_distance = Math.abs(Math.abs(binPos[1])-Math.abs(colcenLat)) * 111; // in km
                // calculate the distance between two points
                let binToColcenDistance = Math.sqrt(Math.pow(x_distance,2) + Math.pow(y_distance,2)).toFixed(2);
                // update the nearest colcen if necessary
                if (binToColcenDistance < distanceToColcen){
                    distanceToColcen = binToColcenDistance;
                    nearestColcenId = colcen.attributes.colcen_id;
                }
            });
            // add these two new informations to the bin
            bin.attributes.nearest_colcen_id = nearestColcenId;
            bin.attributes.nearest_colcen_distance = distanceToColcen;
            // compute the colour of the bin
            let binColor;
            // green
            if (binFullness>=0 && binFullness<=24){ binColor = 'green';}
            // yellow
            else if (binFullness>=25 && binFullness<=49){ binColor = 'yellow';}
            // orange
            else if (binFullness>=50 && binFullness<=74){ binColor = 'orange';}
            // red
            else{ binColor = 'red';}
            let myPos = [myLongitude, myLatitude];
            let bin_text =  "<p>" +
                            "Bin Num: " + bin.attributes.bin_num + "<br>" +
                            "Fullness: " + bin.attributes.bin_fullness + "%" + "<br>" +
                            "Bin Distance: " + binDistance + " km" + "<br>" +
                            "Total Distance: " + (parseFloat(binDistance)+parseFloat(bin.attributes.nearest_colcen_distance)).toFixed(2) + " km" + "<br>" +
                             "</p>"
            if (bin.attributes.is_active){
                bin_text += `<p style="color:red;">Bin is being cleared by other employee.</p>`
            }
            else{
                bin_text +=     `<button class="btn btn-primary"
                                  onclick = "getDirection(${bin.attributes.bin_num});
                                             clickedBinNum=${bin.attributes.bin_num};">
                                  <span class="glyphicon glyphicon-circle-arrow-right"></span> GO
                                </button>`
            }
            let popup = new mapboxgl.Popup()
                      .setHTML(bin_text)
                      .addTo(map);
            let binMarker = new mapboxgl.Marker({color: binColor})
                            .setPopup(popup)
                            .setLngLat(binPos)
                            .addTo(map);
            // add event listener for bin marker
            binMarker.getElement().addEventListener('click', () => { 
                clickedBinNum = bin.attributes.bin_num; 
            }); 
            // add event listener for the popup
            popup.on('close', function(e) {
                clickedBinNum = null;
            });
            // add the new bin marker to the dict
            binMarkers[bin.attributes.bin_num] = binMarker;
        })
    }
    request.send()
}

/* Adds BIN MARKERS to the map*/
function updateBins(){
    console.log("fetching bins informations...");
    let request = new XMLHttpRequest()
    let binsToGet = 5;
    let path = '/getbins/'

    request.open('GET', path, true)
    request.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response).data

        // get bins data from local storage
        let localStorageBins = JSON.parse(window.localStorage.getItem('bins'));
        data.forEach((bin) => {
            // get bin attributes
            let binNum = bin.attributes.bin_num;
            let binPos = [parseFloat(bin.attributes.bin_longitude), parseFloat(bin.attributes.bin_latitude)];
            let binFullness = parseInt(bin.attributes.bin_fullness);
            let binDistance = get_bin_distance(binNum);
            // if the bin fullness changed or is_active changed
            if (binFullness != localStorageBins[binNum-1].attributes['bin_fullness'] || bin.attributes.is_active != localStorageBins[binNum-1].attributes['is_active']){    
                // find the nearest colcen's distance
                let distanceToColcen = Infinity;
                let nearestColcenId = null;
                let colcens = JSON.parse(localStorage.getItem('colcens'));
                colcens.forEach(colcen => {
                    // get the longitude and latitude
                    let colcenLng = parseFloat(colcen.attributes['colcen_longitude']);
                    let colcenLat = parseFloat(colcen.attributes['colcen_latitude']);
                    // compute the x and y distance
                    let x_distance = Math.abs(Math.abs(binPos[0])-Math.abs(colcenLng)) * 111; // in km
                    let y_distance = Math.abs(Math.abs(binPos[1])-Math.abs(colcenLat)) * 111; // in km
                    // calculate the distance between two points
                    let binToColcenDistance = Math.sqrt(Math.pow(x_distance,2) + Math.pow(y_distance,2)).toFixed(2);
                    // update the nearest colcen if necessary
                    if (binToColcenDistance < distanceToColcen){
                        distanceToColcen = binToColcenDistance;
                        nearestColcenId = colcen.attributes.colcen_id;
                    }
                });
                // add these two new informations to the bin
                bin.attributes.nearest_colcen_id = nearestColcenId;
                bin.attributes.nearest_colcen_distance = distanceToColcen;
                // green
                if (binFullness>=0 && binFullness<=24){ binColor = 'green';}
                // yellow
                else if (binFullness>=25 && binFullness<=49){ binColor = 'yellow';}
                // orange
                else if (binFullness>=50 && binFullness<=74){ binColor = 'orange';}
                // red
                else{ binColor = 'red';}
                let myPos = [myLongitude, myLatitude];
                let bin_text =  "<p>" +
                                "Bin Num: " + bin.attributes.bin_num + "<br>" +
                                "Fullness: " + bin.attributes.bin_fullness + "%" + "<br>" +
                                "Bin Distance: " + binDistance + " km" + "<br>" +
                                "Total Distance: " + (parseFloat(binDistance)+parseFloat(bin.attributes.nearest_colcen_distance)).toFixed(2) + " km" + "<br>" +
                                "</p>"
                if (bin.attributes.is_active){
                    bin_text += `<p style="color:red;">Bin is being cleared by other employee.</p>`
                }
                else{
                    bin_text +=     `<button class="btn btn-primary"
                                      onclick = "getDirection(${bin.attributes.bin_num});
                                                 clickedBinNum=${bin.attributes.bin_num};">
                                      <span class="glyphicon glyphicon-circle-arrow-right"></span> GO
                                    </button>`
                }
                // remove the old bin marker and popup
                let oldbinMarker = binMarkers[bin.attributes.bin_num];
                oldbinMarker.getPopup().remove();
                oldbinMarker.remove();
                // create a popup
                let popup = new mapboxgl.Popup()
                        .setHTML(bin_text)
                        .addTo(map);
                popup.on('close', function(e) {
                    clickedBinNum = null;
                });
                // create a bin marker, but dont add it yet to the map
                let binMarker = new mapboxgl.Marker({color: binColor})
                                          .setLngLat(binPos)
                                          .setPopup(popup);
                // put the bin marker to local storage
                binMarkers[binNum] = binMarker;
                // only add marker if the popup is not open and there is no route in progress
                if (inProgressBinNum == null){
                    binMarker.addTo(map);
                    if (binNum == clickedBinNum){
                        //binMarker.togglePopup();
                    }
                }
                // also add marker if the bin is the bin in progress
                else{
                    if (binNum == inProgressBinNum){
                        bin_text =  "<p>" +
                                    "Bin Num: " + binNum + "<br>" +
                                    "Fullness: " + binFullness + "%" + "<br>" +
                                    "Bin Distance: " + binDistance + " km" + "<br>" +
                                    "Total Distance: " + (parseFloat(binDistance)+parseFloat(bin.attributes.nearest_colcen_distance)).toFixed(2) + " km" + "<br>" +
                                    "</p>"
                        if (bigMapLoaded){
                            bin_text += `<div class="btn-group-vertical">
                                            <button class="btn btn-info" onclick = "finishJob(${binNum});">
                                              <span class="glyphicon glyphicon-ok"></span> finish
                                            </button>
                                            <button class="btn btn-warning" onclick = "reportBinDamage(${binNum});">
                                              <span class="glyphicon glyphicon-exclamation-sign"></span> report
                                            </button>
                                        </div>`
                        }
                        else{
                            bin_text += `<div class="btn-group-vertical">
                                            <button class="btn btn-info" onclick = "acceptJob(${binNum});">
                                              <span class="glyphicon glyphicon-ok"></span> accept
                                            </button>
                                            <button class="btn btn-warning" onclick = "reportBinDamage(${binNum});">
                                              <span class="glyphicon glyphicon-exclamation-sign"></span> report
                                            </button>
                                            <button class="btn btn-danger" onclick = "cancelJob(${binNum});">
                                                <span class="glyphicon glyphicon-remove"></span> cancel
                                            </button>
                                        </div>`
                        }
                        // remove the previously created popup, since it will no be used
                        popup.remove();
                        // create a new popup
                        popup = new mapboxgl.Popup()
                                .setHTML(bin_text)
                                .addTo(map)
                        popup.on('close', function(e) {
                            clickedBinNum = null;
                        });
                        // create a bin marker, but dont add it to the map yet
                        binMarker.setPopup(popup);
                        // update bin marker
                        binMarker.addTo(map);
                        // open popup after adding
                        binMarker.togglePopup();
                    }
                    else{
                        binMarker.togglePopup();
                    }
                }
            }
        })
        // store the bins data to local storage
        window.localStorage.setItem('bins', JSON.stringify(data));
    }
    request.send();
}

/*
Directs the user to the selected bin
*/
function getDirection(bin_num){
    // set the in progress bin num to this bin num
    inProgressBinNum = bin_num;

    // change the marker
    changeMarkerButton(bin_num);

    // get the lsit of bins from local storage
    let bins = JSON.parse(localStorage.getItem('bins'));

    // ge the particulr bin obj
    let bin = bins[bin_num-1]

    // ge the position of the bin
    let binPos = [parseFloat(bin.attributes.bin_longitude), parseFloat(bin.attributes.bin_latitude)];

    // render the route on the map
    renderBinCollectionRoute( [myLongitude,myLatitude], [binPos[0],binPos[1]] );

    // re-center to cuurent cleaner's postiion
    map.setCenter( [myLongitude,myLatitude] );

    // remove all bin markers except the selected bin
    for (let key in binMarkers) {
        // check if the property/key is defined in the object itself, not in parent
        if (binMarkers.hasOwnProperty(key)) {
            if (key != bin_num){
                // remove the marker
                binMarkers[key].remove();
            }
        }
    }
}

function changeMarkerButton (bin_num){
    // get bins from local storage
    let bins = JSON.parse(localStorage.getItem('bins'));
    // change the previously in progrssing marker to its normal marker
    if (inProgressBinNum != null){
        let previousBin = bins[inProgressBinNum-1];
        let previousBinMarker = binMarkers[inProgressBinNum];
        let binDistance = get_bin_distance(inProgressBinNum);
        // remove the previous popup
        previousBinMarker.getPopup().remove();
        // create a new popup
        let previousBinPos = [parseFloat(previousBin.attributes.bin_longitude), parseFloat(previousBin.attributes.bin_latitude)];
        let previous_bin_text =  "<p>" +
                        "Bin Num: " + previousBin.attributes.bin_num + "<br>" +
                        "Fullness: " + previousBin.attributes.bin_fullness + "%" + "<br>" +
                        "Bin Distance: " + binDistance + " km" + "<br>" +
                        "Total Distance: " + (parseFloat(binDistance)+parseFloat(previousBin.attributes.nearest_colcen_distance)).toFixed(2) + " km" + "<br>" +
                        "</p>" +
                        `<button class="btn btn-primary"
                          onclick = "getDirection(${previousBin.attributes.bin_num});
                                     clickedBinNum=${previousBin.attributes.bin_num};">
                          <span class="glyphicon glyphicon-circle-arrow-right"></span> GO
                        </button>`
        let previousMarkerPopup = new mapboxgl.Popup()
                          .setHTML(previous_bin_text)
                          .addTo(map);
        // add this new popup to the marker
        previousBinMarker.setPopup(previousMarkerPopup);
        // dont open popup after adding
        previousBinMarker.togglePopup();
    }

    // update bin_text
    let bin = bins[bin_num-1];
    let bin_fullness = bin.attributes['bin_fullness'];
    let bin_type = bin.attributes['bin_type'];
    let binDistance = get_bin_distance(bin_num);
    // create a popup text
    let bin_text =  "<p>" +
                    "Bin Num: " + bin_num + "<br>" +
                    "Fullness: " + bin_fullness + "%" + "<br>" +
                    "Bin Distance: " + binDistance + " km" + "<br>" +
                    "Total Distance: " + (parseFloat(binDistance)+parseFloat(bin.attributes.nearest_colcen_distance)).toFixed(2) + " km" + "<br>" +
                    "</p>" 
    bin_text += `<div class="btn-group-vertical">
                    <button class="btn btn-info" onclick = "acceptJob(${bin_num});">
                      <span class="glyphicon glyphicon-ok"></span> accept
                    </button>
                    <button class="btn btn-warning" onclick = "reportBinDamage(${bin_num});">
                      <span class="glyphicon glyphicon-exclamation-sign"></span> report
                    </button>
                    <button class="btn btn-danger" onclick = "cancelJob(${bin_num});">
                        <span class="glyphicon glyphicon-remove"></span> cancel
                    </button>
                </div>
                `
    // create a new popup on the map
    let popup = new mapboxgl.Popup()
                          .setHTML(bin_text)
                          .addTo(map);
    // get the previous bin marker
    let bin_marker = binMarkers[bin_num];
    // remove the current popup
    bin_marker.getPopup().remove();
    // set the newly created popup to this marker
    bin_marker.setPopup(popup);
    // change the current marker to be in progress
    inProgressBinNum = bin_num;
}

/*
Cancel the currently in progress job
*/
function cancelJob(bin_num){
    // get bins from local storage
    let bins = JSON.parse(localStorage.getItem('bins'));

    // get the particular bin object
    let bin = bins[bin_num-1];

    // get the bin marker
    let binMarker = binMarkers[bin_num];

    // remove the marker popup
    binMarker.getPopup().remove();

    // get the bin attributes
    let binPos = [parseFloat(bin.attributes.bin_longitude), parseFloat(bin.attributes.bin_latitude)];

    // create a popup text
    let binDistance = get_bin_distance(bin_num);
    let bin_text =  "<p>" +
                    "Bin Num: " + bin.attributes.bin_num + "<br>" +
                    "Fullness: " + bin.attributes.bin_fullness + "%" + "<br>" +
                    "Bin Distance: " + binDistance + " km" + "<br>" +
                    "Total Distance: " + (parseFloat(binDistance)+parseFloat(bin.attributes.nearest_colcen_distance)).toFixed(2) + " km" + "<br>" +
                    "</p>" +
                    `<button class="btn btn-primary"
                      onclick = "getDirection(${bin.attributes.bin_num});
                                 clickedBinNum=${bin.attributes.bin_num};">
                      <span class="glyphicon glyphicon-circle-arrow-right"></span> GO
                    </button>`

     // create a new popup on the map
    let popup = new mapboxgl.Popup()
                  .setHTML(bin_text)
                  .addTo(map);

    // set the new popup
    binMarker.setPopup(popup);
    // dont open popup after adding
    binMarker.togglePopup(); 

    // display markers
    for (let key in binMarkers) {
        // check if the property/key is defined in the object itself, not in parent
        if (binMarkers.hasOwnProperty(key)) {
            if (key != bin_num){
                // remove the marker
                binMarkers[key].addTo(map);
            }
        }
    }

    // remove the route on the map
    map.removeLayer('route0');
    map.removeSource('route0');
    map.removeLayer('route1');
    map.removeSource('route1');

    // set the in progress bin num to null again
    inProgressBinNum = null;
}

/*
Report a damaged bin
*/
function reportBinDamage(bin_num){
    let emp_username = JSON.parse(localStorage.getItem('user')).emp_username;
    // save the report details to local storage
    let damageReportDetails = {
        emp_username: emp_username,
        bin_num: bin_num,
    }
    localStorage.setItem('damageReportDetails', JSON.stringify(damageReportDetails));

    // direct user to the report damage HTML page
    window.open('/damagereportform/');
}


/*
This function will be run whenever the employee accepts the job
*/
function acceptJob(bin_num){
    alertify.confirm(
            '',                                 // title
            'Clear bin number ' + bin_num + ' ?',  // message
            onokJob,        // onok function
            function () {}  // oncancle function (do nothing)
            );

    function onokJob(){
        // change all the bin markers popup
        inProgressBinNum = bin_num;

        // disable side navigation buttons
        $('.home').addClass('disabled');
        $('.profile').addClass('disabled');

        // get the current datetime
        let today = new Date();
        let DD = String(today.getDate()).padStart(2, '0');
        let MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let YYYY = today.getFullYear();
        let hh = String(today.getHours()).padStart(2, '0');
        let mm = String(today.getMinutes()).padStart(2, '0');
        let ss = String(today.getSeconds()).padStart(2, '0');
        let datetimeString = YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss //e.g. 2007-01-01 10:00:00

        // gather all the required params
        let emp_username = JSON.parse(localStorage.getItem('user'))['emp_username'];
        let colcen_id = localStorage.getItem('inProgress_colcen_id');
        let datetime_created = datetimeString;

        // create an assignment (this will also lock the bin)
        var request = new XMLHttpRequest();
        var url = `../createassignment/${emp_username}/${bin_num}/${colcen_id}/${datetime_created}`;
        request.open('GET', url, false);
        request.onload = function () { 
            if (request.status >= 200 && request.status < 400) {
                let asgn_id = JSON.parse(this.response).data;
                localStorage.setItem('inProgress_asgn_id', asgn_id);
                alertify.success("You are assigned to bin " + bin_num);
                // render a bigger map to user
                renderBigMap(bin_num);
            }
            else{
                alertify.error("Something went wrong")
            }
        }
        request.send();
        

        // show time elapsed on screen
        // lock the bin (send a lock request to the DB)

    }
}

 /* This function is created to only fill the data for the big map*/
function renderBigMap(bin_num){
    // scroll to top
    window.scrollTo(0,0);

    // clear all content
    let div = document.getElementById('content');
    div.innerHTML = ''

    // <div class="map fullMap", id="map">
    let map = document.createElement("div");
    map.className = "map fullMap";
    map.id = "map";
    div.appendChild(map);

    // <div class='map-overlay bigLegend' id='legendBig'></div>
    let legend = document.createElement('div');
    legend.className = 'map-overlay';
    legend.id = 'legendBig';
    div.appendChild(legend);

    // fill the map data
    fillBigMapData(bin_num);
}


/* Fill the map with the relevant data*/
function fillBigMapData(bin_num){
    // make sure that all of the local variables are set to origin values
    map = null;
    inProgressBinNum = bin_num;
    clickedBinNum = bin_num;
    bigMapLoaded = true;

    // API token
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWFuZzAwMDIiLCJhIjoiY2tldmdmamttMXk3ZzJ4bXJseGt4cDBybyJ9.FPvgW8PxjOUeEV33WTfABg';

    // mapbox instance
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [myLongitude, myLatitude], // starting position
        zoom: 14
    });

    // Add map controler UI
    map.addControl(new mapboxgl.NavigationControl({position: 'top-left'}));

    // onload function
    map.on('load', function() {

        // Add starting point to the map
        map.loadImage(
             GLOBAL_PATH + '/static/images/human-icon.png',
            function (error, image) {
                if (error) throw error;
                map.addImage('currentPosition', image);
                map.addSource('currentPosition', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [myLongitude, myLatitude]
                            }
                            }
                        ]
                    }
                });
                map.addLayer({
                    'id': 'currentPosition',
                    'type': 'symbol',
                    'source': 'currentPosition',
                    'layout': {
                        'icon-image': 'currentPosition',
                        'icon-size': 0.06
                    }
                });
            }
        );

        map.on("styleimagemissing", e => {
            map.loadImage('images/' + e.id + ".png", (error, image) => {
                if (error) throw error;
                if (!map.hasImage(e.id)) map.addImage(e.id, image);
                map.getSource('markers').setData(url);
            });
        });

        // Add legends on the map
        let layers = ['0-24%', '25-49%', '50-74%', '75-100%'];
        let colors = ['#008000', '#FFFF00', '#FFA500', '#FF0000'];
            for (i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var color = colors[i];
            var item = document.createElement('div');
            var key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            var value = document.createElement('span');
            value.innerHTML = layer;
            item.appendChild(key);
            item.appendChild(value);
            legendBig.appendChild(item);
        }

        // Add the bin marker
        let bin = JSON.parse(localStorage.getItem('bins'))[bin_num-1]    // this stotes the information of the bin
        let binPos = [parseFloat(bin.attributes.bin_longitude), parseFloat(bin.attributes.bin_latitude)]
        let binFullness = parseInt(bin.attributes.bin_fullness)
        let binDistance = get_bin_distance(bin_num);
        let binColor;
        // green
        if (binFullness>=0 && binFullness<=24){ binColor = 'green';}
        // yellow
        else if (binFullness>=25 && binFullness<=49){ binColor = 'yellow';}
        // orange
        else if (binFullness>=50 && binFullness<=74){ binColor = 'orange';}
        // red
        else{ binColor = 'red';}
        let myPos = [myLongitude, myLatitude];
        let bin_text =  "<p>" +
                        "Bin Num: " + bin_num + "<br>" +
                        "Fullness: " + binFullness + "%" + "<br>" +
                        "Bin Distance: " + binDistance + " km" + "<br>" +
                        "Total Distance: " + (parseFloat(binDistance)+parseFloat(bin.attributes.nearest_colcen_distance)).toFixed(2) + " km" + "<br>" +
                        "</p>" 
        bin_text += `<div class="btn-group-vertical">
                        <button class="btn btn-info" onclick = "finishJob(${bin_num});">
                          <span class="glyphicon glyphicon-ok"></span> finish
                        </button>
                        <button class="btn btn-warning" onclick = "reportBinDamage(${bin_num});">
                          <span class="glyphicon glyphicon-exclamation-sign"></span> report
                        </button>
                    </div>`
        let popup = new mapboxgl.Popup()
                  .setHTML(bin_text)
                  .addTo(map);
        let binMarker = new mapboxgl.Marker({color: binColor})
                        .setPopup(popup)
                        .setLngLat(binPos)
                        .addTo(map);
        // add event listener for bin marker
        binMarker.getElement().addEventListener('click', () => { 
            clickedBinNum = bin.attributes.bin_num; 
        }); 
        // add event listener for the popup
        popup.on('close', function(e) {
            clickedBinNum = null;
        });
        // add the new bin marker to the dict
        binMarkers[bin.attributes.bin_num] = binMarker;
        // toggle the popup
        binMarker.togglePopup();

        // Add COLLECTION CENTER MARKERS
        addColCenMarkers();

        // render the route
        renderBinCollectionRoute( [myLongitude,myLatitude], [binPos[0],binPos[1]] );
    });
}

function finishJob(bin_num){
    alertify.confirm(
            '',                                                               // title
            `Are you sure you finished clearning bin num ${bin_num} ?
             A check will progress if you click OK.`,  // message
            onokcompleteJob,        // onok function
            function () {}  // oncancle function (do nothing)
            );
}

function onokcompleteJob(){
    // get the bin instance from lcoal storage
    let bin = JSON.parse(localStorage.getItem('bins'))[inProgressBinNum-1];
    // convert datetime now to SQLite acceptable string
    let today = new Date();
    let DD = String(today.getDate()).padStart(2, '0');
    let MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let YYYY = today.getFullYear();
    let hh = String(today.getHours()).padStart(2, '0');
    let mm = String(today.getMinutes()).padStart(2, '0');
    let ss = String(today.getSeconds()).padStart(2, '0');
    let datetimeString = YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss //e.g. 2007-01-01 10:00:00
    // unlock the bin, by changing the is_active attribute to false (make sure this is a synchrnous call)
    let request = new XMLHttpRequest();
    let asgn_id = localStorage.getItem('inProgress_asgn_id');
    let waste_volume = Math.round(bin.attributes.bin_fullness * (bin.attributes.bin_fullness / 100));
    let datetime_finished = datetimeString;
    let path = `/finishassignment/${asgn_id}/${waste_volume}/${datetime_finished}`;
    request.open('GET', path, false);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // increments the bins collected attribute
            let user = JSON.parse(localStorage.getItem('user'));
            user['bins_collected'] = user['bins_collected'] + 1
            localStorage.setItem('user', JSON.stringify(user));
            // send success message to user
            alertify.success('You completed a job with id ' + asgn_id);
            // set back the bigMapLoaded property to false
            bigMapLoaded = false;
            // go to the main page
            renderHomeMain('home');
        }
        else{
            alertify.error('Something went wrong');
        }
    }
    request.send();
}

function get_bin_distance(bin_num){

    // get the bin informations
    let bin = JSON.parse(localStorage.getItem('bins'))[bin_num-1];
    let binLng = parseFloat(bin.attributes.bin_longitude);
    let binLat = parseFloat(bin.attributes.bin_latitude);
    let cleanerLng = myLongitude;
    let cleanerLat = myLatitude;

    // compute the x and y distance
    let x_distance = Math.abs(Math.abs(binLng)-Math.abs(cleanerLng)) * 111; // in km
    let y_distance = Math.abs(Math.abs(binLat)-Math.abs(cleanerLat)) * 111; // in km

    // return the distance between two points
    return Math.sqrt(Math.pow(x_distance,2) + Math.pow(y_distance,2)).toFixed(2);
}

function get_total_route_distance(bin_num){

    // get the bin informations
    let bin = JSON.parse(localStorage.getItem('bins'))[bin_num-1];
    let binLng = parseFloat(bin.attributes.bin_longitude);
    let binLat = parseFloat(bin.attributes.bin_latitude);

    // find the nearest colcen's distance
    let distanceToColcen = Infinity;
    let colcens = JSON.parse(localStorage.getItem('colcens'));
    colcens.forEach(colcen => {
        // get the longitude and latitude
        let colcenLng = parseFloat(colcen.attributes['colcen_longitude']);
        let colcenLat = parseFloat(colcen.attributes['colcen_latitude']);
        // compute the x and y distance
        let x_distance = Math.abs(Math.abs(binLng)-Math.abs(colcenLng)) * 111; // in km
        let y_distance = Math.abs(Math.abs(binLat)-Math.abs(colcenLat)) * 111; // in km
        // calculate the distance between two points
        let binToColcenDistance = Math.sqrt(Math.pow(x_distance,2) + Math.pow(y_distance,2)).toFixed(2);
        // update the nearest colcen if necessary
        if (binToColcenDistance < distanceToColcen){
            distanceToColcen = binToColcenDistance;
        }
    });
    // at this point, the distanceToColcen var stores the nearest colcen distance from the selected bin

}