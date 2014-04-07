var Deck = {
	Create: function() {
		var cards = [];
		for (var suit = 0; suit < 4; suit++) {
			for (var number = 1; number <= 13; number++) {
				cards.push(new Card(number, suit));
			}
		}
		return this.Shuffle(cards);
	},
	Shuffle: function(cards) {
		var i = cards.length, o, temp;
		while ( --i ) {
			o = Math.floor(Math.random() * (i - 1));
			temp = cards[i];
			cards[i] = cards[o];
			cards[o] = temp;
		}
		return cards;
	},
	Draggable: function() {
		$(".card").draggable({
			revert: "invalid"
		});
		$(".pile-ace").droppable({
			drop: function() {

			}
		});

		$(".other").droppable({
			drop: function() {

			}
		});
	}
}