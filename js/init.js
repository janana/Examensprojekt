$(document).ready(function() {
	Board.init();

	var deck = Deck.Create();
	var html = "";
	for (var i = 0; i < deck.length; i++) {
		html += deck[i].HTML;
	}
	$("#container").append(html);
	// Make the cards draggable
	Deck.Draggable();
});