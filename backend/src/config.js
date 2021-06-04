const mysql = require('mysql2');

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root"
});

const db_name = "cadence"
const table_name = "example"

exports.db_name = db_name;
exports.table_name = table_name;
exports.connection = connection;