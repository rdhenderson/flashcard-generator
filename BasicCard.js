FlashCard = require('./flashcard.js').FlashCard;


function BasicCard (front, back) {
	if(this instanceof BasicCard) {
		FlashCard.call(this)
		this.front = front;
		this.back = back;
	} else {
		return new BasicCard(front, back);

	}
}	

BasicCard.prototype = Object.create(FlashCard.prototype);

BasicCard.prototype.type = function() {
	return 'basic';
}
exports.BasicCard = BasicCard;