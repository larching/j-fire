import 'ol/ol.css';
import {Map, View} from 'ol';
//import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import {toStringHDMS} from 'ol/coordinate';
import {toLonLat} from 'ol/proj';

import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

import {fromLonLat} from 'ol/proj';


var layer = new TileLayer({
    source: new OSM()
  });

  var view = new View({
    center: [0, 0],
    zoom: 2
  });

  var map = new Map({
    layers: [layer],
    target: 'map',
    view: view
    
  });

  var fire1 = fromLonLat([-113.5877542, 47.5303717]);
  var fire2 = fromLonLat([-114.4462061, 47.1568185]);
  var fire3 = fromLonLat([-113.688856 ,47.001118]);
  var savedPoints = [];

  // fire1 marker
  var fireMarker1 = new Overlay({
    position: fire1,
    positioning: 'center-center',
    element: document.getElementById('fireMarker1'),
    stopEvent: false
  });
  //fire2 marker
  var fireMarker2 = new Overlay({
    position: fire2,
    positioning: 'center-center',
    element: document.getElementById('fireMarker2'),
    stopEvent: false
  });
  //fire3 marker
  var fireMarker3 = new Overlay({
    position: fire3,
    positioning: 'center-center',
    element: document.getElementById('fireMarker3'),
    stopEvent: false
  });

  var fire1Link = new Overlay({
    position: fire1,
    element: document.getElementById('fire')
  });

  map.addOverlay(fireMarker1);
  map.addOverlay(fireMarker2);
  map.addOverlay(fireMarker3);
  map.addOverlay(fire1Link);

  // Vienna label
  var Fire1 = new Overlay({
    position: fire1,
    element: document.getElementById('fireMarker1')
  });
  var Fire2 = new Overlay({
    position: fire2,
    element: document.getElementById('fireMarker2')
  });
  var Fire3 = new Overlay({
    position: fire3,
    element: document.getElementById('fireMarker3')
  });
  map.addOverlay(Fire1);
  map.addOverlay(Fire2);
  map.addOverlay(Fire3);



  // Popup showing the position the user clicked
  var popup = new Overlay({
    element: document.getElementById('popup')

  });
  map.addOverlay(popup);

  map.on('click', function(evt,savedPoints) {
    var element = popup.getElement();
    var coordinate = evt.coordinate;
    var hdms = toStringHDMS(toLonLat(coordinate));
    var points = savedPoints;

 

    $(element).popover('destroy');
    popup.setPosition(coordinate);
    $(element).popover({
    
      placement: 'top',
      animation: false,
      html: true,
      content: '<p>Location:</p><code>' + hdms + '</code>'+
      '<p>Humidity: 44%<br> Wind Speed: 8 MPH<br>Wind Direction: W <br>'+
      'Temp High: 47 F <br>'+'Discovery Date: 4/16/2019 <br>'+'</p>'+
      '<a href ="fire1.html">Weather Forcast</a>'+'<br>'+'<button >Save Point</button>'
     
     
    });
// on button click save location 

    $(element).popover('show');



});


//////////////////////////////////////
// geolocation

var geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true
  },
  projection: view.getProjection()
});

function el(id) {
  return document.getElementById(id);
}

el('track').addEventListener('change', function() {
  geolocation.setTracking(this.checked);

  navigator.geolocation.getCurrentPosition(function(pos) {
    const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
    map.getView().animate({center: coords, zoom: 10});
  });

});

// update the HTML page when the position changes.
geolocation.on('change', function() {
  el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';

});

// handle geolocation error.
geolocation.on('error', function(error) {
  var info = document.getElementById('info');
  info.innerHTML = error.message;
  info.style.display = '';
});

var accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry', function() {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

var positionFeature = new Feature();
positionFeature.setStyle(new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#3399CC'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 2
    })
  })
}));



geolocation.on('change:position', function() {
  var coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ?
    new Point(coordinates) : null);

    
});

new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature]
  })
});

/////////////////////////////////////
//search feature

var positionFeature = new Feature();
positionFeature.setStyle(new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#3399CC'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 2
    })
  })
}));


$("#coord-search").click(function(){
  var latitude = parseFloat(document.getElementById("lat-search").value);
  var longitude = parseFloat(document.getElementById("lon-search").value); 
  console.log("search");
  const coords = fromLonLat([longitude, latitude]);

 
    var coordinates = coords;
    positionFeature.setGeometry(coordinates ?
      new Point(coordinates) : null);
      
 

  map.getView().animate({center: coords, zoom: 5});

});


var displayFeatureInfo = function(pixel){
  var features = [];
  map.forEachFeatureAtPixel(pixel, function(feature, layer){
      features.push(feature);
  });
   
};


new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [positionFeature]
  })
});

