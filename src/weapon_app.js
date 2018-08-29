var url_string = window.location.href;
var url = new URL(url_string);
var hash = url.searchParams.get("hash");
const path = "https://www.bungie.net";

$(function(){
	getWeaponData();
});

function getStatGroup(weapon){
	console.log("Getting stat group")
	$.get('/destiny/' + weapon.stats.statGroupHash + ".sgrp", function(data, status){
		let group = JSON.parse(data.json);
		for (var i = 0; i < group.scaledStats.length; i++) {
			getStats(group.scaledStats[i].statHash, weapon.stats.stats[group.scaledStats[i].statHash].value, group.scaledStats[i].maximumValue, group.scaledStats[i].displayAsNumeric);
		}	
	});
}


function getStats(statHash, value, maxStat, numeric){
	console.log("Getting stat " + statHash)
	$.get('/destiny/' + statHash + ".stat", function(data, status){
		displayStat(JSON.parse(data.json).displayProperties.name, JSON.parse(data.json).displayProperties.description, value, maxStat, numeric);
	});
}

function displayStat(name, desc, value, max, numeric){
	console.log("Displaying " + name)
	$('#stats').append("<p>" + name + ", " + desc + ", " + value + ", " + max + ", " + numeric + ", " + "</p>");
}

function getWeaponData(){
	console.log("Getting weapon data")
	$.get('/destiny/' + hash + ".item", function(data, status){
		displayWeapon(JSON.parse(data.json));
	});
}

function displayWeapon(data){
	console.log("Displaying weapon")
	$('#page').append("<img src='" + path + data.screenshot + "'>");
	getStatGroup(data);
}