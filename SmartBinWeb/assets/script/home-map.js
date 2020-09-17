mapboxgl.accessToken = 'pk.eyJ1IjoiYWFuZzAwMDIiLCJhIjoiY2tldmdmamttMXk3ZzJ4bXJseGt4cDBybyJ9.FPvgW8PxjOUeEV33WTfABg';
var myLatitude = -37.809967
var myLongitude = 144.962640
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
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [myLongitude, myLatitude], // starting position
    zoom: 14
});

// initialize the map canvas to interact with later
var canvas = map.getCanvasContainer();

map.on('load', function() {
    //getRoute([myLongitude, myLatitude], [144.962640, -37.909967]);

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
        'icon-image': 'http:localhost/assets/images/human-icon.png',
      }
    });

    // var marker = new mapboxgl.Marker()
    //     .setLngLat([myLongitude, myLatitude])
    //     .addTo(map);

    // add bin markers to the map
    var request = new XMLHttpRequest()
    binsToGet = 5;
    var path = 'http://127.0.0.1:8000/getbins/'

    request.open('GET', path, true)
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response).data

      // store the bins data to local storage
      window.localStorage.setItem('bins', JSON.stringify(data));

      if (request.status >= 200 && request.status < 400) {
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
                            "Fullness: " + bin.attributes.bin_fullness + "<br>" +
                            "Bin Type: " + bin.attributes.bin_type +
                            "</p>"
            let popup = new mapboxgl.Popup()
                      .setHTML(bin_text)
                      .addTo(map);
            let binMarker = new mapboxgl.Marker({color: binColor})
                            .setPopup(popup)
                            .setLngLat(binPos)
                            .addTo(map);
        })
      } else {
        console.log('error' + request.status.toString())
      }
    }

    request.send()
});

// // Create a popup, but don't add it to the map yet.
// var popup = new mapboxgl.Popup({
//   closeButton: false,
//   closeOnClick: false
// });

// map.on('mouseenter', 'places', function (e) {
//   // Change the cursor style as a UI indicator.
//   map.getCanvas().style.cursor = 'pointer';
   
//   var coordinates = e.features[0].geometry.coordinates.slice();
//   var description = e.features[0].properties.description;
   
//   // Ensure that if the map is zoomed out such that multiple
//   // copies of the feature are visible, the popup appears
//   // over the copy being pointed to.
//   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//   }
   
//   // Populate the popup and set its coordinates
//   // based on the feature found.
//   popup.setLngLat(coordinates).setHTML(description).addTo(map);
//   });
   
//   map.on('mouseleave', 'places', function () {
//     map.getCanvas().style.cursor = '';
//     popup.remove();
// });