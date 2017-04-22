CREATE DATABASE flashcards;

USE flashcards;

CREATE TABLE clozeCards (
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
    text VARCHAR(512),
	cloze VARCHAR(512),
    -- id FOREIGN KEY (id) REFERENCES flashcards(cards),
    PRIMARY KEY (id)
);

CREATE TABLE basicCards (
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
    front VARCHAR(512),
	back VARCHAR(512),
    -- id FOREIGN KEY (id) REFERENCES flashcards(cards),
    PRIMARY KEY (id)
);
    
INSERT INTO clozeCards (text, cloze)
VALUES
	('MySQL is a database language', 'database'),
    ('HTML stands for hyper text markup language.', 'hyper text markup language'),
    ('Object.create() can be used to set parent object', 'Object');


