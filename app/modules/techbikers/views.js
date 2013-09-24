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
			if(Modernizr.mq('only all and (max-width: 768px)')){
				$("#map").appendTo('#mobileMap');
			}
			var mapOptions = {
				center: new google.maps.LatLng(50.17827395732207, 0.6850681250000523),
				zoom: 7,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: Modernizr.mq('only all and (max-width: 768px)')
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
			google.maps.event.addListener(this.model.get('mymap'), 'dragstart', function() {
				view.hideTweet();
				view.model.set({
					selectedTweet:null
				});
			});
			$('body').on('click', function() {
				console.log(event.target.nodeName);
				if(event.target.nodeName !== 'A' && event.target.nodeName !== 'CANVAS'){
					view.hideTweet();
					view.model.set({
						selectedTweet:null
					});
				}
			});
			google.maps.event.addListener(this.model.get('mymap'), 'click', function() {
				view.hideTweet();
				view.model.set({
					selectedTweet:null
				});
			});
			$('body').on('click', function(e){
				// view.hideTweet();
				// view.model.set({
				// 	selectedTweet : null
				// });
			});
			this.template = app.fetchTemplate('app/templates/tweetTemplate', 'tweetTemplate.html');
		},
		goToMarker : function(){
			var xPan = ($('body').width() / 2) - $('#tweetDetails').outerWidth() - 30,
				map = this.model.get('mymap');
			if(map.getZoom() < 10){
				map.setZoom(10);
			}
			map.panTo(this.model.get('selectedTweet').get('marker').getPosition());
			if(!Modernizr.mq('only all and (max-width: 768px)')){
				map.panBy(-xPan, 153);
			}
			this.showTweet();
			// $('body,html').animate({
			//   scrollTop: 150
			// }, 800);
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
				if(t.get('isOnRide')){
					t.set({
						marker : new google.maps.Marker({
							position: new google.maps.LatLng(t.get('geo').coordinates[0], t.get('geo').coordinates[1]),
							map: view.model.get('mymap'),
							draggable: false,
							animation: google.maps.Animation.DROP,
							model : t,
							icon : (t.get('isBiker') && t.get('isOnRide')) ? 'assets/img/bike-icon-blue.png'  : 'assets/img/bike-icon.png'
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
				}
				
			});
		},
		getTemplates : function(){
			this.template = app.fetchTemplate('app/templates/miniLeaderboardTemplate', 'miniLeaderboardTemplate.html');
			this.progressTemplate = app.fetchTemplate('app/templates/showsProgressTemplate', 'showsProgressTemplate.html');
		}
	});
	Views.ProgressBar = Backbone.View.extend({
		// attaches /bin/bash: this.el: command not found to an existing element.
		el: $('#progressArea'),

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
					view.el.find('#progressBar').addClass('active');

					view.el.find('a').removeClass('selected');
					var it = view.el.find('a[data-bbid="'+this.get('selectedTweet').cid+'"]');
					it.addClass('selected');
					if(Modernizr.mq('only all and (max-width: 768px)')){
						view.moveDetails(it);
					}
				}
				else{
					view.el.find('a').removeClass('selected');
					view.el.removeClass('active');
					view.el.find('#progressBar').removeClass('active');
				}
			});
			this.el.on('click', 'a', function(e){
				view.model.set({
					selectedTweet : view.model.get('tweets').get($(this).data('bbid'))
				});
				return false;

			});
		},
		moveDetails : function(marker){
			var top = marker.offset().top;
			$('#mobileDetails').css({
				top : top + 20+'px'
			});
			$('body,html').animate({
			scrollTop: top - 10
			}, 800);
		},
		render : function(){
			this.el.find('#progressBar').html(this.template({ tweets : this.model.get('tweets').toJSON()}));
		}
	});

	Views.Tour = Backbone.View.extend({
		initialize : function(){
			

		}
	});
	
  

  return Views;

});
