function getFeatures(points) {
	var arrayFeatures = new Array();
	for (var i in points){
	       var lonLat = new OpenLayers.LonLat(points[i].longitude,
				    points[i].latitude)
		      .transform(
				  new OpenLayers.Projection("EPSG:4326"), //transform from WGS 1984
					      map.getProjectionObject() //to Spherical Mercator Projection
					    );
        	var template = { "type": "Feature", "geometry": {"type": "Point", "coordinates":
[lonLat.lon,lonLat.lat]},"properties":
{"name":points[i].name,"description":points[i].description,"audiodata":points[i].audiodata}};
		arrayFeatures.push(template);
	}
        var features = {
            "type": "FeatureCollection",
            "features": arrayFeatures
        };
        var reader = new OpenLayers.Format.GeoJSON();
        return reader.read(features);
}

function getAllSpots(points){
    var audioSpotsLayer = new OpenLayers.Layer.Vector("audioSpots", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/checkpoint_audio.png",
            graphicOpacity: 1.0,
            graphicWidth: 27,
            graphicHeight: 130/*,
            graphicYOffset: -26*/
        }),
	eventListeners:{
                'featureselected':function(evt){
                    var feature = evt.feature;
		    var centerPoint = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
		    $('#whatName').html(feature.attributes.name);
		    $('#whatDescription').html(feature.attributes.description);
		    var audioElement = document.getElementById('mapPlayer');
		    var blob = new Blob(feature.attributes.audiodata, { type: "audio/ogg" });
		    //audioElement.src = window.URL.createObjectURL(blob);
	    	    map.setCenter(centerPoint, 18);
                },
                'featureunselected':function(evt){
                    var feature = evt.feature;
                }
	}	
    });
    var audioSpots = getFeatures(points);

    var audioHover = new OpenLayers.Control.SelectFeature(
        audioSpotsLayer,
	{
	    hover: true,
	    onSelect: hoverAudio,
	    autoActivate: true
	}
    );

    var audioHoverOut = new OpenLayers.Control.SelectFeature(
        audioSpotsLayer,
	{
	    highlightOnly: true,
	    hover: true,
	    onUnselect: hoverAudioOut,
	    autoActivate: true
	}
    );

    var audioControl = new OpenLayers.Control.SelectFeature(
        audioSpotsLayer,
	{
	    onSelect: clickAudio,
	    autoActivate: true
	}
    );
  
    map.addControl(audioControl);
    audioSpotsLayer.addFeatures(audioSpots);
    map.addLayer(audioSpotsLayer);
}

function clickAudio(){
    $('#popupBasic').show();
}

function hoverAudio(){
    document.body.style.cursor = 'pointer';
}

function hoverAudioOut(){
    document.body.style.cursor = 'auto';
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
		    externalGraphic: "img/checkpoint.png",
		    graphicOpacity: 1.0,
		    graphicWidth: 27,
		    graphicHeight: 130/*,
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
