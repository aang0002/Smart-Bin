/*
Create a table dynamically
*/
function generateTableHead(table, headers) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    headers.forEach((header) => {
        let th = document.createElement("th");
        let text = document.createTextNode(header);
        th.appendChild(text);
        row.appendChild(th);
    })
}

function generateTableContent(table, attributes) {
    let binsToGet =5
    let request = new XMLHttpRequest()
    let path = '/nearestbins/' + myLatitude + '/' + myLongitude + '/' + binsToGet
    
    request.open('GET', path, true)
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response).data

      if (request.status >= 200 && request.status < 400) {
        // store data into local storage
        // display the 5 nearest bin entries in the HTML table
        data.forEach((bin) => {
            // render a row in the table
            let row = table.insertRow();
            attributes.forEach((key) => {
                let cell = row.insertCell();
                let content = document.createTextNode(bin.attributes[key])
                cell.appendChild(content);
            })
            let cell = row.insertCell();
            // create GET DIRECTION button
            let getDirButton = document.createElement("BUTTON");
            getDirButton.type = "button";
            getDirButton.className = "btn btn-primary";
            getDirButton.innerHTML = "GO";
            getDirButton.onclick =  function (){
                                      window.scrollTo(0, 0);
                                      getDirection(bin.attributes.bin_num);
                                      clickedBinNum = bin.attributes.bin_num;
                                    }
            cell.appendChild(getDirButton);
        })}
      else {
        console.log('error');
      }
    }

    request.send();
}

function renderBinCollectionRoute(cleaner_pos, bin_pos) {
  // first, get the position of nearest bin
  let request = new XMLHttpRequest()
  let binLong = bin_pos[0]
  let binLat = bin_pos[1]
  let path = '/nearestcolcen/' + binLat + '/' + binLong
  
  request.open('GET', path, true)
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response).data

    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(this.response).data
      var colcen_data = data[0].attributes
      var colcen_pos = [colcen_data.colcen_longitude, colcen_data.colcen_latitude]
      getRoute(cleaner_pos, bin_pos, 0);
      getRoute(bin_pos, colcen_pos, 1);
      // save the colcen pos to localStorage
      window.localStorage.setItem('inProgress_colcen_id', colcen_data.colcen_id);
    }
    else {
      console.log('error');
    }
  }
  request.send();
}

function getRoute(start, end, routeNum) {
    // https://www.mapbox.com/api-documentation/#directions
    var url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload  = function() {
      var jsonResponse = req.response;
      var distance = jsonResponse.routes[0].distance*0.001; // convert to km
      var duration = jsonResponse.routes[0].duration/60; // convert to minutes
      var coords = jsonResponse.routes[0].geometry;
      // add the route to the map
      addRoute(coords, routeNum);
    };
    req.send();
}

// adds the route as a layer on the map
function addRoute (coords, routeNum) {
  // check if the route is already loaded
  var routeID = "route" + routeNum.toString()
  if (map.getSource(routeID)) {
    map.removeLayer(routeID)
    map.removeSource(routeID)
  }
  map.addLayer({
    "id": routeID,
    "type": "line",
    "source": {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "properties": {},
        "geometry": coords
      }
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#3b9ddd",
      "line-width": 6,
      "line-opacity": 0.8
    }
  });
}

function fillBinTable(){
  // fill the data
  let headers = ["Bin Num", "Type", "Fullness (%)", " Full Volume (L)", "Status", "Postcode"]
  let attributes = ["bin_num", "bin_type", "bin_fullness", "bin_volume", "bin_status", "postcode"]
  let table = document.getElementById("binTable");
  generateTableHead(table, headers);
  generateTableContent(table, attributes);

  // run the search engine once the bins data is filled
  $(document).ready(function(){
      $("#searchInput").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $("#binTable tr").filter(function() {
              $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
      });
  });
}
