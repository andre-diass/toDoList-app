const express = require("express");
const bodyParser = require("body-parser");
//the date object is bound to the exports of the date module
const date = require(__dirname + "\\date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//tell app to use ejs
app.set("view engine", "ejs");

//declare global variables
let items = ["Buy food"];
let workItems = [];

//the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.
app.get("/", function (req, res) {
    
    
    //call the function the is bound to the const date and activate the getDate funcion
    let day = date.getDate()
    
  //uses the view engine set up above to render a particular page by looking at the list file that must be inside a views folder
  //the second parameter is a javascript object that has a key value pair;
  //I'm going to pass a variable into the file especified, with a value equal to whatever I have set that value to
  //every time I use "render", I have to provide both variables
  res.render("list", { listTitle: day, newListItems: items });
});

//catch the post request by the form, gather the data and redirect
app.post("/", function (req, res) {
  let item = req.body.newItem;
  console.log(req.body);

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about", {});
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
