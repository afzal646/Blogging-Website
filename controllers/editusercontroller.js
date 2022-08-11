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

exports.editusers = async (req, res) => {
    try {
        const filteredresult = await Register.find({ _id: req.query._id });
        req.body.userid = filteredresult[0]._id;
        req.body.name = filteredresult[0].fullname;
        req.body.email = filteredresult[0].email;
        req.body.role = filteredresult[0].role;
        res.render('editusers', { userid: req.body.userid, name: req.body.name, email: req.body.email, role: req.body.role });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.updateusers = async (req, res) => {
    try {
        const result = await Register.findOneAndUpdate({ _id: req.body.userid }, {
            $set: {
                fullname: req.body.name,
                email: req.body.email,
                role: req.body.role
            }
        })
        res.status(201).redirect("/admindashboard");
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.deleteusers = async (req, res) => {
    try {
        console.log(req.query._id);
        const result = await Register.findOneAndDelete({ _id: req.query._id })
        res.status(201).redirect("/admindashboard");
    } catch (error) {
        res.status(400).send(error);
    }
}