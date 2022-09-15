const express = require("express");
const app = express();
const path = require('path');
const hbs = require("hbs");
var bodyParser = require("body-parser");
require("../db/conn");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
const template_path = path.join(__dirname, '../views');
app.set('views', template_path);
hbs.registerPartials(path.join(__dirname, '../views/include'));
const router = express.Router();
var cookieParser = require('cookie-parser');
router.use(cookieParser());
const postcontroller = require("../controllers/postcontroller");
const userlogincontroller = require("../controllers/userlogincontroller");
const categorycontroller = require("../controllers/categorycontroller");
const searchcontroller = require("../controllers/searchcontroller");
const maincontroller = require("../controllers/maincontroller");
const editusercontroller = require("../controllers/editusercontroller")
var jwt = require('jsonwebtoken');
//const auth = require('../middleware/auth')
//const loginauth = require('../middleware/auth')
const {auth , isAdmin, isUser} = require("../middleware/auth");
const uploadfilenow = require('../middleware/uploadmiddleware');

router.get("/" ,auth , isUser, maincontroller.index);

router.get("/postdetail",auth , postcontroller.postdetail);

router.get("/logins", userlogincontroller.logins);

router.get("/registrations", userlogincontroller.registrations);

router.post("/register", urlencodedParser, userlogincontroller.register);

router.post("/login", urlencodedParser, userlogincontroller.login);

router.get("/admindashboard", auth ,isAdmin, maincontroller.admindashboard);

router.post("/addpost", uploadfilenow , urlencodedParser, postcontroller.addpost);

router.get("/editpost",auth, urlencodedParser, postcontroller.editpost);

router.post("/updatepost", urlencodedParser, postcontroller.updatepost);

router.get("/deletepost", postcontroller.deletepost);

router.post("/postcomment", auth ,urlencodedParser, postcontroller.postcomment);

router.post("/addcategory", urlencodedParser, categorycontroller.addcategory);

router.get("/categorydetail",auth, categorycontroller.categorydetail);

router.get("/editcategory", urlencodedParser, categorycontroller.editcategory);

router.post("/updatecategory", urlencodedParser, categorycontroller.updatecategory);

router.get("/deletecategory", categorycontroller.deletecategory);

router.get("/searchdetail",auth, searchcontroller.searchdetail);

router.get('/changepasswordform', userlogincontroller.changepasswordform);

router.use('/changeUserPassword', auth)

router.post('/changeUserPassword',urlencodedParser, userlogincontroller.changeUserPassword)

router.get('/forgetpasswordform', userlogincontroller.forgetpasswordform);

router.post('/sendUserPasswordResetEmail',urlencodedParser,userlogincontroller.sendUserPasswordResetEmail)

router.get('/resetpassword/:id/:token',urlencodedParser,userlogincontroller.gresetpassword)

router.post('/resetpassword/:id/:token',urlencodedParser, userlogincontroller.resetpassword)

router.get('/logout',userlogincontroller.logout)

router.get("/editusers", urlencodedParser, editusercontroller.editusers);

router.post("/updateusers", urlencodedParser, editusercontroller.updateusers);

router.get("/deleteusers", editusercontroller.deleteusers);

module.exports = router;