const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
    {
        // _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        // __v: 0
    },
    {
        // _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        // __v: 0
    },
    {
        // _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        // __v: 0
    },
    {
        // _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        // __v: 0
    },
    {
        // _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        // __v: 0
    },
    {
        // _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        // __v: 0
    }
]
const initialUsers = [
    {"_id":"6643cd442a4d958751f6e6ed","username":"john","name":"john","passwordHash":"$2b$10$W.pNIntfQ6upd/Wir4WEjumx6o.uID41LbKdDzZ2d2TUbjdgbwfli","__v":0},
    // {"_id":"6643cd442a4d958751f6e6ef","username":"mary","name":"mary","passwordHash":"$2b$10$u0vBqsL2LzrsHrwU6CqY2O6aWvognzGDJli8h11.fZBAzgkkoqdMi","__v":0},
    {"_id":"6643cd452a4d958751f6e6f1","username":"joseph","name":"joseph","passwordHash":"$2b$10$0VHyrflgvbTbTVLuJPZa2eu15yHXdKHbC9Td6WedwJXx9zvbUBTWm","__v":0}
] 
async function selectUser() {
    return (await User.find({}))[0].toJSON()
}
async function getAllBlogsPosts() {
    return (await Blog.find({})).map(blog=>blog.toJSON())
}
async function getAllUsers() {
    return (await User.find({})).map(user=>user.toJSON())
}
module.exports = {
    initialBlogs,
    getAllBlogsPosts,
    getAllUsers,
    selectUser,
    initialUsers
}