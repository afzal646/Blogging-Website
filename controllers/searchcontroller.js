const express = require("express");
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const hbs = require("hbs");
var bodyParser = require("body-parser");
require("../db/conn");
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
const template_path = path.join(__dirname, '../views');
app.set('views', template_path);
hbs.registerPartials(path.join(__dirname, '../views/include'));
const Post = require("../models/posts");

exports.searchdetail = async (req, res) => {
    try {
        const filteredresult = await Post.find({ $or: [{ posttitle: { $regex: req.query.posttitle, $options: 'i' } }] }).lean();
        res.render('searchdetail', { fr: filteredresult, posttitl: req.query.posttitle });
    } catch (error) {
        res.status(400).send(error);
    }
}