// Set the require.js configuration for your application.
require.config({
  // Initialize the application with the main application file

  paths: {
    // JavaScript folders
    libs: "../assets/js/libs",
    plugins: "../assets/js/plugins",

    // Libraries
    jquery: "../assets/js/libs/jquery",
    handlebars: "../assets/js/libs/handlebars",
    helpers: "../assets/js/libs/handlebar-helpers",
    underscore: "../assets/js/libs/underscore",
    modernizr: "../assets/js/libs/modernizr-2.5.3.min",
    backbone: "../assets/js/libs/backbone-min",
    swipe: "../assets/js/libs/plugins/swipe",
    d3: "../assets/js/libs/d3",
    foundation : "../javascripts/foundation/foundation",
    joyride : "../javascripts/foundation/foundation.joyride",
    tooltips : "../javascripts/foundation/foundation.tooltips"
  },
underscorerlArgs: "bust=v"+Math.round(Math.random()*1000000),
  shim: {
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    handlebars: {
      exports: "Handlebars"
    },
	underscore: {
      exports: "_"
    },
    d3: {
      exports: "d3"
    }
  }
});
require([
  "app",

  // Libs
  "jquery",
  "backbone",
  "underscore",

  // Modules
  "modules/techbikers"
],

function(app, ignore, Backbone, _, Techbikers) {
  var Globals = {};
  if(navigator.userAgent){
	window.Globals = Globals;
  }
	var techbikers = _.extend(Techbikers, {
		models : {
			controller : new Techbikers.Models.Controller(),
			map : new Techbikers.Models.Map()
		},
		collections : {
			tweets : new Techbikers.Collections.Tweets(),
			alltweets : new Techbikers.Collections.Tweets()
		}
	});
	techbikers.models.controller.set({
		tweets : techbikers.collections.tweets,
		alltweets : techbikers.collections.alltweets,
		map : techbikers.models.map
	});
	

  $(function() {

    techbikers.models.controller.start();

		
	techbikers = _.extend(techbikers, {
		views : {
			map : new Techbikers.Views.Map({
				model : techbikers.models.controller
			}),
			progressBar : new Techbikers.Views.ProgressBar({
				model : techbikers.models.controller
			}),
      tour : new Techbikers.Views.Tour()
		}
	});



	techbikers.models.controller.set({
		showId : 492371,
		apiRoot : '/data/',
		list_endpoint : 'homepage.json?2431'
	});
  });



});
