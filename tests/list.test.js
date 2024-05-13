// const app = require("../app")
// const supertest = require("supertest")
const { test, describe, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const helper = require("./helper")
const api = require("supertest")(require("../app"))
const mongoose = require("mongoose")
const Blog = require("../models/blog")

beforeEach(async () => {
    await Blog.deleteMany({})
    const promises = helper.initialBlogs.map(blog => (new Blog(blog)).save())
    await Promise.all(promises)
})

describe("Retrieving and Formatting", async () => {
    test("returns the correct amount of blog posts", async () => {
        const response = await api.
            get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/)
        assert.strictEqual(response.body.length, helper.initialBlogs.length)


    })

    test("returned blog posts have an id", async () => {
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/)
        assert(response.body[0].id !== undefined)
    })

})

describe("Inserting of new blog posts", async () => {
    test("a new blog post can be added", async () => {
        const blog = {
            title: "The stories of John's life",
            author: "John himself",
            url: "https://awesomestories.com/",
            likes: 10,
        }
        await api
            .post("/api/blogs")
            .send(blog)

        const blogs = await helper.getAllBlogsPosts()

        assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
        assert(blogs.map(blog => blog.title).includes(blog.title))


    })

    test("the value of 'likes' is automatically assigned the value of 0 when missing", async () => {
        const blog = {
            title: "The stories of John's life",
            author: "John himself",
            url: "https://awesomestories.com/",
            // likes: 10,
        }
        const result = await api
            .post("/api/blogs")
            .send(blog)
        assert.strictEqual(result.body.likes, 0)

    })

    test("backend rejects the creation of blogs using malformed data", async () => {
        const missing_url_blog = {
            title: "The stories of John's life",
            author: "John himself",
            // url: "https://awesomestories.com/",
        }
        const missing_title_blog = {
            // title: "The stories of John's life",
            author: "John himself",
            url: "https://awesomestories.com/",
        }

        await api
            .post("/api/blogs")
            .send(missing_title_blog)
            .expect(400)

        await api
            .post("/api/blogs")
            .send(missing_url_blog)
            .expect(400)

    })

})

describe("Deleting of blog posts", async () => {
    test("blog post is properly deleted", async () => {
        const selectedBlog = (await helper.getAllBlogsPosts())[0]
        await api
            .delete(`/api/blogs/${selectedBlog.id}`)
            .expect(204)

        const titles = (await helper.getAllBlogsPosts()).map(blog => blog.title)
        assert(!titles.includes(selectedBlog.title))
        assert.strictEqual(titles.length, helper.initialBlogs.length - 1)


    })
})
describe("Modifying of blog posts", async () => {
    test("blog posts can have number of likes modified", async () => {
        const selectedBlog =  (await helper.getAllBlogsPosts())[0]
        const response = await api
            .put(`/api/blogs/${selectedBlog.id}`)
            .send({ likes: 10 })
            .expect("Content-Type", /application\/json/)

        assert.strictEqual(response.body.likes, 10)
    })


})
after(async () => {
    await mongoose.connection.close()
})



