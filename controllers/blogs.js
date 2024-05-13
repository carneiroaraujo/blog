const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {

    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete("/:id", async (request, response) => {
    await Blog.findOneAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
    // console.log(request.body.likes);
    // console.log(await Blog.findOneA(request.params.id));
    const updated = (await Blog.findByIdAndUpdate(request.params.id, {likes:request.body.likes}, {new:true, runValidators:true}))
    // console.log(updated);
    response.json(updated)
})
module.exports = blogsRouter