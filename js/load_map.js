function getFeatures() {
        var features = {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [-0777700, 4956300]},
                    "properties": {"Name": "Igor Tihonov", "Country":"Sweden", "City":"Gothenburg"}}
            ]
        };
        var reader = new OpenLayers.Format.GeoJSON();
        return reader.read(features);
}

function getAllSpots(){
    var audioSpotsLayer = new OpenLayers.Layer.Vector("audioSpots", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/checkpoint02.png",
            graphicOpacity: 1.0,
            graphicWidth: 25,
            graphicHeight: 64/*,
            graphicYOffset: -26*/
        })
    });
    var audioSpots = getFeatures();
    audioSpotsLayer.addFeatures(audioSpots);
}

function locateMe(){
    console.log("Localizando....");
    navigator.geolocation.getCurrentPosition(function(position) {       
	    $('#globalLon').val(position.coords.longitude);
	    $('#globalLat').val(position.coords.latitude);
	    var lonLat = new OpenLayers.LonLat(position.coords.longitude,
				    position.coords.latitude)
		      .transform(
				  new OpenLayers.Projection("EPSG:4326"), //transform from WGS 1984
					      map.getProjectionObject() //to Spherical Mercator Projection
					    );
	    var point = new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat);
	    var userLayer = new OpenLayers.Layer.Vector("User", {
		styleMap: new OpenLayers.StyleMap({
		    externalGraphic: "img/checkpoint02.png",
		    graphicOpacity: 1.0,
		    graphicWidth: 25,
		    graphicHeight: 64/*,
		    graphicYOffset: -26*/
		})
	    });
	    userLayer.addFeatures([new OpenLayers.Feature.Vector(point)]);
	    map.addLayer(userLayer);
	    map.setCenter(lonLat, 18 // Zoom level
	    );
	});
}

//Loads the map
function LoadMap(whatDiv,locate){
	map = new OpenLayers.Map({
	div: whatDiv,
        theme: null,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom()
        ],
        layers: [
            new OpenLayers.Layer.Stamen("toner", null, {
                transitionEffect: 'resize'
            })
        ],
        center: new OpenLayers.LonLat(742000, 5861000),
        zoom: 3
    });

    if (locate){
	locateMe();
    }
}
