define([
  "app",

  // Libs
  "backbone",
  "handlebars",
  "d3",
  "underscore",
  "modernizr",
  "jquery",
  "helpers",
  "swipe"
],

function(app, Backbone, Handlebars, d3, _) {
  var Views = {};
    Views.Map = Backbone.View.extend({
		// attaches /bin/bash: this.el: command not found to an existing element.
		el: $('#map-canvas'),

		events: {
			//'click .tag ': 'edit'
		},
		initialize: function(){
			var view = this;
			_.bindAll(this, 'addMarkers');
			var mapOptions = {
				center: new google.maps.LatLng(50.17827395732207, 0.6850681250000523),
				zoom: 7,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			this.model.set({
				mymap : new google.maps.Map(document.getElementById("map-canvas"), mapOptions)
			});
			this.model.get('tweets').on('reset', function(){
				view.addMarkers();
			});
			this.model.on('change:selectedTweet', function(){
				view.goToMarker();
			});
			$('#tweetDetails').on('click', '#prevTweet', function(){
				view.model.increment(1);
				return false;
			});
			$('#tweetDetails').on('click', '#nextTweet', function(){
				view.model.increment(-1);
				return false;
			});
			this.template = app.fetchTemplate('app/templates/tweetTemplate', 'tweetTemplate.html');
		},
		goToMarker : function(){
			console.log(this.model.get('selectedTweet').get('marker'));
			this.model.get('mymap').panTo(this.model.get('selectedTweet').get('marker').getPosition());
			this.model.get('mymap').setZoom(10);
			this.showTweet();
		},
		showTweet : function(){
			$('#tweetDetails').html(this.template(this.model.get('selectedTweet').toJSON()));
		},
		addMarkers : function(){
			var tweets = this.model.get('tweets'), markers = [], view = this;
			tweets.each(function(t){
				console.log(t);
				t.set({
					marker : new google.maps.Marker({
						position: new google.maps.LatLng(t.get('secondsync').geo.lat, t.get('secondsync').geo.lon),
						map: view.model.get('mymap'),
						draggable: false,
						animation: google.maps.Animation.DROP,
						model : t,
						icon : 'assets/img/bike-icon.png'
					})
				});
				google.maps.event.addListener(t.get('marker'), 'click', function() {
					view.model.set({
						selectedTweet : this.model
					});
				});
			});
		},
		getTemplates : function(){
			this.template = app.fetchTemplate('app/templates/miniLeaderboardTemplate', 'miniLeaderboardTemplate.html');
			this.progressTemplate = app.fetchTemplate('app/templates/showsProgressTemplate', 'showsProgressTemplate.html');
		}
	});
	Views.ProgressBar = Backbone.View.extend({
		// attaches /bin/bash: this.el: command not found to an existing element.
		el: $('#progressBar'),

		events: {
			//'click .tag ': 'edit'
		},
		initialize: function(){
			var view = this;
			_.bindAll(this);
			this.el = $(this.el);
			this.template = app.fetchTemplate('app/templates/progressTemplate', 'progressTemplate.html');

			this.model.bind('change:ready reset:ready', function(){
				view.render();
			});
			this.el.on('click', 'a', function(e){
				console.log(view.model.get('tweets').get($(this).data('bbid')), $(this).data('bbid'));
				view.model.set({
					selectedTweet : view.model.get('tweets').get($(this).data('bbid'))
				});
				return false;

			});
		},
		render : function(){
			console.log('tes');
			this.el.html(this.template({ tweets : this.model.get('tweets').toJSON()}));
		}
	});
	
  

  return Views;

});
