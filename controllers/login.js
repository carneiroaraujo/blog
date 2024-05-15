const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/user")
const loginRouter = require("express").Router()

loginRouter.post("/", async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    // console.log(username, password, user);
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({error:"invalid username or password"})
    }

    const payload = {
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(payload, process.env.SECRET)

    response
        .status(200)
        .json({ token, username: user.username, name: user.name })
    // generate jwt
    // return user data + jwt
})


module.exports = loginRouter