var Deck = {
	create: function() {
		var cards = [];
		for (var suit = 0; suit < 4; suit++) {
			for (var number = 1; number <= 13; number++) {
				cards.push(new Card(number, suit));
			}
		}
		return this.shuffle(cards);
	},
	shuffle: function(cards) {
		var i = cards.length, o, temp;
		while ( --i ) {
			o = Math.floor(Math.random() * (i - 1));
			temp = cards[i];
			cards[i] = cards[o];
			cards[o] = temp;
		}
		return cards;
	},
	draggable: function() {
		var that = this;
		var isThirteen = false;
		$(".card").draggable({
			addClasses: false, // No draggable class on cards
			revert: function(e) { // Returns the card to original position if dropped on invalid cardholder
				if ($(e).hasClass("other") || $(e).hasClass("pile-ace")) {
					return false;
				}
				return true;
			},
			revertDuration: 0,
			cancel: ".turned", // Cancels dragging on hidden cards
			containment: "#container", // Contains the cards to the container
			//snap: ".other, .pile-ace", // Snap to inner cardholders
			//snapMode: "inner",
			stack: ".card", // Manages zIndex on dragged objects
			alsoDrag: ".card", // Functionality is fixed in alsoDrag-plugin.js as this elements nextAll() siblings
			start: function(event, ui) {
				if ($(this).parent().hasClass("pile-thirteen")) {
					// The card is from the thirteen-pile. if this card is dropped, the player should get 2 points
					isThirteen = true;
				}
				// Fixes the z-index on cards stacked together on an empty-pile
				var highestZindex = parseInt($(this).css("zIndex"), 10);
				if ($(this).parent().hasClass("empty") && $(this).next().length != 0) {
					$(this).parent().children().each(function(index, obj) {
						var pos = (index * 30) -1;
						$(obj).css({
							"z-index": highestZindex + 1
						});
					});
				}
			},
			stop: function(event, ui) {
				if (isThirteen) { // Set score if the card has been dropped from thirteen pile
					if ($(this).parent().hasClass("empty") || $(this).parent().hasClass("pile-ace")) {
						Board.setScore(2);
					}
					isThirteen = false;
				}
				if ($(this).parent().hasClass("empty") && $(this).next().length != 0) {
					$(this).parent().children().each(function(index, obj) {
						var pos = (index * 30) -1;
						$(obj).css({
							top: pos + "px",
							left: "-1px"
						});
					});
				}
				
		    }
		});
		

		$(".pile-ace").droppable({
			drop: function(event, ui) {
				if (ui.draggable[1] == null) { // There should be only one card
					var card = $(ui.draggable);
					$(this).append(card);
				    card.css({
				    	position: "absolute",
				    	top: "-1px",
				    	left: "-1px"
				    });
				    card.draggable("disable");

				    Board.setScore(1);

				    // Test piles for top card dragging ability
				    that.enableDraggingDropTopCard();
				    that.enableDraggingThirteenTopCard();
				    that.testGameWon();
				}
			},
			accept: function(e) { // Accept only valid cards (in order and correct suit)
				if ($(e).next().length != 0) {
					return false;
				}
				var id = $(e).attr("id");
				var c = id.split("_");
				if ($(this).children().length > 0) {
					var lastChild = $(this).children().last().attr("id").split("_");
					if (c[0] == lastChild[0]) { // The card is the right suit
						if (c[1] == +lastChild[1]+1) { // The card is the right number
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else { // The pile is empty
					if (c[1] == "1") { // The card is ac Ace
						return true;
					} else {
						return false;
					}
				}
			},
			addClasses: false, // No droppable class on cardholders
			tolerance: "pointer" // The pointer has to be over the cardholder to drop
		});

		$(".other").droppable({
			drop: function(event, ui) {
				that.resetUnturnedCards();
				var card = $(ui.draggable[0]);
				
				var next = $(card).nextAll();
				$(this).children(".empty").append(card);
				$(this).children(".empty").append(next);
				
				$(this).children(".empty").children().each(function(index, obj) { // fix z-index here instead
					var pos = index * 30 -1;
					$(obj).css({
				    	left: "-1px",
				    	top: pos + "px"
			    	});	
				});

			    // Test piles for top card dragging ability
			    that.enableDraggingDropTopCard();
			    that.enableDraggingThirteenTopCard();
			    that.testGameWon();
			},
			accept: function(e) { // Accept if right color and nr suitable for top card or if empty
				if ($(this).children(".empty").children().length == 0) { // The pile is empty
					return true;
				} else { 
					var id = $(e).attr("id");
					var c = id.split("_");
					var lastCard = $(this).children(".empty").children().last().attr("id").split("_");
					var lastIsRed = +lastCard[0] % 2;
					var newIsRed = +c[0] % 2;
					if (newIsRed != lastIsRed) { // The card is the right suit
						if (+c[1] + 1 == lastCard[1]) { // The card is the right number
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}
			},
			addClasses: false, // No droppable class on cardholders
			tolerance: "pointer" // The pointer has to be over the cardholder to drop
		});
	},
	doubleClickable: function() {
		// When double click, test if possible to append card on any of the ace-piles
		$(document).on("dblclick", ".card", function(e) {
			if (!$(this).hasClass("turned")) {
				console.log($(this).draggable("option"));
				console.log(this);
			}
		});
	},
	enableDraggingDropTopCard: function() {
		// Test drop-pile for top card dragging ability
		if ($(".pile-drop").children().length > 0) {
    		$(".pile-drop").children().last().draggable("enable");
    	}	
	},
	enableDraggingThirteenTopCard: function() {
		// Test thirteen-pile for top card dragging ability and not turned
		$(".pile-thirteen").children().last().draggable("enable").removeClass("turned");
		this.resetUnturnedCards();
	},
	resetTurnedCards: function() {
		$(".turned").attr("src", "pics/default.png");
	},
	resetUnturnedCards: function() {
		$(".card").not(".turned").each(function(index, obj) {
			var id = $(obj).attr("id");
			var c = id.split("_");
			// c[0] = suit, c[1] = number
			 
			$(obj).attr("src", "pics/"+c[0]+"/"+c[1]+".png");
		});
	},
	testGameWon: function() {
		var won = false;
		if ($(".pile-thirteen").children().length == 0) {
			won = true;
		}

		if (won) {
			if (confirm("Congratulations, you have won the game! confirm to reload.")) {
				window.location = "index.html";
			}
			
		}
	}
}