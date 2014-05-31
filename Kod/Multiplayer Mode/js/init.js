$(document).ready(function() {
	var socket = io.connect("http://localhost", {port: 8000}),
		remotePlayers = [],
		localPlayer = new Player("0");


	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("remove player", onRemovePlayer);
	socket.on("card move", onCardMove);


	function initCards(boardID) {
		var deck = Deck.create();
		// Add the card HTML to page
		
		// The playable cards
		$("#board-"+boardID+" .empty").each(function(index, obj) {
			$(obj).append(deck[index].HTML);
		});

		var cardHTML = "", thirteenHTML = "";
		for (var j = 4; j < 16; j++) {
			thirteenHTML += deck[j].HTML;
		}
		for (var i = 16; i < deck.length; i++) {
			cardHTML += deck[i].HTML;
		}
		
		$("#board-"+boardID+" .pile-thirteen").append(thirteenHTML);
		$("#board-"+boardID+" .pile-thirteen .card").addClass("turned");
		$("#board-"+boardID+" .pile-thirteen").children().each(function(index, obj) {
			$(obj).css({
				top: index * 12 -1 +"px"
			})
		});
		$("#board-"+boardID+" .pile-thirteen").children().last().removeClass("turned");
		
		$("#board-"+boardID+" .pile").append(cardHTML);
		$("#board-"+boardID+" .pile .card").addClass("turned");
	};


	var boardID = Board.init(socket);
	initCards(boardID);

	var html = $("#board-"+boardID+".board").html();
	socket.emit("move card", { html: html, boardID: boardID });

	// Make the cards draggable
	Deck.draggable(socket, boardID);
	Deck.doubleClickable(boardID);
	Deck.resetTurnedCards(boardID);



	function onSocketConnected() {
		console.log("Connected to socket server");

		socket.emit("new player", {id: localPlayer.id, html: html, boardID: boardID });
	};

	function onSocketDisconnect() {
		console.log("Disconnected from socket server");
	};

	function onNewPlayer(data) {
		console.log("New player connected: "+data.id);

		var newPlayer = new Player(data.id);
		remotePlayers.push(newPlayer);

		// GET THE OTHER PLAYERS BOARD
		$("#container").append("<div id='"+data.boardID+"' class='board'>"+data.html+"</div>");
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
		$(data.boardID).remove();
		console.log("Player has disconnected: "+data.id);
	};

	function onCardMove(data) {
		$("#board-"+data.boardID).html(data.html);
	};


	function getPlayerById(id) {
		for (var i = 0; i < remotePlayers.length; i++) {
			if (remotePlayers[i].id == id)
				return remotePlayers[i];
		};

		return false;
	};


});