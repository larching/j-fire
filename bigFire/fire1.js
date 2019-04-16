import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import Overlay from 'ol/Overlay.js';

import {toStringHDMS} from 'ol/coordinate.js';
import {fromLonLat, toLonLat} from 'ol/proj.js';


var layer = new TileLayer({
    source: new OSM()
  });

  var map = new Map({
    layers: [layer],
    target: 'map',
    view: new View({
      center: [-113, 47],
      zoom: 4
    })
  });



  var fire1 = fromLonLat([-113.5877542, 47.5303717]);
  var fire2 = fromLonLat([-114.4462061, 47.1568185]);
  var fire3 = fromLonLat([-113.688856 ,47.001118]);

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

  map.on('click', function(evt) {
    var element = popup.getElement();
    var coordinate = evt.coordinate;
    var hdms = toStringHDMS(toLonLat(coordinate));

    $(element).popover('destroy');
    popup.setPosition(coordinate);
    $(element).popover({
      placement: 'top',
      animation: false,
      html: true,
      content: '<p>The location you clicked was:</p><code>' + hdms + '</code>'
    });
    $(element).popover('show');
});