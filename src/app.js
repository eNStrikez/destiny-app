var id = 0;
var players = [];
const path = "https://www.bungie.net"

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
			console.log("callback 1")
			if (data.ErrorCode == 1)
				if (typeof data.Response[0] != 'undefined'){
					players[id] = data;
					addItem(players[id]);
				} else {
					players[id] = "Player not found";
				}
		});
	});
});

function getProfile(type, memberID){
	var input = type + "." + memberID;
	$.get('/destiny/' + input + ".pro", function(data, status){
		addProfile(type, memberID, data);
	});
}

function getCharacter(type, memberID, characterID, currentID){

	var input = type + "." + memberID + "." + characterID;
	$.get('/destiny/' + input + ".chr", function(data, status){
		addCharacter(data, currentID);
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

var addItem = function(data){
	var name = '<p>' + data.Response[0].displayName + '</p>';
	var type = '<p class="data" id="data' + id + '">' + data.Response[0].membershipType + '</p>';
	var memberId = '<p class="data" id="data' + id + '">' + data.Response[0].membershipId + '</p>';
	$('ul').append('<li>' + name + type + memberId + '<button class="del_button" id="del_button' + id + '"><ion-icon id="icon" name="close"></ion-icon></button></li>');
	initButton();
	getProfile(data.Response[0].membershipType, data.Response[0].membershipId);
};

var addProfile = function(type, memberID, data){
	var lastPlayed = '<p class="data" id="data' + id + '">' + data.Response.profile.data.dateLastPlayed + '</p>';
	$('#del_button' + id).before(lastPlayed);
	for (var i = 0; i < data.Response.profile.data.characterIds.length; i++) {
		getCharacter(type, memberID, data.Response.profile.data.characterIds[i], id.valueOf());
	}
	id++;
};

var addCharacter = function(data, currentID){
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

	var emblem = "<img src='" + path + data.Response.character.data.emblemPath + "'>";
	var ll = data.Response.character.data.light;

	var equipment = data.Response.equipment.data.items;
	console.log(equipment);

	$('#del_button' + currentID).before('<p class="data" id="data' + id + '">' + emblem + dClass + " " + ll + '</p>');
	initData();
};