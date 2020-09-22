function fillMapData(){
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWFuZzAwMDIiLCJhIjoiY2tldmdmamttMXk3ZzJ4bXJseGt4cDBybyJ9.FPvgW8PxjOUeEV33WTfABg';
  var binsToGet;
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
  var canvas = map.getCanvasContainer();

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

      // var marker = new mapboxgl.Marker()
      //     .setLngLat([myLongitude, myLatitude])
      //     .addTo(map);

      /* add BIN MARKERS to the map*/
      var request = new XMLHttpRequest()
      binsToGet = 5;
      var path = 'http://127.0.0.1:8000/getbins/'

      request.open('GET', path, true)
      request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response).data

        // store the bins data to local storage
        window.localStorage.setItem('bins', JSON.stringify(data));
        data.forEach((bin) => {
            // draw the bin on the map
            var binPos = [parseFloat(bin.attributes.bin_longitude), parseFloat(bin.attributes.bin_latitude)]
            var binFullness = parseInt(bin.attributes.bin_fullness)
            let binColor;
            // green
            if (binFullness>=0 && binFullness<=24){ binColor = 'green';}
            // yellow
            else if (binFullness>=25 && binFullness<=49){ binColor = 'yellow';}
            // orange
            else if (binFullness>=50 && binFullness<=74){ binColor = 'orange';}
            // red
            else{ binColor = 'red';}
            let bin_text =  "<p>" +
                            "Bin Num: " + bin.attributes.bin_num + "<br>" +
                            "Fullness: " + bin.attributes.bin_fullness + "%" + "<br>" +
                            "Bin Type: " + bin.attributes.bin_type +
                            "</p>"
            let popup = new mapboxgl.Popup()
                      .setHTML(bin_text)
                      .addTo(map);
            let binMarker = new mapboxgl.Marker({color: binColor})
                            .setPopup(popup)
                            .setLngLat(binPos)
                            .addTo(map);
            binMarkers[bin.attributes.bin_num] = binMarker; // push it to global variable
        })
      }
      request.send()

      /* Add COLLECTION CENTER MARKERS*/
      var request = new XMLHttpRequest()
      binsToGet = 5;
      var path = 'http://127.0.0.1:8000/getcolcens/'

      request.open('GET', path, true)
      request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response).data

        // store the bins data to local storage
        window.localStorage.setItem('colcens', JSON.stringify(data));

        if (request.status >= 200 && request.status < 400) {
          data.forEach((colcen) => {
              // draw the bin on the map
              var colcenPos = [parseFloat(colcen.attributes.colcen_longitude), parseFloat(colcen.attributes.colcen_latitude)]
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

      request.send()
  });
}