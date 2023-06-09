/* eslint-disable react/no-unknown-property */
import { useState } from "react";
const NewBlog = ({ addBlog }) => {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const createBlog = (event) => {
    event.preventDefault();
    const blog = {
      author: author,
      title: title,
      url: url,
    };
    addBlog(blog);
    setAuthor("");
    setTitle("");
    setUrl("");
    event.target.reset();
  };

  return (
    <section>
      <h2>Create new blog</h2>
      <form onSubmit={createBlog}>
        <div>
          <label forid="blog-title">Title: </label>
          <input
            id="blog-title"
            type="text"
            name="title"
            placeholder="enter title here"
            onChange={({ target }) => {
              setTitle(target.value);
            }}
          ></input>
        </div>

        <div>
          <label forid="blog-author">Author: </label>
          <input
            id="blog-author"
            type="text"
            name="author"
            placeholder="enter author here"
            onChange={({ target }) => {
              setAuthor(target.value);
            }}
          ></input>
        </div>

        <div>
          <label forid="blog-url">Url: </label>
          <input
            id="blog-url"
            type="text"
            name="url"
            placeholder="enter url here"
            onChange={({ target }) => {
              setUrl(target.value);
            }}
          ></input>
        </div>

        <div>
          <button id="create-blog-submit" type="submit">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default NewBlog;
