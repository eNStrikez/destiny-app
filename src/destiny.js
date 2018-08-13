var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime');
var Traveler = require('the-traveler').default;
const Enums = require('the-traveler/build/enums');
const destinyPath = "/destiny/";

const traveler = new Traveler({
    apikey: '8772b2e2b07b465e9ce39bd9b51184f6',
    userAgent: 'eNStrikez%232333'
});

var profilesType = Enums.ComponentType.Profiles;

http.createServer(function (req, res) {
  	var q = url.parse(req.url, true);
  	console.log(q.pathname);
  	if (q.pathname.startsWith(destinyPath)) {
  		var name = q.pathname.slice(destinyPath.length, -4);
  		console.log("searching for player " + name);
		traveler.searchDestinyPlayer('-1', name).then(player => {
			res.writeHead(200, {'Content-Type': 'text/json'});
			res.write(JSON.stringify(player));
			return res.end();
		}).catch(err => {
			return res.end("Error: " + err);
		});	
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