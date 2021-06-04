const connection = require('../config')
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
const mysql = require('mysql2');
exports.add_column = async (req, res) => {
  try{
    let the_query = "INSERT INTO `cadence`.`example` SET"+mysql.escape(req.body);
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