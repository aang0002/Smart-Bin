function fillMapData(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWFuZzAwMDIiLCJhIjoiY2tldmdmamttMXk3ZzJ4bXJseGt4cDBybyJ9.FPvgW8PxjOUeEV33WTfABg';
    let binsToGet;
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
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [myLongitude, myLatitude], // starting position
        zoom: 14
    });

    // initialize the map canvas to interact with later
    let canvas = map.getCanvasContainer();

    map.on('load', function() {
        // Add starting point to the map
        map.addSource('points', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [
              {
                // feature for Mapbox DC
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [myLongitude, myLatitude]
                },
                'properties': {
                  'title': 'Mapbox DC'
                }
              },
              ]
            }
        });

        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
              'icon-image': 'circle-15',
            }
        });

        map.on("styleimagemissing", e => {
            console.log("loading missing image: " + e.id);
            map.loadImage('images/' + e.id + ".png", (error, image) => {
                if (error) throw error;
                if (!map.hasImage(e.id)) map.addImage(e.id, image);
                map.getSource('markers').setData(url);
            });
        });

        // Add BIN MARKERS
        addBinMarkers();

        // Add COLLECTION CENTER MARKERS
        addColCenMarkers();

        // update bin data in the map every a certain period of time
        updateBinsLoop = window.setInterval(function(){
            updateBins();
        }, 3500);
    });

}


/* Adds COLLECTION CENTER MARKERS*/
function addColCenMarkers(){
    let request = new XMLHttpRequest()
    let binsToGet = 5;
    let path = '/getcolcens/'

    request.open('GET', path, true)
    request.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response).data

        // store the bins data to local storage
        window.localStorage.setItem('colcens', JSON.stringify(data));

        if (request.status >= 200 && request.status < 400) {
            data.forEach((colcen) => {
              // draw the bin on the map
              let colcenPos = [parseFloat(colcen.attributes.colcen_longitude), parseFloat(colcen.attributes.colcen_latitude)]
              let colcen_text =  "<p>" +
                              "Manager: " + colcen.attributes.manager_name + "<br>" +
                              "Phone: " + colcen.attributes.colcen_phone +
                              "</p>"
              let popup = new mapboxgl.Popup()
                        .setHTML(colcen_text)
                        .addTo(map);
              let binMarker = new mapboxgl.Marker({color: 'black'})
                              .setPopup(popup)
                              .setLngLat(colcenPos)
                              .addTo(map);
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
        data.forEach((bin) => {
            // draw the bin on the map
            let binPos = [parseFloat(bin.attributes.bin_longitude), parseFloat(bin.attributes.bin_latitude)]
            let binFullness = parseInt(bin.attributes.bin_fullness)
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
                            "Bin Type: " + bin.attributes.bin_type +
                            "</p>"
            bin_text +=     `<button class="btn btn-primary"
                              onclick = "getDirection(${bin.attributes.bin_num});
                                         clickedBinNum=${bin.attributes.bin_num};">
                              <span class="glyphicon glyphicon-circle-arrow-right"></span> GO
                            </button>`
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
            let binNum = bin.attributes.bin_num;
            let binPos = [parseFloat(bin.attributes.bin_longitude), parseFloat(bin.attributes.bin_latitude)];
            let binFullness = parseInt(bin.attributes.bin_fullness);
            if (binFullness != localStorageBins[binNum-1].attributes['bin_fullness']){    // if the bin fullness is being updated in the DB
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
                                "Bin Type: " + bin.attributes.bin_type +
                                "</p>"
                bin_text +=     `<button class="btn btn-primary"
                                  onclick = "getDirection(${bin.attributes.bin_num});
                                             clickedBinNum=${bin.attributes.bin_num};">
                                  <span class="glyphicon glyphicon-circle-arrow-right"></span> GO
                                </button>`
                // remove the old bin marker and popup
                let oldbinMarker = binMarkers[bin.attributes.bin_num].remove();
                oldbinMarker.getPopup().remove();
                // create a popup
                let popup = new mapboxgl.Popup()
                        .setHTML(bin_text);
                popup.on('close', function(e) {
                    clickedBinNum = null;
                });
                // create a bin marker, but dont add it to the map yet
                let binMarker = new mapboxgl.Marker({color: binColor})
                                          .setPopup(popup)
                                          .setLngLat(binPos); 
                // put the bin marker to local storage
                binMarkers[binNum] = binMarker;
                // only add marker if the popup is not open and there is no route in progress                                         
                if (binNum != clickedBinNum && inProgressBinNum == null){
                    popup.addTo(map);
                    binMarker.addTo(map);
                }
                else if (binNum == inProgressBinNum){
                    bin_text =  "<p>" +
                                "Bin Num: " + binNum + "<br>" +
                                "Fullness: " + binFullness + "%" + "<br>" +
                                "Bin Type: " + bin.attributes.bin_type +
                                "</p>" 
                    bin_text += `<button class="btn btn-warning" onclick = "reportBinDamage(${bin_num});">
                                  <span class="glyphicon glyphicon-circle-arrow-right"></span> REPORT
                                </button>
                                <button class="btn btn-danger" onclick = "cancelJob(${binNum});">
                                    <span class="glyphicon glyphicon-circle-arrow-right"></span> CANCEL
                                </button>
                                `
                    // create a popup
                    popup.remove();
                    popup = new mapboxgl.Popup()
                            .setHTML(bin_text);
                    popup.on('close', function(e) {
                        clickedBinNum = null;
                    });
                    // create a bin marker, but dont add it to the map yet
                    binMarker.setPopup(popup);

                    // update bin marker
                    binMarker.addTo(map);
                    // dont open popup after adding
                    binMarker.togglePopup();
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

    // remove all bin amrkers except this one
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
        // remove the previous popup
        previousBinMarker.getPopup().remove();
        // create a new popup
        let previousBinPos = [parseFloat(previousBin.attributes.bin_longitude), parseFloat(previousBin.attributes.bin_latitude)];
        let previous_bin_text =  "<p>" +
                        "Bin Num: " + previousBin.attributes.bin_num + "<br>" +
                        "Fullness: " + previousBin.attributes.bin_fullness + "%" + "<br>" +
                        "Bin Type: " + previousBin.attributes.bin_type +
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
    // create a popup text
    let bin_text =  "<p>" +
                    "Bin Num: " + bin_num + "<br>" +
                    "Fullness: " + bin_fullness + "%" + "<br>" +
                    "Bin Type: " + bin_type +
                    "</p>" 
    bin_text += `<button class="btn btn-warning" onclick = "reportBinDamage(${bin_num});">
                  <span class="glyphicon glyphicon-circle-arrow-right"></span> REPORT
                </button>
                <button class="btn btn-danger" onclick = "cancelJob(${bin_num});">
                    <span class="glyphicon glyphicon-circle-arrow-right"></span> CANCEL
                </button>
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
    let bin_text =  "<p>" +
                    "Bin Num: " + bin.attributes.bin_num + "<br>" +
                    "Fullness: " + bin.attributes.bin_fullness + "%" + "<br>" +
                    "Bin Type: " + bin.attributes.bin_type +
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
