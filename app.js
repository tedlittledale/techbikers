/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http');

var request = require('request'),
	username = "teddemo",
	password = "demo",
	auth = "Basic " + new Buffer(username + ":" + password).toString("base64"),
	APIROOT = 'http://bbc-live.secondsync.com';

var app = require('express').createServer();

app.get("/", function(req, res) {
  res.redirect("/index.html");
});

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.static(__dirname+'/'));
  app.use(express.errorHandler({
	dumpExceptions: true,
	showStack: true
  }));
  app.use(app.router);
});
app.get('/', function(req, res) {

	res.render('index.html');
});
app.get('/api/v1/', function(req, res) {

	console.log('test');
	request(
		{
			url : APIROOT+'/api/v1/?format=json',
			headers : {
				"Authorization" : auth
			}
		},
		function (error, response, body) {
			res.send(body);
		}
	);
});
app.get('/api/v1/transmission/*', function(req, res){
	console.log('test2');
	console.log(req.url);
	request(
		{
			url : APIROOT+req.url,
			headers : {
				"Authorization" : auth
			}
		},
		function (error, response, body) {
			res.send(body);
		}
	);
});
app.get('/api/v1/session/*', function(req, res){
	console.log('session');
	console.log(req.url);
	request(
		{
			url : APIROOT+req.url,
			headers : {
				"Authorization" : auth
			}
		},
		function (error, response, body) {
			console.log(error);
			console.log(response);
			console.log(body);
			res.send(body);
			//res.send(400, 'Sorry, we cannot find that!');
		}
	);
});
app.get('/api/v1/session/', function(req, res){
	console.log('session');
	console.log(req.url);
	request(
		{
			url : APIROOT+req.url,
			headers : {
				"Authorization" : auth
			}
		},
		function (error, response, body) {
			console.log(error);
			console.log(response);
			console.log(body);
			res.send(body);
		}
	);
});

app.get('/api/v1/tweet/*', function(req, res){
	console.log('test2');
	console.log(req.url);
	request(
		{
			url : APIROOT+req.url,
			headers : {
				"Authorization" : auth
			}
		},
		function (error, response, body) {
			res.send(body);
		}
	);
});
app.post('/api/v1/session/*', function(req, res){

			//res.send(400, 'Sorry, we cannot find that!');
	res.send('');
});
app.listen(3030);
