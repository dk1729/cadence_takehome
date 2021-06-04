const config = require('../config')
const connection = config.connection;
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
const db_name = config.db_name;
const table_name = config.table_name;

exports.fetch_initial_data = async (req, res) => {
  try{
    let the_query = "SELECT * from `"+db_name+"`.`"+table_name+"`";
    let rows = await query(the_query);
    res.writeHead(200, {
      "Content-Type" : "application/json"
    })
    res.end(JSON.stringify(rows));
  }
  catch (e) {
    console.log("---Fetch Controller err----")
    console.log(e)
    res.writeHead(500, {
      "Content-Type" : "text/plain"
    })
    res.end("I failed, I will fix this");
  }
}