import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("title and author are defined", async () => {
  const blog = {
    title: "a random title",
    author: "some random author",
    user: {
      name: "name",
      id: "912903123sla;jc",
    },
    id: "0293ufjalskdf023f",
    likes: 7,
    url: "url",
  };

  const removeBlog = jest.fn();
  const modifyLikes = jest.fn();

  const user = userEvent.setup();
  render(<Blog blog={blog} remove={removeBlog} modifyLikes={modifyLikes} />);
  screen.debug();

  const blogTitle = screen.getByText("a random title", { exact: false });
  const blogAuthor = screen.getByText("a random title", { exact: false });

  await user.click();

  expect(blogTitle).toBeDefined();
  expect(blogAuthor).toBeDefined();
});

test("url and likes are not defined", async () => {
  const blog = {
    title: "a random title",
    author: "some random author",
    user: {
      name: "name",
      id: "912903123sla;jc",
    },
    id: "0293ufjalskdf023f",
    likes: 7,
    url: "url",
  };

  const removeBlog = jest.fn();
  const modifyLikes = jest.fn();

  const user = userEvent.setup();
  render(<Blog blog={blog} remove={removeBlog} modifyLikes={modifyLikes} />);

  const blogLikes = screen.queryByText("a random title", { equals: false });
  const blogUrl = screen.queryByText("a random title", { equals: false });

  await user.click();

  expect(blogLikes).toBeNull();
  expect(blogUrl).toBeNull();
});
