let http = require('http');
let fs = require('fs');
let url = require('url');
let mime = require('mime');
let path = require('path');
let sqlite = require('sqlite3').verbose();

let Traveler = require('the-traveler').default;
let Manifest = require('the-traveler/build/Manifest');
const Enums = require('the-traveler/build/enums');
const destinyPath = "/destiny/";

const traveler = new Traveler({
    apikey: '8772b2e2b07b465e9ce39bd9b51184f6',
    userAgent: 'eNStrikez%232333'
});
let db = new sqlite.Database('./manifest.content');


traveler.getDestinyManifest().then(result => {
    traveler.downloadManifest(result.Response.mobileWorldContentPaths.en, './manifest.content').then(filepath => {
        console.log(filepath);
        db = new sqlite.Database(filepath);
		console.log("Manifest loaded");
    }).catch(err => {
        console.log(err);
    })
})

http.createServer(function (req, res) {
  	let q = url.parse(req.url, true);
  	let extLength = path.extname(q.pathname).length;
  	if (q.pathname.startsWith(destinyPath)) {
  		if (path.extname(q.pathname) == '.pla') {
	  		let name = q.pathname.slice(destinyPath.length, -extLength);
	  		//console.log("searching for player " + name);
			traveler.searchDestinyPlayer('-1', name).then(player => {
				res.writeHead(200, {'Content-Type': 'text/json'});
				res.write(JSON.stringify(player));
				return res.end();
			}).catch(err => {
				return res.end("Error: " + err);
			});
		} else if (path.extname(q.pathname) == '.pro') {
			let link = q.pathname.slice(destinyPath.length, -extLength).split('.');
			let type = link[0];
			let id = link[1];
	  		//console.log("searching for profile of player " + id);
			traveler.getProfile(type, id, { components: ['100', '101', '102', '103', '104'] }).then(player => {
				res.writeHead(200, {'Content-Type': 'text/json'});
				res.write(JSON.stringify(player));
				return res.end();
			}).catch(err => {
				return res.end("Error: " + err);
			});
		} else if (path.extname(q.pathname) == '.chr') {
			let link = q.pathname.slice(destinyPath.length, -extLength).split('.');
			let type = link[0];
			let id = link[1];
			let chrID = link[2];
	  		//console.log("searching for character " + chrID + " of player " + id);
			traveler.getCharacter(type, id, chrID, { components: ['200', '201', '202', '203', '204', '205'] }).then(player => {
				res.writeHead(200, {'Content-Type': 'text/json'});
				res.write(JSON.stringify(player));
				return res.end();
			}).catch(err => {
				return res.end("Error: " + err);
			});
		} else if (path.extname(q.pathname) == '.item') {
			let hash = q.pathname.slice(destinyPath.length, -extLength).split('.')[0];
			//console.log("searching for item " + hash);
			res.writeHead(200, {'Content-Type': 'text/json'});
			db.serialize(function(){
				let query = "SELECT json FROM DestinyInventoryItemDefinition WHERE id + 4294967296 = " + hash + " OR id = " + hash;
				db.each(query, function(err, row){
					if(err) console.log("Error: " + err);
					res.write(JSON.stringify(row));
					return res.end();
				});
			});
		} else if (path.extname(q.pathname) == '.stat') {
			let hash = q.pathname.slice(destinyPath.length, -extLength).split('.')[0];
			//console.log("searching for stat " + hash);
			res.writeHead(200, {'Content-Type': 'text/json'});
			db.serialize(function(){
				let query = "SELECT json FROM DestinyStatDefinition WHERE id + 4294967296 = " + hash + " OR id = " + hash;
				db.each(query, function(err, row){
					if(err) console.log("Error: " + err);
					res.write(JSON.stringify(row));
					return res.end();
				});
			});
		} else if (path.extname(q.pathname) == '.sgrp') {
			let hash = q.pathname.slice(destinyPath.length, -extLength).split('.')[0];
			//console.log("searching for stat group " + hash);
			res.writeHead(200, {'Content-Type': 'text/json'});
			db.serialize(function(){
				let query = "SELECT json FROM DestinyStatGroupDefinition WHERE id + 4294967296 = " + hash + " OR id = " + hash;
				db.each(query, function(err, row){
					if(err) console.log("Error: " + err);
					res.write(JSON.stringify(row));
					return res.end();
				});
			});
		}
  	} else {
	  	let filename = "." + q.pathname;
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