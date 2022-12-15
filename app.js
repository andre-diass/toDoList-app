const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//tell app to use ejs
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  var currentDay = new Date().getDay();
  var day = " ";

  switch (currentDay) {
        case 0:
        day = "Sunday"
        break;
        case 1:
        day = "Monday"
        break;
        case 2:
        day = "Tuesday"
        break;
        case 3:
        day = "Wedsneday"
        break;
        case 4:
        day = "Thursday"
        break;
        case 5:
        day = "Friday"
        break;
        case 6:
        day = "Saturday"
        break;
  
    
  }
  //uses the view engine set up above to render a particular page by looking at the list file that must be inside a views folder
  //the second parameter is a javascript object that has a key value pair;
  //I'm going to pass a variable into the file especified, with a value equal to whatever I have set that value to
  res.render("list", { kindOfDay: day });
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
