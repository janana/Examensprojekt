// Client side player class
var Player = function(id) {
	var score = 0,
		html;


	var getScore = function() {
		return score;
	};

	var setScore = function(newScore) {
		score = newScore;
	};

	return {
		id: id,
		getScore: getScore,
		setScore: setScore,
		html: html
	};
};
