// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var directionsService
var directionsDisplay

var pos;
function initMap() {
	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;

	var lineSymbol = {
		path: google.maps.SymbolPath.CIRCLE,
		fillOpacity: 1,
		scale: 3
	};

	directionsDisplay.setOptions({
		polylineOptions: {
			strokeColor: 'black',
			strokeOpacity: 0,
			icons: [{
				icon: lineSymbol,
				offset: '0',
				repeat: '10px'
			}],
		}
	});

	pos = {lat: 40.732994, lng: -73.998031};

	map = new google.maps.Map(document.getElementById('map'), {
		center: pos,
		zoom: 15,
		styles: [
		{
			featureType: 'all',
			stylers: [
			{ saturation: -100 }
			]
		},{
			featureType: 'road.arterial',
			elementType: 'geometry',
			stylers: [
			{ hue: '#00ffee' },
			{ saturation: 50 }
			]
		},{
			featureType: 'all',
			elementType: 'labels',
			stylers: [
			{ visibility: 'off' }
			]
		},{
			featureType: 'administrative.neighborhood',
			elementType: 'labels',
			stylers: [
			{ visibility: 'on' }
			]
		},{
			featureType: 'road.arterial',
			elementType: 'labels',
			stylers: [
			{ visibility: 'on' }
			]
		},{
			featureType: 'road.highway',
			elementType: 'labels',
			stylers: [
			{ visibility: 'on' }
			]
		}
		]
	});


	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log("geolocation successful")
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			// infoWindow.setPosition(pos);
			// infoWindow.setContent('Location found');
			// var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
			var image = 'img/icon2.png';
						
			var beachMarker = new google.maps.Marker({
				position: pos,
				map: map,
				icon: image
			});


			map.setCenter(pos);
			loadRestaurants(map, pos);

			// loadRestaurants(map, pos);

			// directionsDisplay.setMap(map);
		}, function() {
			console.log("geolocation failed")
			pos = {lat: 40.732994, lng: -73.998031};
			var image = 'img/icon2.png';
							
			var beachMarker = new google.maps.Marker({
				position: pos,
				map: map,
				icon: image
			});


			map.setCenter(pos);
			loadRestaurants(map, pos);
			// handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		console.log("geolocation failed")
		pos = {lat: 40.732994, lng: -73.998031};
		var image = 'img/icon2.png';
						
		var beachMarker = new google.maps.Marker({
			position: pos,
			map: map,
			icon: image
		});


		map.setCenter(pos);
		loadRestaurants(map, pos);
		// Browser doesn't support Geolocation
		// handleLocationError(false, infoWindow, map.getCenter());
	}

	directionsDisplay.setMap(map);

	var onChangeHandler = function() {
		calculateAndDisplayPresetRoute(directionsService, directionsDisplay, pos);
	};

	// document.getElementById('start').addEventListener('change', onChangeHandler);
	document.getElementById('end').addEventListener('change', onChangeHandler);
				
				
				
} // end of initMap()

function calculateAndDisplayPresetRoute(directionsService, directionsDisplay, pos) {
	directionsService.route({
		origin: pos,
		destination: document.getElementById('end').value,
		travelMode: 'DRIVING'
	}, function(response, status) {
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pos, end) {
	directionsService.route({
		origin: pos,
		destination: end, // document.getElementById('end').value,
		travelMode: 'DRIVING'
	}, function(response, status) {
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

function loadRestaurants(map, loc) {
	infowindow = new google.maps.InfoWindow();
	console.log(loc);

	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: loc,
		radius: 1000,
		type: ['restaurant']
	}, callback);
}


function callback(results, status) {
	console.log(status);
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var image = 'img/marker_v2.png';
	// var infowindow;
	var placeLoc = place.geometry.location;

	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: image
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		// map.setZoom(20);
		// map.setCenter(marker.getPosition());
		// infowindow.setContent(contentString);
		infowindow.setContent(place.name);
		infowindow.open(map, this);
		calculateAndDisplayRoute(directionsService, directionsDisplay, pos, place.geometry.location);
	});
}