
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

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(map);
    
};


//Create a function for the markers
function createMarkers(feature, latlng) {

    // Pull the "locations" property from response.data.
    let locations = {
        size: feature.properties.mag*5,
        fillColor: pickColor(feature.properties.mag),
        color: pickColor(feature.properties.mag),
        weight:.7,
        opacity: .6,
        fillOpacity: .4

    }
return L.circleMarker(latlng, locations)
};


    //Create a function to choose the color of the marker
function pickColor(mag) {
    if (1.0<= mag && mag <= 2.5)
        return "blue"
    else if (2.5 <= mag && mag < 4.0)
        return "green"
    else if (4.0 <= mag && mag < 5.5)
        return "yellow"
    else if (5.5 <= mag && mag < 8.0)
        return "orange" 
    else if (8.0 <= mag && mag < 20.0)
        return "purple"
    else 
        return "red"
};


    // Initialize an array to hold earthquake markers.
    // let quakeMarkers = [];

    // // Loop through the locations array.
    // for (let index = 0; index < locations.length; index++) {
    //     let location = locations[index];

    //     // For each location, create a marker, and bind a popup with the location's name.
    //     let quakeMarker = L.marker([location.geometry.coordinates[0], location.geometry.coordinates[1]])
    //         .bindPopup("<h3>" + location.properties.title + "<h3><h3>Magnitude: " + location.properties.mag + "</h3>");

    //     // Add the marker to the quakeMarkers array.
    //     quakeMarkers.push(quakeMarker);
    // }

//     // Create a layer group that's made from the quake markers array, and pass it to the createMap function.
//     createMap(L.layerGroup(quakeMarkers));
// };


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