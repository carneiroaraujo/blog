
const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", (request, response) => {
    Blog.find({})
        .then(result => {
            response.json(result)
        })
})

blogsRouter.post("/", (request, response) => {
    const blog = new Blog(request.body)
    blog.save()
        .then(result => {
            response.status(201).json(result)
        })
})


module.exports = blogsRouter