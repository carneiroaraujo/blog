const api = require("supertest")(require("../app"))
const { describe, test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const User = require("../models/user")
const helper = require("./helper")
beforeEach(async () => {
    await User.collection.deleteMany({});
    const promises = helper.initialUsers.map(user => (new User(user)).save())
    await Promise.all(promises)
})

test("can successfully create a user", async () => {
    await api
        .post("/api/users")
        .send({
            username: "mary",
            name: "mary",
            password: "mary"
        })
        .expect(201)
        .expect("Content-Type", /application\/json/)



})

test("user creation gots rejected when using an already taken username", async () => {
    await api
        .post("/api/users")
        .send({
            username: "john",
            name: "john",
            password: "john"
        })
        .expect(400)
    // .expect("Content-Type", /application\/json/)



})

test("user creation gots rejected when using malformed data", async () => {
    const usersBefore = await helper.getAllUsers()

    const response1 = await api
        .post("/api/users")
        .send({
            username: "ma",
            name: "matthew",
            password: "matthew"
        })
        .expect(400)
    const response2 = await api
        .post("/api/users")
        .send({
            username: "matthew",
            name: "matthew",
            password: "ma"
        })
        .expect(400)
    const usersAfter = await helper.getAllUsers()
    // response1.body.error.includes("expected `")
    assert.strictEqual(usersBefore.length, usersAfter.length)
})

after(async () => {
    mongoose.connection.close()
})

