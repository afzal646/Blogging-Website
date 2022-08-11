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

exports.addcategory = async (req, res) => {
    try {
        const addcategory = new Category({
            categoryname: req.body.category
        })
        const categoryadded = await addcategory.save();
        res.status(201).redirect("admindashboard");
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.categorydetail = async (req, res) => {
    try {
        const filteredresult = await Post.find({ postcate: req.query.postcate }).lean();
        res.render('categorydetail', { fr: filteredresult, postcat: req.query.postcate });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.editcategory = async (req, res) => {
    try {
        const filteredresult = await Category.find({ _id: req.query._id });
        req.body.categoryid = filteredresult[0]._id;
        req.body.category = filteredresult[0].categoryname;
        res.render('editcategory', { categoryid: req.body.categoryid, category: req.body.category });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.updatecategory = async (req, res) => {
    try {
        const result = await Category.findOneAndUpdate({ _id: req.body.categoryid }, {
            $set: {
                categoryname: req.body.category
            }
        })
        res.status(201).redirect("/admindashboard");
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.deletecategory = async (req, res) => {
    try {
        console.log(req.query._id);
        const result = await Category.findOneAndDelete({ _id: req.query._id })
        res.status(201).redirect("/admindashboard");
    } catch (error) {
        res.status(400).send(error);
    }
}