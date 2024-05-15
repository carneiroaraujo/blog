const mongoose = require("mongoose")

// schema
const userSchema = new mongoose.Schema({
    username: {
        type:String,
        unique:true,
        required:true,
        minLength:3,
        // index:true
    },
    name: String,
    passwordHash: String,
    blogs: [
        {ref:"Blog", type:mongoose.Schema.Types.ObjectId}
    ]
})

userSchema.set("toJSON", {
    transform: (document, object) => {
        object.id = object._id;
        ["__v", "_id", "passwordHash"].forEach(key=>{delete object[key]})
    }
})
// model
module.exports = mongoose.model("User", userSchema)
