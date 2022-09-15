const mongoose = require("mongoose");

const postschema = new mongoose.Schema({
    posttitle: {
        type: String,
        required: true
    },
    postdesc: {
        type: String,
        required: true
    },
    postcate: [{
        type: String,
        required: true
    }],
    postimg: String,
    postcomment: [{        
        userid: mongoose.Schema.Types.ObjectId,
        username: String,
        comment: String  
    }]
}, {
    timestamps: true,
})

const Post = new mongoose.model("Post", postschema);

module.exports = Post;