var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime');
var path = require('path');

var Traveler = require('the-traveler').default;
const Enums = require('the-traveler/build/enums');
const destinyPath = "/destiny/";

const traveler = new Traveler({
    apikey: '8772b2e2b07b465e9ce39bd9b51184f6',
    userAgent: 'eNStrikez%232333'
});

http.createServer(function (req, res) {
  	var q = url.parse(req.url, true);
  	console.log(q.pathname);
  	if (q.pathname.startsWith(destinyPath)) {
  		console.log(path.extname(q.pathname));
  		if (path.extname(q.pathname) == '.pla') {
	  		var name = q.pathname.slice(destinyPath.length, -4);
	  		console.log("searching for player " + name);
			traveler.searchDestinyPlayer('-1', name).then(player => {
				res.writeHead(200, {'Content-Type': 'text/json'});
				res.write(JSON.stringify(player));
				return res.end();
			}).catch(err => {
				return res.end("Error: " + err);
			});
		} else if (path.extname(q.pathname) == '.pro') {
			var link = q.pathname.slice(destinyPath.length, -4).split('.');
			var type = link[0];
			var id = link[1];
	  		console.log("searching for profile of player " + id);
			traveler.getProfile(type, id, { components: ['100', '101', '102', '103', '104'] }).then(player => {
				res.writeHead(200, {'Content-Type': 'text/json'});
				res.write(JSON.stringify(player));
				return res.end();
			}).catch(err => {
				return res.end("Error: " + err);
			});
		} else if (path.extname(q.pathname) == '.chr') {
			var link = q.pathname.slice(destinyPath.length, -4).split('.');
			var type = link[0];
			var id = link[1];
			var chrID = link[2];
	  		console.log("searching for character " + chrID + " of player " + id);
			traveler.getCharacter(type, id, chrID, { components: ['200', '201', '202', '203', '204', '205'] }).then(player => {
				res.writeHead(200, {'Content-Type': 'text/json'});
				res.write(JSON.stringify(player));
				return res.end();
			}).catch(err => {
				return res.end("Error: " + err);
			});
		}
  	} else {
	  	var filename = "." + q.pathname;
	  	fs.readFile(filename, function(err, data) {
		    if (err) {
		      	res.writeHead(404, {'Content-Type': 'text/html'});
		      	return res.end("404: " + filename + " Not Found");
		    }
		    res.writeHead(200, {'Content-Type': mime.getType(filename)});
		    res.write(data);
		    return res.end();
		});
  	}
}).listen(8080);