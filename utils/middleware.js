const jwt = require("jsonwebtoken")

const User = require("../models/user")
const { info, error } = require("./logger")
function requestLogger(request, response, next) {
    info("Method:", request.method)
    info("Path:", request.path)
    info("Body:", request.body)
    info("---")
    next()
}

function unknownEndpoint(request, response, next) {
    return response.status(404).send({ error: "unknown endpoint" })
}

function errorHandler(error, request, response, next) {
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    } else if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error collection")) {
        return response.status(400).json({ error: "expected `username` to be unique" })
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "token invalid" })
    }
    next(error)
}

function tokenExtractor(request, response, next) {
    const auth = request.get("Authorization")
    if (auth && auth.startsWith("Bearer ")) {
        request.token = auth.replace("Bearer ", "")
    }
    next()
}

async function userExtractor(request, response, next) {
    const {id} = jwt.verify(request.token, process.env.SECRET)
    if (id) {
        request.user = await User.findById(id)
    }
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
}