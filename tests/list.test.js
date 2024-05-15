const { test, describe, after, before } = require("node:test")
const assert = require("node:assert")
const helper = require("./helper")
const api = require("supertest")(require("../app"))
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const User = require("../models/user")


before(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

})
describe("Blog operations dependent on user authentication", async () => {
    let result
    result = await api
        .post("/api/users")
        .send({
            username: "john",
            name: "john",
            password: "john",
        })
        .expect(201)

    const user = result.body
    const blogToDelete = await (new Blog({
        "author": "Author",
        "title": "blogToDelete",
        "url": "Url",
        "likes": 10,
        user: user.id
    })).save()

    result = await api
        .post("/api/login")
        .send({ username: "john", password: "john" })
        .expect("Content-Type", /application\/json/)
        .expect(200)

    const token = result.body.token

    test("Blog can be created", async () => {

        const blog = {
            "author": "Author",
            "title": "Title",
            "url": "Url",
            "likes": 10
        }

        result = await api
            .post("/api/blogs")
            .send(blog)
            .set({ "Authorization": `Bearer ${token}` })
            .expect(201)

        assert(result.body)
        const blogs = await helper.getAllBlogsPosts()
        assert(blogs.map(blog => blog.title).includes(blog.title))

    })
    test("Blog creation is rejected when using malformed or without passing a proper user token", async () => {

        const blogsBefore = await helper.getAllBlogsPosts()
        result = await api
            .post("/api/blogs")
            .send({
                "author": "Author",
                "title": "Title",
                "url": "Url",
                "likes": 10
            })
            .expect(401)

        result = await api
            .post("/api/blogs")
            .send({
                "title": "Title",
                "likes": 10
            })
            .set({ "Authorization": `Bearer ${token}` })
            .expect(400)

        result = await api
            .post("/api/blogs")
            .send({
                "title": "Title",
                "url": "Url",
                "likes": 10
            })
            .set({ "Authorization": `Bearer ${token.slice(1)}` })
            .expect(401)
        
        const blogsAfter = await helper.getAllBlogsPosts()
        assert.strictEqual(blogsAfter.length, blogsBefore.length)

    })
    test("Blog can be deleted", async () => {

        let r = await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ "Authorization": `Bearer ${token}` })
            .expect(204)

    })

})

after(async () => {
    await mongoose.connection.close()
})



