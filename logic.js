API_KEY = "pk.eyJ1Ijoic2xlZXB6eno5MSIsImEiOiJjamtqbzZqdHYxaGRmM3FvYWlwbXlzemg4In0.w5iUniL-Znt4-CS95BVEJQ"

function createMap(earthquakes) {
  // Adding tile layer
  var url = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";
  var attribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";

  var grayscale = L.tileLayer(url, {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer(url, {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var outdoors = L.tileLayer(url, {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var baseMaps = {
    Satellite: satellite,
    Grayscale: grayscale,
    Outdoors: outdoors,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Creating map object
  var map= L.map("map", {
    center: [40.17, -96.94],
    zoom: 5,
    layers: [grayscale, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps).addTo(map);

  
  function getColor(d) {
    return d < 1 ? 'rgb(255,255,255)' :
          d < 2  ? 'rgb(255,225,225)' :
          d < 3  ? 'rgb(255,195,195)' :
          d < 4  ? 'rgb(255,165,165)' :
          d < 5  ? 'rgb(255,135,135)' :
          d < 6  ? 'rgb(255,105,105)' :
          d < 7  ? 'rgb(255,75,75)' :
          d < 8  ? 'rgb(255,45,45)' :
          d < 9  ? 'rgb(255,15,15)' :
                      'rgb(255,0,0)';
}

  // Create a legend to display information about our map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(map);

};

function createFeatures(earthquakeData) {

  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255-80*feature.properties.mag);
      var b = Math.floor(255-80*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  createMap(earthquakes);
};


// Store API
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url, function(data) {
  console.log(data)
  createFeatures(data.features);
});


