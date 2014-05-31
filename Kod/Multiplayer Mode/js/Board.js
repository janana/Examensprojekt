var Board = {
	init: function(socket, id, color) {

		$("#container").append("<div id='board-"+id+"' class='board'>"+
									"<div class='pile-div'>"+
										"<div class='cardholder pile'></div>"+
										"<div class='cardholder pile-drop'></div>"+
									"</div>"+

									"<div class='ace-piles'>"+
										"<div class='cardholder pile-ace'></div>"+
										"<div class='cardholder pile-ace'></div>"+
										"<div class='cardholder pile-ace'></div>"+
										"<div class='cardholder pile-ace'></div>"+
									"</div>"+
									
									"<div class='cardholder pile-thirteen'></div>"+
									
									"<div class='other'><div class='cardholder empty'></div></div>"+
									"<div class='other'><div class='cardholder empty'></div></div>"+
									"<div class='other'><div class='cardholder empty'></div></div>"+
									"<div class='other'><div class='cardholder empty'></div></div>"+
									"<input type='hidden' value='"+color+"' />"+
								"</div>");

		$("#board-"+id+" .pile").click(function(e) {
			if ($(this).children().length > 0) {
				// Disable dragging on cards already in the drop-pile
				if ($("#board-"+id+" .pile-drop").children().length > 0) {
					$("#board-"+id+" .pile-drop").children().each(function(index, obj) {
						$(obj).draggable("disable");
					});
				}
				var cards = $(this).children();
				
				var removed = cards.splice(0, 3);
				$(removed).remove();

				// Reset the position on current cards in drop-pile
				$("#board-"+id+" .pile-drop").children().css({
					left: "-1px",
					"z-index": "0"
				});

				$(removed).removeClass("turned");

				// Add new 3 cards in drop-pile and set position
				$(removed).each(function(index, obj) {
					$("#board-"+id+" .pile-drop").append(obj);
					$(obj).css({
						left: index * 20 -1 +"px"
					});
				});

				// Set same draggable as in Deck
				$(removed).draggable({
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
					stack: "#board-"+id+" .card", // Manages zIndex on dragged objects
					alsoDrag: ".card", // Functionality is fixed in alsoDrag-plugin.js as this elements nextAll() siblings
					start: function(event, ui) {
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

				// Disable the dragging on bottom cards
				removed.splice(removed.length - 1);
				$(removed).draggable("disable");
				
				Deck.resetUnturnedCards();
				e.preventDefault();
			} else { // The pile is empty and should reset
				var cards = $("#board-"+id+" .pile-drop").children();
				
				$("#board-"+id+" .pile-drop").empty();
				$(cards).each(function(index, obj) {
					$("#board-"+id+" .pile").append(obj);
					$(obj).addClass("turned");
					
					// Reset css position
					$(obj).css({
						left: "-1px"
					});
				});
				Deck.resetTurnedCards();
			}
			Deck.broadcastDrop(socket, id);
		}); 
		return id;
	},
	getScore: function () {
		return parseInt($(".score").text());
	},
	setScore: function (score) {
		var oldScore = this.getScore();
		var newScore = oldScore + score;
		$(".score").html(newScore);
	}
}