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
const Register = require("../models/register");


exports.postdetail = async (req, res) => {
    try {
        //console.log(req.user.email);
        const userdata = await Register.findOne({ _id: req.user._id})
        const filteredresult = await Post.find({ _id: req.query._id }).lean();
        res.render('postdetail', { fr: filteredresult , ud:userdata.fullname});
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.addpost = async (req, res) => {
    try {
        const addpost = new Post({
            posttitle: req.body.Title,
            postdesc: req.body.Description,
            postcate: req.body.Category
        })
        addpost.save();
        res.status(201).redirect("admindashboard");
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.deletepost = async (req, res) => {
    try {
        console.log(req.query._id);
        const result = await Post.findOneAndDelete({ _id: req.query._id })
        res.status(201).redirect("/admindashboard");
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.editpost = async (req, res) => {
    try {
        const filteredresult = await Post.find({ _id: req.query._id });
        console.log(filteredresult[0]);
        res.render('editpost', { fr: filteredresult });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.updatepost = async (req, res) => {
    try {
        const result = await Post.findOneAndUpdate({ _id: req.body.id }, {
            $set: {
                posttitle: req.body.Title,
                postdesc: req.body.Description
            }
        })
        res.status(201).redirect("/admindashboard");
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.postcomment = async (req, res) => {
    try {
        //console.log("id is: "+ req.body.id)
        //console.log(req.body);       
        
        const result = await Post.findOneAndUpdate({ _id: req.body.id }, {
            $push: {
                postcomment : {userid: req.user._id,username: req.user.fullname,comment: req.body.comment}
            }            
        })
        
        res.status(201).redirect("/postdetail?_id="+req.body.id);
    } catch (error) {
        res.status(400).send(error);
    }    
}