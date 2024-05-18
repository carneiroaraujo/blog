const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

const middleware = require("../utils/middleware")

const jwt = require("jsonwebtoken")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {username:1, name:1, id:1})
    response.json(blogs)
})

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
    const {title, url, author, likes} = request.body

    const {username, id} = jwt.verify(request.token, process.env.SECRET)
    if (!id) {
        return response.status(401).json({error: "token invalid"})
    }
    const user = await User.findById(id)
    
    const blog = await (new Blog({title, url, author, likes, user:user.id})).save()
    user.blogs = user.blogs.concat(blog._id)

    await user.save()
    // const r = 

    response
        .status(201)
        .json(await blog.populate("user", {username:1, id:1, name:1}))
    // const user = await User.findById("664389871a7a89242fed2bc1")
    // const blog = await (new Blog({...request.body, user:user.id})).save()
    // user.blogs = user.blogs.concat(blog._id)
    // await user.save()
    // response.status(201).json(blog)
})

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
    const user = request.user
    // console.log(user);
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }
    // console.log(user._id.toString());
    // console.log(blog.user.toString())

    if (user._id.toString() === blog.user.toString()) {
     
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } else {
        response.status(403).end()
    }
})

blogsRouter.put("/:id", async (request, response) => {
    // console.log(request.body.likes);
    // console.log(await Blog.findOneA(request.params.id));
    const updated = (await Blog.findByIdAndUpdate(request.params.id, {likes:request.body.likes}, {new:true, runValidators:true}).populate("user", {username:1, id:1, name:1}))
    // console.log(updated);
    response.json(updated)
})

module.exports = blogsRouter