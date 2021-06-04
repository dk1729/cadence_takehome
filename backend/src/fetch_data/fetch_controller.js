var connection = require('../config')
const util = require('util');
const query = util.promisify(connection.query).bind(connection);

exports.fetch_initial_data = async (req, res) => {
  try{
    let the_query = "SELECT * from `cadence`.`example`";
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