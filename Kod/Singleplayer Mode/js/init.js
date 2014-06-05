$(document).ready(function() {
	Board.init();

	var deck = Deck.create();

	// The playable cards
	$(".empty").each(function(index, obj) {
		$(obj).append(deck[index].HTML);
	});
	
	// Add the card HTML to page
	var cardHTML = "", thirteenHTML = "";
	for (var j = 4; j < 16; j++) {
		thirteenHTML += deck[j].HTML;
	}
	for (var i = 16; i < deck.length; i++) {
		cardHTML += deck[i].HTML;
	}
	
	$(".pile-thirteen").append(thirteenHTML);
	$(".pile-thirteen .card").addClass("turned");
	$(".pile-thirteen").children().each(function(index, obj) {
		$(obj).css({
			top: index * 10 -1 +"px"
		})
	});
	$(".pile-thirteen").children().last().removeClass("turned");
	
	$(".pile").append(cardHTML);
	$(".pile .card").addClass("turned");
	

	// Make the cards draggable
	Deck.draggable();
	Deck.doubleClickable();
	Deck.resetTurnedCards();
	Deck.doubleClickable();
});