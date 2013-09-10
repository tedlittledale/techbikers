Handlebars.registerHelper('normaliseTwitterData', function(twitter, options) {
  var normalised = {
	name : null,
	handle : null,
	text : null,
	created_at : null,
	retweet : false,
	retweeter : null,
	followers : null
  };
  if(twitter.user) {
	normalised.name = twitter.user.name;
	normalised.handle = twitter.user.screen_name;
	normalised.text = twitter.text;
	normalised.created_at = twitter.created_at;
	normalised.followers = twitter.user.followers_count;
  }
  else{
	normalised.retweet = true;
	normalised.name = twitter.retweeted.user.name;
	normalised.handle = twitter.retweeted.user.screen_name;
	normalised.text = twitter.retweet.text;
	normalised.created_at = twitter.retweeted	.created_at;
	normalised.followers = twitter.retweeted.user.followers_count;
	normalised.retweeter = {
		name : twitter.retweet.user.name,
		screen_name : twitter.retweet.user.screen_name
	};
  }
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    
  normalised.text = normalised.text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
  normalised.followers += "";
	if(normalised.followers.length === 4){
		normalised.followers =  normalised.followers.substring(0,1)+','+normalised.followers.substring(1,4);
	}
	else if(normalised.followers.length === 5){
		normalised.followers =  normalised.followers.substring(0,2)+','+normalised.followers.substring(2,5);
	}
	else if(normalised.followers.length === 6){
		normalised.followers =  normalised.followers.substring(0,3)+','+normalised.followers.substring(3,6);
	}
	else if(normalised.followers.length === 7){
		normalised.followers =  normalised.followers.substring(0,1)+','+normalised.followers.substring(1,4)+','+normalised.followers.substring(4,8);
	}
	else if(normalised.followers === 'undefined'){
		normalised.followers = 0;
	}
  return options.fn(normalised);
});
Handlebars.registerHelper('verified', function(twitter, options) {
	if(twitter.user && twitter.user.verified === true){
		return 'verified';
	}
	if(twitter.retweeted && twitter.retweeted.user.verified === true){
		return 'verified';
	}
	return '';
});
Handlebars.registerHelper("reallinks", function(txt) {

    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    
    return text.replace(exp,"<a href='$1'>$1</a>");


});
Handlebars.registerHelper("each_with_index", function(array, fn) {
	var buffer = "";
	for (var i = 0, j = array.length; i < j; i++) {
		var item = array[i];

		// stick an index property onto the item, starting with 1, may make configurable later
		item.index = i+1;
		if(item.index === 1){
			item.isFirst = true;
		}
		if(item.index === j-i){
			item.isLast = true;
		}
		// show the inside of the block
		buffer += fn(item);
	}

	// return the finished buffer
	return buffer;

});
Handlebars.registerHelper("spanList", function(array, fn) {
	var arr = [];
	for(var i = 0, l = array.length; i < l; i++){
		arr[i] = "<span>"+array[i]+"</span>";
	}
	// return the finished buffer
	return arr.join(' ');

});
Handlebars.registerHelper("normalList", function(array, fn) {
	// return the finished buffer
	return array.join(',');

});
Handlebars.registerHelper("sparkList", function(array, fn) {
	// return the finished buffer
	array = _.sortBy(array, function(d){ return d.time; });
	var list = [];
	for(var i = 0, l = array.length; i < l; i++){
		list.push(array[i].count);
	}
	return list.join(',');
});
Handlebars.registerHelper("sparkWidth", function(array, fn) {
	// return the finished buffer
	return (120/array.length);
});
Handlebars.registerHelper("arrLength", function(array, fn) {
	// return the finished buffer
	return (array.length);
});
Handlebars.registerHelper("first", function(array, fn) {
	// return the finished buffer
	if (array && array.length !== 0) {
		return array[0];
	};
	return 0;
});
Handlebars.registerHelper("useragentMap", function(name, fn) {
	// return the finished buffer
	if(name === 'web'){
		return 'Twitter.com (desktop)';
	}
	else if(name === 'txt'){
		return 'SMS';
	}
	else if(name === 'Mobile Web'){
		return 'Twitter.com (mobile)';
	}
	return name;

});
Handlebars.registerHelper("twosf", function(pos, fn) {
	// return the finished buffer
	var position = pos+"";
	if(position.length === 1){
		return "0"+position;
	}
	else{
		return position;
	}

});
Handlebars.registerHelper("niceTime", function(timeString, fn) {
	var thisDate = new Date(Date.parse(timeString)),
		hours = thisDate.getHours() % 12,
		mins = thisDate.getMinutes(),
		leadingZero = (mins < 10) ? '0' : '',
		amPm = (thisDate.getHours() < 12) ? 'am' : 'pm';
		if(hours === 0){
			hours = 12;
		}
	return hours+':'+leadingZero+mins+amPm;

});
Handlebars.registerHelper("twentyFour", function(timeString, fn) {
	var thisDate = new Date(timeString),
		hours = thisDate.getHours(),
		mins = thisDate.getMinutes(),
		leadingZero = (mins < 10) ? '0' : '';
	return hours+':'+leadingZero+mins;

});
Handlebars.registerHelper("showTitle", function(episode, fn) {
	if(episode.series.title == episode.title){
		return episode.title;
	}
	else{
		return episode.series.title + ' - ' + episode.title;
	}
	

});
Handlebars.registerHelper("episodeIfNeeded", function(episode, fn) {
	if(episode.series.title == episode.title){
		return '';
	}
	else{
		return episode.title+' <span class="thinBar">|</span> ';
	}
	

});
Handlebars.registerHelper("threedp", function(sentiment, fn) {

	return	(Math.round(sentiment * 1000) / 1000);

});
Handlebars.registerHelper("twodp", function(sentiment, fn) {

	return	(Math.round(sentiment * 100) / 100);

});
Handlebars.registerHelper("percentage", function(decimal, fn) {
	var n = (Math.round(decimal * 1000)/10)+'';
	// if(n.indexOf('.') === -1){
	// 	n += '.0';
	// }
	return	n+'<span class="pct">%</span>';

});
Handlebars.registerHelper("twodppercentage", function(decimal, fn) {

	return	(Math.round(decimal * 10000) / 100)+'<span class="pct">%</span>';

});
Handlebars.registerHelper("thumbsup", function(sentiment, fn) {
	var icon = '<span class="neutral"><i class="icon-thumbs-up"></i> <i class="icon-thumbs-down"></i></span>';
	if(sentiment > 0.2){
		icon =  '<i class="icon-thumbs-up"></i>';
	}
	else if(sentiment < -0.2){
		icon =  '<i class="icon-thumbs-down"></i>';
	}
	return icon;

});
Handlebars.registerHelper("niceDate", function(timeString, fn) {
	var thisDate = new Date(Date.parse(timeString));
	return thisDate.toDateString();

});
Handlebars.registerHelper("niceDateShort", function(timeString, fn) {
	var thisDate = new Date(Date.parse(timeString));
	thisDate = thisDate.toDateString().split(' ');
	return thisDate[0] + " " + thisDate[2] + " " + thisDate[1] + " " + thisDate[3];

});
Handlebars.registerHelper("niceDateSafe", function(timeString, fn) {
	var thisDate = new Date(timeString);
	return thisDate.toDateString().replace(/\s/g, '-');

});
Handlebars.registerHelper("safeTitle", function(titleString, fn) {
	return encodeURI(titleString.replace(/\s/g, '-'));

});
Handlebars.registerHelper("statSize", function(tweets, fn) {
	tweets = Math.round(tweets)+"";
	if(tweets.length < 4){
		return "";
	}
	else if(tweets.length < 5){
		return "four";
	}
	else if(tweets.length < 6){
		return "five";
	}
	else if(tweets.length < 7){
		return "six";
	}
	else if(tweets.length < 8){
		return "seven";
	}
	else{
		return "eight";
	}
});
Handlebars.registerHelper("niceCount", function(tweets, fn) {
	if(typeof(tweets) === 'undefined'){
		return 0;
	}
	tweets = Math.round(tweets)+"";
	
	if(tweets.length < 4){
		return tweets;
	}
	else if(tweets.length < 5){
		return tweets.substring(0,1)+','+tweets.substring(1,4);
	}
	else if(tweets.length < 6){
		return tweets.substring(0,2)+','+tweets.substring(2,5);
	}
	else if(tweets.length < 7){
		return tweets.substring(0,3)+','+tweets.substring(3,6);
	}
	else if(tweets.length < 8){
		return tweets.substring(0,1)+','+tweets.substring(1,4)+','+tweets.substring(4,8);
	}
	else if(tweets.length < 9){
		return tweets.substring(0,2)+','+tweets.substring(2,5)+','+tweets.substring(5,9);
	}
	else if(tweets.length < 10){
		return tweets.substring(0,3)+','+tweets.substring(3,6)+','+tweets.substring(6,10);
	}
	return tweets;
});
Handlebars.registerHelper("niceCountReach", function(tweets, fn) {
	tweets = tweets+"";
	if(tweets.length < 4){
		return tweets;
	}
	else if(tweets.length < 5){
		return tweets.substring(0,1)+','+tweets.substring(1,4);
	}
	else if(tweets.length < 6){
		return tweets.substring(0,2)+','+tweets.substring(2,5);
	}
	else if(tweets.length < 7){
		return tweets.substring(0,3)+','+tweets.substring(3,6);
	}
	else{
		var n = (Math.round(parseInt(tweets.substring(0,tweets.length - 4), 10)/10)/10)+'';
		if(n.indexOf('.') === -1){
			n += '.0';
		}
		return n+'M';
	}
});
Handlebars.registerHelper("niceTimeMinus30", function(timeString, fn) {
	var thisDate = new Date(timeString+'.000Z');
	thisDate.setTime(thisDate.getTime() - 1800000);
	var	hours = thisDate.getHours() % 12,
		mins = thisDate.getMinutes(),
		leadingZero = (mins < 10) ? '0' : '',
		amPm = (thisDate.getHours() < 12) ? 'am' : 'pm';
		if(hours === 0){
			hours = 12;
		}
	return hours+':'+leadingZero+mins+amPm;

});
Handlebars.registerHelper("niceTimePlus30", function(timeString, fn) {
	var thisDate = new Date(timeString+'.000Z');
	thisDate.setTime(thisDate.getTime() + 1800000);
	var	hours = thisDate.getHours() % 12,
		mins = thisDate.getMinutes(),
		leadingZero = (mins < 10) ? '0' : '',
		amPm = (thisDate.getHours() < 12) ? 'am' : 'pm';
		if(hours === 0){
			hours = 12;
		}
	return hours+':'+leadingZero+mins+amPm;

});