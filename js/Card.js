function Card (number, suit) {
	this.number = number;
	this.suit = suit;
	this.HTML = "<div class='card' id='"+suit+"_"+number+"'>"+number+"_"+suit+"</div>";
}