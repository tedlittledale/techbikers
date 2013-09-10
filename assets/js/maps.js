/* Author:

*/
var homepage = function () {


    // this will be a public method
    var init = function () {
		startMaps();
    };
	var startMaps = function(){
		var pinkParksStyles = [

		{
		    featureType: "poi",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },
		{
			featureType: "road",
			stylers: [
			{ hue: "#5ba3b6" },
			{ saturation: 0 }
			]
		},
		{
					featureType: "water",
					stylers: [
					{ hue: "#5ba3b6" },
					{ saturation: -40 }
					]
				}
		];
		var myOptions = {
			center: new google.maps.LatLng(51.44741, -2.60778),
			zoom: 15,
			zoomControl: true,
			scrollwheel : false,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles : pinkParksStyles
		};
		var map = new google.maps.Map(document.getElementById("map_canvas"),
		myOptions);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(51.44741, -2.60778),
			map: map,
			animation: google.maps.Animation.DROP,
			clickable : false,
			icon : 'assets/img/white-pin.png'
		});
		var myOptions2 = {
			center: new google.maps.LatLng(51.522789, -0.085469),
			zoom: 16,
			zoomControl: true,
			scrollwheel : false,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles : pinkParksStyles
		};
		var map2 = new google.maps.Map(document.getElementById("map_canvas2"),
		myOptions2);
		var marker2 = new google.maps.Marker({
			position: new google.maps.LatLng(51.522789, -0.085469),
			map: map2,
			animation: google.maps.Animation.DROP,
			clickable : false,
			icon : 'assets/img/white-pin.png'
		});
	};/* startMaps */

    return {
        init: init
    }
}();


window.onload = function() {
  homepage.init();

};

