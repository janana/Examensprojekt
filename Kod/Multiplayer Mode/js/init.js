$(document).ready(function() {
	var socket = io.connect("http://localhost", {port: 8000}),
		remotePlayers = [],
		localPlayer = new Player("0");


	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("remove player", onRemovePlayer);
	socket.on("card move", onCardMove);


	function initCards() {
		var deck = Deck.create();
		// Add the card HTML to page
		
		// The playable cards
		$("#board-"+localPlayer.id+" .empty").each(function(index, obj) {
			$(obj).append(deck[index].HTML);
		});

		var cardHTML = "", thirteenHTML = "";
		for (var j = 4; j < 16; j++) {
			thirteenHTML += deck[j].HTML;
		}
		for (var i = 16; i < deck.length; i++) {
			cardHTML += deck[i].HTML;
		}
		
		$("#board-"+localPlayer.id+" .pile-thirteen").append(thirteenHTML);
		$("#board-"+localPlayer.id+" .pile-thirteen .card").addClass("turned");
		$("#board-"+localPlayer.id+" .pile-thirteen").children().each(function(index, obj) {
			$(obj).css({
				top: index * 12 -1 +"px"
			})
		});
		$("#board-"+localPlayer.id+" .pile-thirteen").children().last().removeClass("turned");
		
		$("#board-"+localPlayer.id+" .pile").append(cardHTML);
		$("#board-"+localPlayer.id+" .pile .card").addClass("turned");
	};


	function onSocketConnected() {
		console.log("Connected to socket server: "+socket.socket.sessionid);
		localPlayer.id = socket.socket.sessionid;
		console.log(socket);
		var color = "red";

		Board.init(socket, localPlayer.id, color);
		initCards();

		console.log("local player board ID: "+localPlayer.id);
		var html = $("#board-"+localPlayer.id+".board").html();

		// Make the cards draggable
		Deck.draggable(socket, localPlayer.id);
		Deck.doubleClickable(localPlayer.id);
		Deck.resetTurnedCards();

		socket.emit("new player", {id: socket.socket.sessionid, html: html });
		socket.emit("move card", { html: html, id: localPlayer.id });
	};

	function onSocketDisconnect() {
		console.log("Disconnected from socket server");
	};

	function onNewPlayer(data) {
		console.log("New player connected: "+data.id);
	

		var newPlayer = new Player(data.id);
		newPlayer.html = data.html;
		remotePlayers.push(newPlayer);

		console.log("Players now connected: "+(+remotePlayers.length+1));
		
		// GET THE OTHER PLAYERS BOARD
		$("#container").append("<div id='board-"+data.id+"' class='board'>"+data.html+"</div>");
		Deck.resetTurnedCards();
	};

	function onRemovePlayer(data) {
		var removePlayer = getPlayerById(data.id);

		// Player not found
		if (!removePlayer) {
			console.log("Player not found: "+data.id);
			return;
		};

		// Remove player from array
		remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
		$("#board-"+data.id).remove();

		// remove the board from other players html
		socket.emit("remove board", data.id);
		console.log("Player has disconnected: "+data.id);
	};

	function onCardMove(data) {
		var p = getPlayerById(data.id);
		p.html = data.html;
		$("#board-"+data.id).html(data.html);
	};

	function getPlayerById(id) {
		for (var i = 0; i < remotePlayers.length; i++) {
			if (remotePlayers[i].id == id)
				return remotePlayers[i];
		};

		return false;
	};


});