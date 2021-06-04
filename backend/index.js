var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

let fetch_controller = require('./src/fetch_data/fetch_controller');
let search_controller = require('./src/search_controller/search_controller');
let add_controller = require('./src/add_controllers/add_controller');

app.get("/get_data", fetch_controller.fetch_initial_data);
app.get("/search", search_controller.search);

app.post("/add_column", add_controller.add_column);

app.listen(8080)
console.log("Server Listening on port 8080");


module.exports = app;