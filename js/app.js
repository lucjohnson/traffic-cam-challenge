// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

$(document).ready(function() {
	var mapOptions = {
		center: {lat: 47.6, lng: -122.3},
		zoom: 12
	}

	//creates primary global variables
	var mapElem = document.getElementById('map');
	var map = new google.maps.Map(mapElem, mapOptions);
	var info = new google.maps.InfoWindow();
	var tCams = [];
	var mc = new MarkerClusterer(map);

	//sets map to proper size based on window size and adjusts dynamically
	var p = $('#map');
	var position = p.position();
	var windowHeight = $(window).height();
	var mapHeight = windowHeight - position.top - 20;
	$('#map').css('height', mapHeight);
	$(window).resize(function() {
		$('#map').css('height', mapHeight);
	});

	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			//creates marker for every camera represented in JSON file
			data.forEach(function(data) {
				var position = {
					lat: (Number)(data.location.latitude),
					lng: (Number)(data.location.longitude)
				};
				var tCamera = new google.maps.Marker({
					position: position,
					map: map,
					icon: 'cam-icon.png'
				});
				tCams.push(tCamera);
				tCamera.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function() {
					tCamera.setAnimation(null);
				}, 1500);
				mc.addMarker(tCamera);

				//opens info window when a marker is clicked
				google.maps.event.addListener(tCamera, 'click', function() {
					map.panTo(tCamera.getPosition());
					var content = '<p>' + data.cameralabel + '</p>' + '<img src=' + data.imageurl.url + '>';
					info.setContent(content);
					info.open(map, this);

					//marker bounces once on click
					tCamera.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function() {
						tCamera.setAnimation(null);
					}, 750);
				})

				//filters cameras based on a user's search (markers are removed if input does not match)
				$('#search').bind('search keyup', function() {
					var input = this.value.toLowerCase();
					if(data.cameralabel.toLowerCase().indexOf(input) < 0) {
						tCamera.setMap(null);
					} else {
						tCamera.setMap(map);
					}
					mc.resetViewport();
				});

				//closes info window when user clicks elsewhere
				google.maps.event.addListener(map, 'click', function() {
					info.close();
				})
			})
		})

		.fail(function(err) {
			alert("Request failed");
		})
})