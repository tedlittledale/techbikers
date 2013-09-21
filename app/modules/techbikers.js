define([
  // Global application context.
  "app",

  // Third-party libraries.
  "backbone",
  "modules/techbikers/views"
],

function(app, Backbone, Views) {
  var Techbikers = app.module();
  Techbikers.Models = {};
  Techbikers.Collections = {};
  Techbikers.RIDESTART = 1379696400000;
  Techbikers.RIDEEND = 1379762059278;
  Techbikers.BIKERS = ["abby_super",
"abechoi",
"eyesnight",
"adi_benari",
"alexwoodcreates",
"alexblogg",
"alexhoye",
"andrewmcdonough",
"andyy",
"tonydenyer",
"axelkatalan",
"barryfurby",
"inthcompanyof",
"bindik",
"CassieRobinson",
"clairecockerton",
"cbm",
"websummithq",
"davidalyoung",
"buro9",
"hailpixel",
"esparraga",
"diane_perlman",
"_superted",
"BuzzBrooke",
"ediggs",
"hannahblake123",
"H4ryB",
"humzamb",
"tuckerian",
"IdoHo30",
"jasontavaria",
"jasonball",
"flexewebs",
"jpvantie",
"johnehenderson",
"johndavis76",
"katejacksonk",
"koomerang",
"laura_scott",
"mario",
"markofrespect",
"martinmignot",
"Mmetternich",
"maya_ross",
"michaelwillmott",
"mgrafham",
"mikeywaites",
"morgansowden",
"nikhilshah",
"pumka",
"bieberstein",
"rhys_isterix",
"richmartell",
"ringomoss",
"sam_strong",
"sebzz",
"scmurphy",
"tomalterman",
"limxinsiang",
"udishitrit",
"willdogg",
"wpdunk",
"yasin_mahmood"
];

  Techbikers.Models.Controller = Backbone.Model.extend({
    defaults : {
        ready : false,
        selectedTweet : null
    },
    url : '/tweetdata/api.json',
    parse :  function(data){
        return data.meta;
    },
    initialize : function(){
        
    },
    increment : function(direction){
        var tweets = this.get('tweets');
        var prev = tweets.at(tweets.indexOf(this.get('selectedTweet'))+direction);
        if(prev){
            this.set({
                selectedTweet : prev
            });
        }
        
    },
    start : function(){
        _.bindAll(this);
        var model = this;
        this.fetch({
            dataType : 'json',
            success : function(data, d){
                model.get('tweets').reset(d.statuses);
                model.get('alltweets').reset(d.statuses);

                model.get('tweets').purge();
                model.set('')
                model.set('ready');
                

            }
        });
    }
});
Techbikers.Models.Map = Backbone.Model.extend({
	defaults: {
		showId : null,
		gender : '',
		ready : false,
		hashRendered : false,
		hashFilter : '',
		userAgent : '',
		verified : '',
		onlyVerified : false,
		currentFilters : [],
		freeSearch : '',
		live : false,
		last_tpm : 0,
		last_count : 0,
		hasFilters : false,
        styles : [

        {
            featureType: "poi",
            stylers: [
              { visibility: "off" }
            ]
          },
          {
            featureType: "road.highway",
            stylers: [
            { hue: "#5ba3b6" },
            { saturation: 1   },
            
            {lightness : 25}
            ]
          },
        {
            featureType: "road.local",
            stylers: [
            { hue: "#11ee69" },
            { saturation: 100 },
            {lightness : -25}
            ]
        },
        {
            featureType: "road.arterial",
            stylers: [
            { hue: "#11ee69" },
            { saturation: 100 },
            {lightness : -25}
            ]
        },
        {
                    featureType: "water",
                    stylers: [
                    { hue: "#5ba3b6" },
                    { saturation: -40 }
                    ]
                }
        ]
	},
	initialize: function(){
		var view = this;
		_.bindAll(this);

	},
});
Techbikers.Models.Tweet = Backbone.Model.extend({
	defaults: {
        isFirst : false,
        isLast : false
	},
	getDistanceFromLatLonInKm : function(lat1,lon1,lat2,lon2) {
		var PARIS = 342.2521718066369, PARISROUTE = 450;
		function deg2rad(deg) {
			return deg * (Math.PI/180);
		}
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2-lat1);  // deg2rad below
		var dLon = deg2rad(lon2-lon1);
		var a =
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon/2) * Math.sin(dLon/2)
		;
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c; // Distance in km
		var percentHome = (PARIS - d) / PARIS;
		this.set({
			distanceToHome : d,
            estimateHome : PARISROUTE * (1 -percentHome),
			percentHome : percentHome * 100
		});
	},
    checkForMedia : function(){
        var TwitterData = this.toJSON();
            root = TwitterData.retweet ? TwitterData.retweet : TwitterData;
        if(root.media && root.media[0].type === "photo"){
            this.set({
                hasMedia : true,
                mediaUrl : root.media[0].media_url
            });
        }
       
    },
    checkForMediaEntities : function(){
        var TwitterData = this.toJSON();
        if(TwitterData.entities.media){
            this.set({
                hasMedia : true,
                mediaUrl : TwitterData.entities.media[0].media_url_https
            });
        }
    },
    checkIsBiker : function(){
        var thisHandle = this.get('user').screen_name;
        var biker = _.find(Techbikers.BIKERS, function(handle){
            return thisHandle.toLowerCase() === handle.toLowerCase();
        });
        if(biker){
            console.log(new Date(this.get('timestamp')) , new Date(Techbikers.RIDESTART));
            this.set({
                isBiker : true,
                isOnRide : (this.get('timestamp') > Techbikers.RIDESTART) && (this.get('timestamp') < Techbikers.RIDEEND)
            });
        }
        else{
            console.log('notbiker');
        }
    },
	initialize: function(){
		var view = this;
		_.bindAll(this);
		if(this.get('geo')){
            this.set({
                timestamp : (new Date(this.get('created_at'))).getTime()
            });
			this.getDistanceFromLatLonInKm(51.522696, -0.085498, this.get('geo').coordinates[0], this.get('geo').coordinates[1]);
            this.checkForMediaEntities();
            this.checkIsBiker();
		}
		this.set({
			cid : this.cid
		});
	},
});
  
  Techbikers.Collections.Tweets = Backbone.Collection.extend({
	model : Techbikers.Models.Tweet,
    comparator : function(t){
        return t.distanceToHome;
    },
	purge : function(){
		var collection = this, counter = 0, counter2 = 0;
		var toRemove = this.filter(function(t){
			return (!t.get('percentHome') || t.get('percentHome') < 0);
		});
		
		_.each(toRemove, function(t){
			collection.remove(t);
		});
        collection.at(0).set({
            isLast : true
        });
        collection.at(collection.length-1).set({
            isFirst : true
        });
	}
  });

  Techbikers.Views = Views;

  return Techbikers;
});
