
const express = require("express")
require("express-async-errors")
const blogsRouter = require("./controllers/blogs")
const app = express()

const {MONGODB_URI} = require("./utils/config")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect(MONGODB_URI)

const {requestLogger, unknownEndpoint, errorHandler} = require("./utils/middleware")
app.use(requestLogger)
app.use(express.json())

app.use("/api/blogs", blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
