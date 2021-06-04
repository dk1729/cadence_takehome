const connection = require('../config')
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
exports.search = async (req, res) => {
  try{
    let search_term = req.query.search_term;
    let selected_option = req.query.selected_option;
    if(search_term.includes("'") || search_term.includes("\"") || search_term.includes("`")){
      res.writeHead(400, {
        "Content-Type" : "text/plain"
      })
      res.end("Operation not permitted!");
    }
    else if(selected_option === ""){
      res.writeHead(400, {
        "Content-Type" : "text/plain"
      })
      res.end("Please enter search criteria!!!");
    }
    else{
      let the_query = "SELECT * FROM `cadence`.`example` WHERE `"+selected_option+"` LIKE '%"+search_term+"%';";
      let rows = await query(the_query);
      res.writeHead(200, {
        "Content-Type" : "application/json"
      })
      res.end(JSON.stringify(rows));
    }
  }
  catch (e) {
    console.log("---Search Controller err----")
    console.log(e)
    res.writeHead(500, {
      "Content-Type" : "text/plain"
    })
    res.end("I failed, I will fix this");
  }
}