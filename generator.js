var ClozeCard = require('./clozecard.js').ClozeCard;
var BasicCard = require('./basiccard.js').BasicCard;
var mysql = require('mysql');
var inquirer = require('inquirer');

function Generator() {
	this.cards = [];
	this.connection = mysql.createConnection(
	    {
	      host     : 'localhost',
	      user     : 'root',
	      password : ''
	      // database : 'flashcards',
	    }
	);
	//Get database names and call init to check for flashcards db. 
	var that = this;
	this.connection.query('SHOW DATABASES', function(err, results){
		if(err) throw err;
		that.init.call(that, err, results);
	});
	
};

//Check for flashcard database.  If it exists, set that as default. 
// Otherwise, create database and tables. 
Generator.prototype.init = function(err, results){
	var that = this;
	if (err) throw err;
	for (var i in results){
		if (results[i].Database === 'flashcards') {
			return this.connection.query('USE flashcards', function(err, results){
				if (err) throw err;
				return that.listen();
			});
		}
	}
	console.log("Please create flashcards database before running program.  SQL code is located in flashcards_db.sql");
	process.exit();

	// return that.createDatabase();
};

//NOT YET WORKING - THROWING MYSQL ERROR 
//AFTER IMPLEMENTING, CORRECT INIT TO CALL THIS FUNCTION INSTEAD of QUITTING
Generator.prototype.createDatabase = function() {
	queryString = 	"CREATE DATABASE test; \n" +
				  	"USE flashcards;\n" +
					"CREATE TABLE cards ( " +
						"id INTEGER(11) AUTO_INCREMENT NOT NULL," +
						"type VARCHAR(30)," +
    					"text VARCHAR(512)," +
						"cloze VARCHAR(512)," +
						"front VARCHAR(512)," +
    					"back VARCHAR(512)," +
    					"PRIMARY KEY (id));";

	this.connection.query(queryString, function(err, results) {
		if(err) throw err;
		this.listen();
	});
};

Generator.prototype.addCloze = function(text, cloze, id){
	this.cards.push(new ClozeCard(text, cloze));
};

Generator.prototype.addBasic = function(front, back) {
	this.cards.push(new BasicCard(front, back));
};

Generator.prototype.show = function(){
	for (var i in this.cards) {
		(this.cards[i].type() === 'basic') ? 
			console.log(this.cards[i].front) :
			console.log(this.cards[i].getPartial());
	}
};

Generator.prototype.dbInsert = function(connection, table, values) {
	var that = this;

	this.connection.query('INSERT INTO ' + table + ' SET ?', values, function(err, result) {
		if(err) return console.error(err);
		that.listen();
	});
};

Generator.prototype.dbQuery = function(connection, table, query) { 
	var queryString = 'SELECT ' + (query || '*') + ' FROM ' + table;
	var that = this;

	// this.connection.connect();
	this.connection.query(queryString, function(err, rows, fields) {
	    if (err) return console.log(err);
	    for (var i in rows) {
	        // console.log('Text: ', rows[i].text);
	        // console.log('Cloze: ', rows[i].cloze);
	        that.addCloze(rows[i].text, rows[i].cloze, rows[i].id);
	    }
	    that.displayCards();
	});
	// this.connection.end(); //Can I end connection before query returns?
};

Generator.prototype.getCards = function() { 
	var queryString = 'SELECT * FROM clozeCards';
	var that = this;

	// this.connection.connect();
	this.connection.query(queryString, function(err, rows, fields) {
	    if (err) return console.log(err);
	    for (var i in rows) {
	        that.addCloze(rows[i].text, rows[i].cloze, rows[i].id);
	    }
	    that.displayCards();
	});
	// this.connection.end(); //Can I end connection before query returns?
};

Generator.prototype.getClozeCards = function () {
		var queryString = 'SELECT * FROM clozeCards';
	var that = this;

	// this.connection.connect();
	this.connection.query(queryString, function(err, rows, fields) {
	    if (err) return console.log(err);
	    for (var i in rows) {
	        that.addCloze(rows[i].text, rows[i].cloze, rows[i].id);
	    }
	    that.getBasicCards();
	});
	// this.connection.end(); //Can I end connection before query returns?
};

Generator.prototype.getBasicCards = function () {
	var queryString = 'SELECT * FROM basicCards';
	var that = this;

	// this.connection.connect();
	this.connection.query(queryString, function(err, rows, fields) {
	    if (err) return console.log(err);
	    for (var i in rows) {
	        that.addBasic(rows[i].front, rows[i].back, rows[i].id);
	    }
	    that.displayCards();
	});
	// this.connection.end(); //Can I end connection before query returns?
};

Generator.prototype.listen = function(){
	//Choose question set based on command line interface flag
	var that = this;
	var questions = [
		{
			type: 'list',
			name: 'action',
			message: 'Please select an action',
			choices: ['Add cards', 'Display cards']
		},{
			type: 'list',
			name: 'cardType',
			message: 'Select the type of card to add: ',
			choices: ['cloze', 'basic'],
			when: function(answers){
		    return answers.action === 'Add cards';
	  		}
		},
		{
		  name: 'text',
		  message: 'Enter the full text of your cloze card',
		  type: 'input',
		  when: function(answers){
		    return answers.cardType === 'cloze';
	  		}
	  	},
	  	{
		  name: 'cloze',
		  message: 'Enter the secret portion of your cloze card',
		  type: 'input',
		  when: function(answers){
		    return answers.cardType === 'cloze';
	  		}
	  	},
	  	{
		  name: 'front',
		  message: 'Enter the front portion of your basic card',
		  type: 'input',
		  when: function(answers){
		    return answers.cardType === 'basic';
	  		}
	  	},
	  	{
		  name: 'back',
		  message: 'Enter the back portion of your basic card',
		  type: 'input',
		  when: function(answers){
		    return answers.cardType === 'basic';
	  		}
	  	}];

	inquirer.prompt(questions).then(function(answers){
		var table, values; 
		if (answers.action === 'Display cards'){
			console.log('that in listen', that);
			return that.getCards();
		}
		if (answers.cardType === 'cloze'){
			table = 'clozeCards'; 
			values = {text: answers.text, cloze: answers.cloze};
		} else {
			table = 'basicCards';
			values = {front: answers.front, back: answers.back};
		}

		return that.dbInsert(that.connection, table, values);
	});
};

Generator.prototype.displayCards = function(index = 0){
	var card = this.cards[index];
	var that = this;
	var questions = [{
			type: (card.front) ? 'confirm' : 'input',
			message: (card.front || card.getPartial()),
			name: 'question'
		},{
			type: 'confirm',
			message: (card.back || card.text) + '\n\n Next card(y) or quit(n)?',
			name: 'answer'
		}];

	inquirer.prompt(questions).then(function(results){
		if (results.answer && (index < that.cards.length - 1)){
			return that.displayCards(index+1);
		} else {
			return that.listen();
		}
	});
};

exports.Generator = Generator;
