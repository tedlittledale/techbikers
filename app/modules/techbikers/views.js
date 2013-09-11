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
  "swipe",
  "foundation",
  "joyride",
  "tooltips"
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
			this.model.on('change:ready', function(){
				view.addMarkers();
			});
			this.model.on('change:selectedTweet', function(){
				if(this.get('selectedTweet')){
					view.goToMarker();
				}
			});
			$('#tweetDetails').on('click', '#prevTweet', function(){
				view.model.increment(1);
				return false;
			});
			$('#tweetDetails').on('click', '#nextTweet', function(){
				view.model.increment(-1);
				return false;
			});
			google.maps.event.addListener(this.model.get('mymap'), 'center_changed', function() {
				view.hideTweet();
			});
			google.maps.event.addListener(this.model.get('mymap'), 'zoom_changed', function() {
				view.hideTweet();
			});
			this.template = app.fetchTemplate('app/templates/tweetTemplate', 'tweetTemplate.html');
		},
		goToMarker : function(){
			var xPan = ($('body').width() / 2) - $('#tweetDetails').outerWidth() - 30,
				map = this.model.get('mymap');
			map.panTo(this.model.get('selectedTweet').get('marker').getPosition());
			console.log(xPan);
			if(map.getZoom() < 10){
				map.setZoom(10);
			}
			map.panBy(-xPan, 153);
			this.showTweet();
		},
		showTweet : function(){
			$('#tweetDetails').html(this.template(this.model.get('selectedTweet').toJSON()));
			$('#tweetDetails').addClass('active');
		},
		hideTweet : function(){
			$('#tweetDetails').removeClass('active');
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
						selectedTweet : null
					});
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
			this.model.on('change:selectedTweet', function(){
				if(this.get('selectedTweet')){
					view.el.addClass('active');
					view.el.find('a').removeClass('selected');
					var it = view.el.find('a[data-bbid="'+this.get('selectedTweet').cid+'"]');
					it.addClass('selected');
				}
				else{
					view.el.find('a').removeClass('selected');
					view.el.removeClass('active');
				}
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

	Views.Tour = Backbone.View.extend({
		initialize : function(){
			$.ready(function(){
				$(document)
				.foundation()
				.foundation('joyride', 'start');
			});
			

		}
	});
	
  

  return Views;

});
