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
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
//const transporter = require('../config/emailConfig')
const dotenv = require('dotenv')
dotenv.config()
const nodemailer = require('nodemailer')


exports.register = async (req, res) => {
    try {
        const adduser = new Register({
            fullname: req.body.fname,
            email: req.body.email,
            role: req.body.role,
            password: bcrypt.hashSync(req.body.password, 10)
        })
        const filteredresult = await Register.findOne({ email: req.body.email });
        
        if (filteredresult) {
            res.send({ "status": "failed", "message": "email Already exists" })
        }
        else {
            const useradded = await adduser.save();
            res.status(201).redirect("logins");
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.login = async (req, res) => {
    try {
        const postdata = await Category.find().lean();
        const catedata = await Post.find().lean();

        const email = req.body.email;
        const password = req.body.password;
        const filteredresult = await Register.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, filteredresult.password)
        if (filteredresult.email === email && isMatch && filteredresult.role=="afzal712") {
            const vToken = filteredresult.generateJWTToken()
            res.cookie("node1", vToken);
            //res.locals.abc = filteredresult._id;
            //console.log("value of locale is: "+res.locals.abc)              
            res.redirect('admindashboard');            
        }else
        if (filteredresult.email === email && isMatch && filteredresult.role!="afzal712") {
            const vToken = filteredresult.generateJWTToken()
            res.cookie("node1", vToken);
            //res.cookie("loginid", filteredresult._id);
            res.redirect('/');
        }
        else {
            console.log("login error");
            res.send("Wrong email or pasword");
        }
    } catch (error) {
        console.log("login error");
        res.status(400).send(error);
    }
}

exports.logins = async(req, res) => { 
    

    res.render("logins");
}

exports.registrations = (req, res) => {
    res.render("registrations");
}

exports.changepasswordform = (req, res) => {
    res.render("changepassword");
}

exports.forgetpasswordform = (req, res) => {
    res.render("forgetpasswordform");
}

exports.logout = (req, res) => {
    res.cookie("node1", "" , {maxAge: 1});
    res.redirect("/logins");
}


exports.changeUserPassword = async (req, res) => {
    //console.log("id is :"+req.myuser);
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password && cpassword) {
        if (password != cpassword) {
            res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
        } else {
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            //console.log(req.myuser);
            await Register.findByIdAndUpdate(req.myuser, { $set: { password: newHashPassword } })
            res.send({ "status": "success", "message": "Password changed succesfully" })
        }
    } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
    }
}

exports.sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
        const user = await Register.findOne({ email: email })
        //console.log(user._id);
        if (user) {
            const secret = user._id + "FULLSTACKWEBMEANMERN"
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '55m' })
            const link = `http://127.0.0.1:3000/resetpassword/${user._id}/${token}`
            console.log(link)
            // Send Email 


            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'ch.afzal646@gmail.com', // Admin Gmail ID
                    pass: 'rlbbvlzpvtctgkpp', // Admin Gmail Password
                }
            })

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Blog Web - Password Reset Link",
                html: `<a href=${link}>Click Here</a> to Reset Your Password`
            }

            transporter.sendMail(mailOptions, (err, result) => {
                if (err) {
                    console.log(err)
                    res.json('Opps error occured')
                } else {
                    res.json('thanks for e-mailing me');
                }
            })

            res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
        } else {
            res.send({ "status": "failed", "message": "Email doesn't exists" })
        }
    } else {
        res.send({ "status": "failed", "message": "Email Field is Required" })
    }
}


exports.gresetpassword = (req, res) => {    
    res.render("resetpassword");
}

exports.resetpassword = async (req, res) => {
    const { password, password_confirmation } = req.body
    const { id, token } = req.params    
    const user = await Register.findById(id)
    const new_secret = user._id + "FULLSTACKWEBMEANMERN";
    console.log("token is: "+ token)
    console.log("Seceret token is: "+ new_secret)
    try {
        jwt.verify(token, new_secret)
        if (password && password_confirmation) {
            if (password != password_confirmation) {
                res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
            } else {
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                await Register.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
                res.send({ "status": "success", "message": "Password Reset Successfully" })
            }
        } else {
            res.send({ "status": "failed", "message": "All Fields are Required" })
        }
    } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Invalid Token" })
    }
}