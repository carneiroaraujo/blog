const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: false,
        default:0
        
    }
})
blogSchema.set("toJSON", {
    transform: (document, object) => {
        object.id = object._id
        delete object._id
        delete object.__v
    }
})

const Blog = mongoose.model("Blog", blogSchema)


module.exports = Blog