const express = require("express");
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const hbs = require("hbs");
require("../db/conn");
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
app.use("/", require(path.join(__dirname, '../routes/routes.js')));
app.use(express.urlencoded());
app.use(express.json());
const template_path = path.join(__dirname, '../views');
app.set('views', template_path);
hbs.registerPartials(path.join(__dirname, '../views/include'));

hbs.registerHelper('trimString', function (passedString) {
    var theString = passedString.substring(0, 250);
    return new hbs.SafeString(theString)
});

app.listen(port, () => {
    console.log("server running on " + port)
})
