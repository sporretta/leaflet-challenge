
//Identify url data is being pulled from
//url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

//Create function to search through earthquakes
function createMap(earthquakes){
  
    // Add a tile layer.
    let worldMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    // Create a baseMaps object to hold the map layer.
    let baseMaps = {
    "World Map": worldMap
    };

    // Create an overlayMaps object to hold the earthquake layer.
    let overlayMaps = {
    "Earthquake Locations": earthquakes
    };

    // Create the map object with options.
    let map = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 3,
        layers: [worldMap, earthquakes]
    });

    // Create a legend to display information about our map.
var legend = L.control({position : "bottomright"});
  
// When the layer control is added, insert a div with the class of "legend".
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  let depth=[-10,10,30,50,70,90];
  let info = "<h3> style='text-align: center'>Depth</h3>";

  div.innerhtml += info

  for(let i= 0; i<depth.length; i++) {
  div.innerHTML +=
  '<i style="background:"white"' + pickColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};

 
// Add the info legend to the map.
legend.addTo(map)

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(map);
    
};


//Create a function for the markers
function createMarkers(feature, latlng) {

    // Pull the "locations" property from data
    let locations = {
        radius: feature.properties.mag*2,
        fillColor: pickColor(feature.geometry.coordinates[2]),
        color: pickColor(feature.geometry.coordinates[2]),
        weight:.7,
        opacity: .6,
        fillOpacity: .4

    }
    return L.circleMarker(latlng, locations)
};


    //Create a function to choose the color of the marker
function pickColor(depth) {
    if (depth <= 10)
        return "green"
    else if (depth <= 30.0)
        return "greenyellow"
    else if (depth <= 50)
        return "yellow"
    else if (depth <= 70)
        return "orange" 
    else if (depth <= 90.0)
        return "orangered"
    else 
        return "red"
};



// Perform an API call to the Earthquake API to get the location information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    console.log(data);

    //Add create features
    createFeatures(data.features);
});

//Create function to gather the individual features of each earthquake
function createFeatures(earthquake) {
    let earthquakes = L.geoJSON(earthquake, {
        onEachFeature: feature,
        pointToLayer: createMarkers
    });

    createMap(earthquakes);

    

    //Add subfunction for binding the popup
    function feature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place} </h3><hr><p> Magnitude: ${feature.properties.mag}
        </p></hr> Depth: ${feature.geometry.coordinates[2]}</p>`)
    };



};
