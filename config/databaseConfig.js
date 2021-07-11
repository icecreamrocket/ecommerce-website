var mysql = require("mysql");

const pool = mysql.createPool({
  password: "Pa$$w0rd",
  user: "root",
  database: "sp_games",
  host: "localhost",
});

module.exports = pool;
