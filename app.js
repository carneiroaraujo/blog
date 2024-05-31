
const express = require("express")
require("express-async-errors")
const cors = require("cors")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")

const app = express()

const {MONGODB_URI} = require("./utils/config")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect(MONGODB_URI)

const {requestLogger, unknownEndpoint, errorHandler, tokenExtractor } = require("./utils/middleware")
app.use(express.json())
app.use(cors())
app.use(tokenExtractor)
app.use(requestLogger)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
if (process.env.NODE_ENV === "test") {
    app.use("/api/testing", require("./controllers/testing"))
}


app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
