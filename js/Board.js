var Board = {
	init: function() {
		$("#container").append("<div class='board'>"+
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
									
									"<div class='cardholder other'></div>"+
									"<div class='cardholder other'></div>"+
									"<div class='cardholder other'></div>"+
									"<div class='cardholder other'></div>"+
									
								"</div>");
	}
}