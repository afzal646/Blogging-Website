const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');

const loginschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: String
}, {
    timestamps: true,
})

const Login = new mongoose.model("Login", loginschema);

module.exports = Login;