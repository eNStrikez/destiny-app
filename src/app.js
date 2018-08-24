class Player {
	constructor(id) {
		this._id = id;
		this.character = [0, 0, 0];
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get data() {
		return this._data;
	}

	get profile() {
		return this._profile;
	}

	get character() {
		return this._character;
	}

	set id(id){
		this._id = id;
	}

	set data(data){
		this._data = data;
		this._name = data.displayName;
	}

	set profile(profile){
		this._profile = profile;
	}

	set character(character){
		this._character = character;
	}

	setCharacter(index, character){
		this._character[index] = character;
	}
}


var id = 0;
var players = [];
const path = "https://www.bungie.net";


$(function(){
	$('#flip').on('click', function(){
		$("#panel").slideToggle("slow");
	});

	$('#text_input').on('focus', function(){
		$(this).animate({width: '100%'}, "slow");
	});

	$('#text_input').on('blur', function(){
		$(this).animate({width: '20%'}, "slow");
	});

	$('#player_button').on('click', function(event){
		event.preventDefault();
		var input = $('#text_input').val().replace("#", "%23");
		$.get('/destiny/' + input + ".pla", function(data, status){
			if (data.ErrorCode == 1)
				if (typeof data.Response[0] != 'undefined'){
					let player = new Player(id);
					player.data = data.Response[0];
					players[id] = player;
					addPlayer(player.data);
				} else {
					players[id] = "Player not found";
				}
		});
	});
});

function getProfile(type, memberID){
	let input = type + "." + memberID;
	$.get('/destiny/' + input + ".pro", function(data, status){
		addProfile(type, memberID, data);
	});
}

function getCharacter(type, memberID, characterID, currentID){
	let input = type + "." + memberID + "." + characterID;
	$.get('/destiny/' + input + ".chr", function(data, status){
		addCharacter(data, currentID);
	});
}

function getItem(itemHash, currentID){
	$.get('/destiny/' + itemHash + ".item", function(data, status){
		addItem(JSON.parse(data.json), currentID);
	});
}

var initButton = function(){ 
	$('#del_button' + id).on('click', function() {
		$(this).parent().animate({
			paddingLeft: '+=100',
			opacity: 0.0
		}, 500, function(){
			$(this).remove();
		});
	});
};

	

var initData = function(){
	$("li").hover(function(){
		$(this).find('.data').each(function(){
			$(this).stop().show(1000);
		});
		$(this).find('.del_button').each(function(){
			$(this).stop().show(1000);
		});
	},
	function(){    
	    $(this).find('.data').each(function(){
			$(this).stop().hide(1000);
		});
		$(this).find('.del_button').each(function(){
			$(this).stop().hide(1000);
		});
	});
};

var addPlayer = function(data){
	let name = '<p>' + data.displayName + '</p>';
	let type = '<p class="data" id="data' + id + '">' + data.membershipType + '</p>';
	let memberId = '<p class="data" id="data' + id + '">' + data.membershipId + '</p>';
	$('ul').append('<li><div id="player">' + name + type + memberId + '<button class="del_button" id="del_button' + id + '"><ion-icon id="icon" name="close"></ion-icon></button></div></li>');
	initButton();
	getProfile(data.membershipType, data.membershipId);
};

var addProfile = function(type, memberID, data){
	players[id].profile = data.Response;
	let lastPlayed = '<div id="profile"><p class="data" id="data' + id + '">' + data.Response.profile.data.dateLastPlayed + '</p></div>';
	$('#del_button' + id).before(lastPlayed);
	for (let i = 0; i < data.Response.profile.data.characterIds.length; i++) {
		getCharacter(type, memberID, data.Response.profile.data.characterIds[i], id.valueOf());
	}
	id++;
};

var addCharacter = function(data, currentID){
	var index = 0;
	if (players[currentID].character[data.Response.character.data.classType] == 0) {
		players[currentID].setCharacter(data.Response.character.data.classType, data);
		index = data.Response.character.data.classType;
	} else { 
		let n = 0;
		while (players[currentID].character[n] == 0) {
			n++;
		}
		players[currentID].setCharacter(n, data);
		index = n;
	}
	var dClass = "";
	switch(data.Response.character.data.classType){
		case 0: dClass = "Titan";
			break;
		case 1: dClass = "Hunter";
			break;
		case 2: dClass = "Warlock";
			break;
		default: dClass = "Unknown";
	}

	var ll = data.Response.character.data.light;
	$.get('/destiny/' + data.Response.character.data.emblemHash + ".item", function(data, status){
		var emblemData = JSON.parse(data.json);
		var emblem = img(path + emblemData.secondaryOverlay);
		$('#del_button' + currentID).before('<div id="character' + index + '"><p class="data" id="data' + currentID + '">' + emblem + dClass + " " + ll + '</p></div>');
		$("#character" + index).css("background-image", 'url(' + path + emblemData.secondarySpecial + ')');
	});

	var equipment = data.Response.equipment.data.items;
	//for (var i = 0; i < equipment.length; i++) {
	//	getItem(equipment[i].itemHash, currentID);
	//}	
	initData();
};

var addItem = function(data, currentID){
	var name = data.displayProperties.name;
	var desc = data.displayProperties.description;
	var icon = img(path + data.displayProperties.icon);
	var back = img(path + data.screenshot);
	//$('#del_button' + currentID).before('<div id="item"><p class="data" id="data' + id + '">' + icon + name + " " + desc + '</p></div>');
	initData();
}

function img(str){
	return emblem = "<img src='" + str + "'>";
}
