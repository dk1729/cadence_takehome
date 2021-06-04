const config = require('../config')
const connection = config.connection;
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
const mysql = require('mysql2');
const db_name = config.db_name;
const table_name = config.table_name;

exports.add_column = async (req, res) => {
  try{
    let the_query = "INSERT INTO `"+db_name+"`.`"+table_name+"` SET"+mysql.escape(req.body);
    await query(the_query);
    res.writeHead(200, {
      "Content-Type" : "text/plain"
    })
    res.end("Done");
  }
  catch (e) {
    console.log("---Add Controller err----")
    console.log(e)
    res.writeHead(500, {
      "Content-Type" : "text/plain"
    })
    res.end("I failed, I will fix this");
  }
}