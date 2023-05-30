const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const helper = require("./blog_helper");
const Blog = require("../models/Blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogPromiseArray = helper.initialBlogs
    .map((blog) => new Blog(blog))
    .map((blog) => blog.save());

  await Promise.all(blogPromiseArray);
}, 20000);

test("notes are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("/api/blogs returns correct amount of blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
}, 100000);

afterAll(async () => {
  await mongoose.connection.close();
});
