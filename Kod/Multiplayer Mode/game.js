var util = require("util"),
    io = require("socket.io"),
    Player = require("./Player").Player;

var socket,
	players;

function init() {
	players = [];
	socket = io.listen(8000);

	socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});

	setEventHandlers();
};

function setEventHandlers() {
	socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
	// util.log will output the string in the terminal window on execute
	util.log("New player has connected: "+client.id);


	client.on("disconnect", onClientDisconnect);
	client.on("new player", onNewPlayer);
	client.on("card move", onCardMove);
}

function onClientDisconnect() {
	// 'this' points to the onSocketConnection client object
	util.log("Player has disconnected: "+this.id);

	var removePlayer = getPlayerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
	var newPlayer = new Player(this.id);
	newPlayer.html = data.html;
	newPlayer.boardID = data.boardID;

	if (players.length <= 2) { // There can only play two people at the same time per game. TODO: Fix multiple game sessions

		// Broadcasts the new players info to all existing players
		this.broadcast.emit("new player", { id: newPlayer.id, html: newPlayer.html, boardID: newPlayer.boardID });

		// Broadcasts the existing players info to the new player
		var existingPlayer;
		for (var i = 0; i < players.length; i++) {
		    existingPlayer = players[i];
		    this.emit("new player", { id: existingPlayer.id, html: existingPlayer.html, boardID: existingPlayer.boardID });
		};

		players.push(newPlayer);

	}
};

function onCardMove(data) {
	this.broadcast.emit("card move", data); // broadcast the changed HTML to other player
};

function getPlayerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};


init();