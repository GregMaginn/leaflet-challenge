//pull data from json and send each "feature" or earthquake
// to function to size and color it before adding to plot
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
    .then(data => {
    //testing to see if link is good
    console.log("test")
    cirMaker(data.features)
});

function cirMaker(quakeData){
    function setColor(magnitude) {
        console.log("Setting Color")
        if (magnitude > 5){
            //red
            console.log("red")
            return "red"
        }
        if (magnitude > 4){
            //orange
            console.log("orangered")
            return "orangered"
        }
        if (magnitude > 3){
            //yellow
            console.log("orange")
            return "orange"
        }
        if (magnitude > 2){
            //green
            console.log("yellow")
            return "yellow"
        }
        else {
            //blue
            console.log("green")
            return "green"
        }
    }
    function setSize(magnitude) {
        //test
        //return 5
        console.log(1 + (magnitude*4))
        return (1 + (magnitude*4))
    }
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p><hr><p>" + feature.properties.mag + "</p>")
    }   

    var quakes = L.geoJSON(quakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                opacity: 1,
                fillOpacity: 1,
                color: "white",
                fillColor: setColor(feature.properties.mag),
                radius: setSize(feature.properties.mag),
                stroke: true,
                weight: 1
            })
        },
        onEachFeature: onEachFeature
    })
    createMap(quakes)
}
function createMap(quakesDaily){
    //create background of map via mapbox
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
      });

    //create object to hold lightmap layer
    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap
    };

    //create overlay object to hold entire map
    var overlayMaps = {
        "Quakes": quakesDaily 
    };

    //create map object with placement and zoom
    var map = L.map("quake-map",  {
        center: [40.73, -74.00],
        zoom: 5,
        layers: [lightmap, quakesDaily]
    })
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
    console.log("test")
}
