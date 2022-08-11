const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema({
    categoryname: {
        type: String,
        required: true
    }
})

const Category = new mongoose.model("Category", categoryschema);

module.exports = Category;