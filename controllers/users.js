const usersRouter = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")
usersRouter.post("/", async (request, response) => {
    const {username, name, password} = request.body
    if (password.length < 3) {
        return response.status(400).json({error: "invalid password"})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({
        username,
        name,
        passwordHash
    })
    response
        .status(201)
        .json(await newUser.save())
})
usersRouter.get("/", async (request, response) => {
    response.json(await User.find({}).populate("blogs", {url:1,  title:1, author:1, id:1}))
})


module.exports = usersRouter