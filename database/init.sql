USE sp_games;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50),
    email VARCHAR(100),
    type VARCHAR(8),
    profile_pic_url VARCHAR (100),
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE category (
    id INT NOT NULL AUTO_INCREMENT,
    catname VARCHAR(20) UNIQUE,
    description TEXT,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE game (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100),
    description TEXT,
    price NUMERIC,
    platform VARCHAR(20),
    year INT,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE belongs (
    categoryid INT,
    gameid INT,
    FOREIGN KEY (categoryid) REFERENCES category(id),
    FOREIGN KEY (gameid) REFERENCES game(id),
    PRIMARY KEY (categoryid, gameid)
);

CREATE TABLE review (
    id INT NOT NULL AUTO_INCREMENT,
    content TEXT,
    rating INT,
    created_at DATETIME,
    uid INT NOT NULL,
    gid INT NOT NULL,
    FOREIGN KEY (uid) REFERENCES users(id),
    FOREIGN KEY (gid) REFERENCES game(id),
    PRIMARY KEY (id)
);