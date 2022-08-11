const express = require("express");
const app = express();
const path = require('path');
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
const Category = require("../models/categories");
const Register = require("../models/register");
const auth = require("../middleware/auth")

exports.index = async (req, res) => {
    try {
        const postdata = await Category.find().lean();
        const catedata = await Post.find().lean();
        res.render('index', { mylist: postdata, postlist: catedata });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.admindashboard =  async (req, res) => {
    try {
        const postdata = await Category.find().lean();
        const catedata = await Post.find().lean();
        const user = await Register.find().lean();
        res.render('admindashboard', { mylist: postdata, postlist: catedata,allUsers:user });
    } catch (error) {
        res.status(400).send(error);
    }
}