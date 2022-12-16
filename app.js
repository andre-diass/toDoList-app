const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//tell app to use ejs
app.set("view engine", "ejs");

//declare global variables
var items = ["Buy food"];

app.get("/", function (req, res) {
  var today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  var day = today.toLocaleDateString("en-us", options);

  //uses the view engine set up above to render a particular page by looking at the list file that must be inside a views folder
  //the second parameter is a javascript object that has a key value pair;
  //I'm going to pass a variable into the file especified, with a value equal to whatever I have set that value to
  //every time I use "render", I have to provide both variables
  res.render("list", { kindOfDay: day, newListItems: items });
});

//catch the post request by the form, gather the data and redirect
app.post("/", function (req, res) {
  var item = req.body.newItem;
  items.push(item);

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
