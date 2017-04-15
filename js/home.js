var sendJSON = function(jsonData) {
	console.log(jsonData)
        $.ajax({
                type: 'POST',
                url: 'http://raspberrypi:3000/activate',
                dataType: 'json',
                async: true,
                data: jsonData,
                success : function(){
                        alert('success')
                }
        })
}

setInterval( function() {
	var d = new Date()
	$('header .day').text(d.toDateString())
	$('header .time').text(d.toTimeString().substring(0,9))
}, 1000 )

for(var room in map) {
	var name = map[room]["name"]
	var id = map[room]["id"]
	var roomButtons = $('<div>').addClass("room-buttons").attr("id",id).text(name)
	$('.button-panel').append(roomButtons)
	var roomPanels = $('<div>').addClass("room-panel").attr("id",id).hide()
	for(var dev in map[room]["devices"]) {
		var devName = map[room]["devices"][dev]["name"]
		var devID = map[room]["devices"][dev]["id"]
		var devContainer = $('<div>').addClass("dev-cont")
		var devSwitchDiv = $('<div>').addClass("switch").attr("id",devID)
		var devImageDiv = $('<div>').addClass("image").attr("id",devID+"img")
		var devNameDiv = $('<div>').addClass("name").text(devName)
		devContainer.append(devSwitchDiv, devImageDiv, devNameDiv)
		roomPanels.append(devContainer)
	}
	$('.room').append(roomPanels)
}

$('.room-buttons').click(function(){
	var panelID = $(this).attr("id")
	if( panelID == "alarm-button" )
		$('#alarm-panel').toggle('slide', {direction: 'left'}, 500)
	else
		$('#alarm-panel').hide()
	for(var room in map) {
		if( map[room]["id"] == panelID ) {
			$('.room-panel#'+map[room]["id"]).toggle('slide', {direction: 'left'}, 500)
		} else {
			$('.room-panel#'+map[room]["id"]).hide()
		}
	}
})

$('.switch').click(function(){
	var switchID = $(this).attr("id")
	for(var room in map) {
		for(var dev in map[room]["devices"]) {
			if ( switchID == map[room]["devices"][dev]["id"] ) {
				var deviceLocal = map[room]["devices"][dev]["name"]
				var boardLocal = map[room]["board"]
			}
		}
	}
	if( $(this).css("background-position-x") == "-67px" ) {
		$(this).css("background-position-x","0")
		console.log(sendJSON({board:boardLocal,device:deviceLocal,state:"off"}))
		$('#'+$(this).attr("id")+'img').css("background-image","url(images/red-led.png)")
	} else {
		$(this).css("background-position-x","-67px")
		sendJSON({board:boardLocal,device:deviceLocal,state:"on"})
		$('#'+$(this).attr("id")+'img').css("background-image","url(images/green-led.png)")
	}
})