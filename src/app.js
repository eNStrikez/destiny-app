var id = 0;
var players = [];

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
					players[id] = data;
					addItem(players[id].Response[0].displayName);
				} else {
					alert("Player not found");
				}
		});
	});

	

});

var initButton = function(id){ 
	$('#del_button' + id).on('click', function() {
		console.log('clicked');
		$(this).parent().animate({
			paddingLeft: '+=100',
			opacity: 0.0
		}, 500, function(){
			$(this).remove();
		});
	});

	$("li").hover(function(){
		$(this).animate({padding: '40px 16px'}, "slow");
	},
	function(){
	    $(this).animate({padding: '10px 16px'}, "slow");
	});
};

var addItem = function(data){
	$('ul').append('<li>' + data + '<button class="del_button" id="del_button' + id + '"><ion-icon id="icon" name="close"></ion-icon></button> </li>');
	initButton(id);
	id++;
}