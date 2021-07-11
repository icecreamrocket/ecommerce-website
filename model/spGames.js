const pool = require("../config/databaseConfig");

var spGames = {};

// Get all users
spGames.getAllUsers = function (callback) {
  const sql = `SELECT id AS userid, username, email, type, profile_pic_url, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at FROM users`;
  pool.query(sql, (err, rows) => {
    callback(err, rows);
  });
};

// Add a user
spGames.insertIntoUsers = function (
  username,
  email,
  type,
  profile_pic_url,
  date,
  password,
  callback
) {
  const sql = `INSERT INTO users (username, email, type, profile_pic_url, created_at, password) VALUES (?, ?, ?, ?, ?, ?)`;
  pool.query(
    sql,
    [username, email, type, profile_pic_url, date, password],
    (err, rows) => {
      callback(err, rows);
    }
  );
};

// Get a user by id
spGames.getUser = function (userid, callback) {
  const sql = `SELECT id AS userid, username, email, profile_pic_url, type AS role, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at FROM users WHERE id = ?`;
  pool.query(sql, [userid], (err, rows) => {
    callback(err, rows);
  });
};

// Get a user by email
spGames.getUserByEmail = function (email, callback) {
  const sql = `SELECT * FROM users WHERE email = ?`;
  pool.query(sql, [email], (err, rows) => {
    callback(err, rows);
  });
};

// Get a user by email and password
spGames.getUserByEmailAndPassword = function (password, email, callback) {
  const sql = `SELECT * FROM users WHERE password = ? AND email = ?`;
  pool.query(sql, [password, email], (err, rows) => {
    callback(err, rows);
  });
};

// Update a user
spGames.updateUser = function (username, email, profile_pic_url, id, callback) {
  const sql = `UPDATE users SET username = ?, email = ?, profile_pic_url = ? WHERE id = ?`;
  pool.query(sql, [username, email, profile_pic_url, id], (err, rows) => {
    callback(err, rows);
  });
};

// Add a category
spGames.insertIntoCategory = function (catname, description, date, callback) {
  const sql = `INSERT INTO category (catname, description, created_at) VALUES (?, ?, ?)`;
  pool.query(sql, [catname, description, date], (err, rows) => {
    callback(err, rows);
  });
};

// Get all categories
spGames.getAllCategories = function (callback) {
  const sql = `SELECT * FROM category`;
  pool.query(sql, (err, rows) => {
    callback(err, rows);
  });
};

// Delete a category
spGames.deleteCategory = function (id, callback) {
  const sql = `DELETE FROM category WHERE id = ?`;
  pool.query(sql, [id], (err, rows) => {
    callback(err, rows);
  });
};

// Update a category
spGames.updateCategory = function (catname, description, id, callback) {
  const sql = `UPDATE category SET catname = ?, description = ? WHERE id = ?`;
  pool.query(sql, [catname, description, id], (err, rows) => {
    callback(err, rows);
  });
};

// Add a game
spGames.insertIntoGame = function (
  title,
  description,
  price,
  platform,
  year,
  date,
  callback
) {
  const gameSql = `INSERT INTO game (title, description, price, platform, year, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
  pool.query(
    gameSql,
    [title, description, price, platform, year, date],
    (err, rows) => {
      callback(err, { gameid: rows.insertId });
    }
  );
};

// Get games by platform
spGames.getGameWithPlatform = function (platform, callback) {
  const belongsSql = `SELECT B.categoryid, C.catname FROM belongs B INNER JOIN category C ON B.categoryid = C.id WHERE B.gameid = ?`;
  const gameSql = `SELECT G.id AS gameid, G.title, G.description, G.price, G.platform, G.year, DATE_FORMAT(G.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
        FROM game G WHERE G.platform = ?`;
  // Get games with specific platform
  pool.query(gameSql, [platform], (err, rows) => {
    if (err) {
      return callback(err, rows);
    }
    const games = rows;
    // Get categories of each game
    games.forEach((game) => {
      pool.query(belongsSql, [game.id], (err, rows) => {
        // Append categories
        game.categories = rows;
      });
    });
    callback(err, games);
  });
};

// Get all categories for a game
spGames.getGameCategories = function (gameid, callback) {
  const sql = `SELECT B.categoryid, C.catname FROM belongs B INNER JOIN category C ON B.categoryid = C.id WHERE gameid = ?`;
  pool.query(sql, [gameid], (err, rows) => {
    callback(err, rows);
  });
};

// Get a game
spGames.getGame = function (id, callback) {
  const sql = `SELECT G.title, G.description, G.price, G.platform, G.year, C.catname, B.categoryid, B.gameid 
  FROM (game G LEFT OUTER JOIN belongs B ON G.id = B.gameid) 
  LEFT OUTER JOIN category C ON C.id = B.categoryid 
  WHERE G.id = ?`;
  pool.query(sql, [id], (err, rows) => {
    callback(err, rows);
  });
};

// Get all games
spGames.getAllGames = function (callback) {
  const sql = `SELECT G.title, G.description, G.price, G.platform, G.year, C.catname, B.categoryid, B.gameid 
      FROM (game G LEFT OUTER JOIN belongs B ON G.id = B.gameid) 
      LEFT OUTER JOIN category C ON B.categoryid = C.id`;
  pool.query(sql, (err, rows) => {
    callback(err, rows);
  });
};

// Get games by title
spGames.getGameByTitle = function (title, callback) {
  const sql = `SELECT G.title, G.description, G.price, G.platform, G.year, C.catname, B.categoryid, B.gameid 
      FROM (game G LEFT OUTER JOIN belongs B ON G.id = B.gameid) 
      LEFT OUTER JOIN category C ON B.categoryid = C.id
      WHERE G.title LIKE ?`;
  pool.query(sql, [`%${title}%`], (err, rows) => {
    callback(err, rows);
  });
};

// Get games by title and max price
spGames.getGameByTitleAndMaxPrice = function (title, price, callback) {
  const sql = `SELECT G.title, G.description, G.price, G.platform, G.year, C.catname, B.categoryid, B.gameid 
        FROM (game G LEFT OUTER JOIN belongs B ON G.id = B.gameid) 
        LEFT OUTER JOIN category C ON B.categoryid = C.id
        WHERE G.title LIKE ? AND G.price <= ?`;
  pool.query(sql, [`%${title}%`, price], (err, rows) => {
    callback(err, rows);
  });
};

// Delete a game
spGames.deleteGame = function (id, callback) {
  const belongsSql = `DELETE FROM belongs WHERE gameid = ?`;
  const gameSql = `DELETE FROM game WHERE id = ?`;
  // Remove categories for specific game
  pool.query(belongsSql, [id], (err, rows) => {
    if (err) {
      return callback(err, rows);
    }
    // Remove game
    pool.query(gameSql, [id], (err, rows) => {
      callback(err, rows);
    });
  });
};

// Update a game
spGames.updateGame = function (
  title,
  description,
  price,
  platform,
  year,
  id,
  callback
) {
  const sql = `UPDATE game SET title = ?, description = ?, price = ?, platform = ?, year = ? WHERE id = ?`;
  pool.query(
    sql,
    [title, description, price, platform, year, id],
    (err, rows) => {
      callback(err, rows);
    }
  );
};

// Add a review
spGames.insertIntoReview = function (
  content,
  rating,
  uid,
  gid,
  date,
  callback
) {
  const sql = `INSERT INTO review (content, rating, uid, gid, created_at) VALUES(?, ?, ?, ?, ?)`;
  pool.query(sql, [content, rating, uid, gid, date], (err, rows) => {
    callback(err, rows);
  });
};

// Get reviews by game
spGames.getReviewForGame = function (id, callback) {
  const sql = `SELECT R.gid AS gameid, R.content, R.rating, U.username, DATE_FORMAT(R.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
        FROM review R INNER JOIN Users U ON U.id = R.uid WHERE R.gid = ?`;
  pool.query(sql, [id], (err, rows) => {
    callback(err, rows);
  });
};

// Add a category to a game
spGames.insertIntoBelongs = function (gameid, categoryid, callback) {
  const sql = `INSERT INTO belongs (categoryid, gameid) VALUES (?, ?)`;
  pool.query(sql, [categoryid, gameid], (err, rows) => {
    callback(err, rows);
  });
};

// Delete a category from a game
spGames.deleteBelongs = function (gameid, categoryid, callback) {
  const sql = `DELETE FROM belongs WHERE categoryid = ? AND gameid = ?`;
  pool.query(sql, [categoryid, gameid], (err, rows) => {
    callback(err, rows);
  });
};

// Update a category for a game
spGames.updateBelongs = function (gameid, categoryid, callback) {
  const sql = `UPDATE belongs SET categoryid = ? WHERE gameid = ?`;
  pool.query(sql, [categoryid, gameid], (err, rows) => {
    callback(err, rows);
  });
};


// EXTRA API to work on 
// A new table, belongs, was created to store the categories for each game, since each game can have more than 1 categories.

// On creation of game, user must select a category, which will be added in endpoint 6. If user wants to add more than 1 category, user will have to use endpoint 12 (the idea is user selects a category from a list and clicks insert).
// To delete game categories for a specific game, use endpoint 13. Endpoint 9 no longer allows update of game categories (use endpoint 13/12 to delete/add). Deletion of game will also lead to deletion of game categories for that game from belongs table.
// To get game categories for a specific game, use endpoint 14. Endpoint 7 will not retrieve categories for every game as this will require separate sql queries for each game which is resource intensive.

module.exports = spGames;
