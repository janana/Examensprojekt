// Server side player class
var Player = function(id) {
	var score, html, boardID;

	var getScore = function() {
		return score;
	};

	var setScore = function(newScore) {
		score = newScore;
	};

	return {
		id: id,
		html: html,
		boardID: boardID,
		getScore: getScore,
		setScore: setScore
	};
};

exports.Player = Player;