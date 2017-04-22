'use strict'

// var db = require('node-mysql');
// var DB = db.DB;
// var BaseRow = db.Row;
// var BaseTable = db.Table;

// var box = new DB({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'flashcards'
// });

// var cards = box.get('cards');

var Generator = require('./generator.js').Generator;

//GENERATOR constructor will check for database and start listener if it is present
var cardGen = new Generator();

// cardGen.listen();
// cardGen.getCards().then(cardGen.displayCards());

