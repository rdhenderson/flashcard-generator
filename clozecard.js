FlashCard = require('./flashcard.js').FlashCard;
ClozeCard.prototype = Object.create(FlashCard.prototype);

function ClozeCard (text, cloze) {
	if (text.indexOf(cloze) === -1) {
		console.error('Invalid clozeCard -- cloze not included in text');
		return false;
	}
	if(this instanceof ClozeCard) {
		FlashCard.call(this)
		this.text = text;
		this.cloze = cloze;  
	} else {
    	return new ClozeCard(text, cloze);
  	}
}

ClozeCard.prototype.type = function() {
	return 'cloze';
}
ClozeCard.prototype.getCloze = function() {
	return this.cloze;
}

ClozeCard.prototype.getFull = function() {
	return this.text;
}

ClozeCard.prototype.getPartial = function() {
	var fill = Array(this.cloze.length+1).join('*');
	var start = this.text.indexOf(this.cloze);

	var partial = 	(start) ? this.text.substring(0, start) : '' +
					fill + this.text.substring(start + this.cloze.length);
	return partial;
}

exports.ClozeCard = ClozeCard;