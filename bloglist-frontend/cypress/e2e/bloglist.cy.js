/* eslint-disable no-undef */
describe("Bloglist app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user1 = {
      username: "user1",
      name: "User1",
      password: "password1",
    };
    cy.request("POST", "http://localhost:3003/api/users", user1);
    const user2 = {
      username: "user2",
      name: "User2",
      password: "password2",
    };
    cy.request("POST", "http://localhost:3003/api/users", user2);
    cy.visit("http://localhost:3000");
  });

  it("Site opens and login shows", function () {
    cy.contains("Blog List");
    cy.contains("Login");
  });

  describe("login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#Login").click();
      cy.get("#username").type("user1");
      cy.get("#password").type("password1");
      cy.get("#submit-login").click();

      cy.contains("Successfully logged in. Welcome User1!");
    });

    it("fails with incorrect credentials", function () {
      cy.get("#Login").click();
      cy.get("#username").type("user1123");
      cy.get("#password").type("passwo123rd1");
      cy.get("#submit-login").click();

      cy.contains("Incorrect credentials!");
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      const user1 = {
        username: "user1",
        name: "User1",
        password: "password1",
      };
      cy.request("POST", "http://localhost:3003/api/login", user1).then(
        ({ body }) => {
          console.log(body);
          localStorage.setItem("user", JSON.stringify(body));
          cy.visit("http://localhost:3000");
        }
      );
    });

    it("a blog can be created", function () {
      cy.contains("Create New Blog").as("createBlogButton");
      cy.get("@createBlogButton").click();

      cy.get("#blog-title").type("a new title");
      cy.get("#blog-author").type("a new author");
      cy.get("#blog-url").type("a new url");

      cy.get("#create-blog-submit").click();
      cy.contains("a new title by a new author");
    });

    describe("and a new blog is created", function () {
      beforeEach(function () {
        cy.contains("Create New Blog").as("createBlogButton");
        cy.get("@createBlogButton").click();

        cy.get("#blog-title").type("a new title");
        cy.get("#blog-author").type("a new author");
        cy.get("#blog-url").type("a new url");

        cy.get("#create-blog-submit").click();
        cy.contains("a new title by a new author");
      });

      it("a blog can be liked", function () {
        cy.contains("a new title by a new author").contains("Expand").click();
        cy.contains("a new title by a new author").contains("likes: 0");
        cy.get(".like-button").click();
        cy.contains("a new title by a new author").contains("likes: 1");
      });

      it("a blog can be deleted by the user who created it", function () {
        cy.contains("a new title by a new author").contains("Expand").click();
        cy.contains("Delete").click();
        cy.should("not.contain", "a new title by a new author");
      });
    });
  });

  describe("when a different user is logged in and a blog already exists", function () {
    beforeEach(function () {
      const user1 = {
        username: "user1",
        name: "User1",
        password: "password1",
      };
      cy.request("POST", "http://localhost:3003/api/login", user1).then(
        ({ body }) => {
          console.log(body);
          localStorage.setItem("user", JSON.stringify(body));
          cy.visit("http://localhost:3000");

          cy.request({
            url: "http://localhost:3003/api/blogs",
            method: "POST",
            body: {
              title: "React patterns",
              url: "https://reactpatterns.com/",
              likes: 7,
            },
            headers: {
              Authorization: `Bearer ${body.token}`,
            },
          });
        }
      );

      cy.contains("Logout").click();
      const user2 = {
        username: "user2",
        name: "User2",
        password: "password2",
      };
      cy.request("POST", "http://localhost:3003/api/login", user2).then(
        ({ body }) => {
          localStorage.setItem("user", JSON.stringify(body));
          cy.request({
            url: "http://localhost:3003/api/blogs",
            method: "POST",
            body: {
              title: "a new title",
              url: "a new url",
              likes: 6,
              author: "a new author",
            },
            headers: {
              Authorization: `Bearer ${body.token}`,
            },
          });
          cy.visit("http://localhost:3000");
        }
      );
    });

    it("a blog created by a different user cannot be deleted", function () {
      cy.contains("React patterns by User1")
        .contains("Expand")
        .click()
        .should("not.contain", "Delete");
    });

    it.only("A blog with lower likes is on the bottom", function () {
      cy.get(".blog").eq(0).contains("React patterns by User1");
      cy.contains("a new title by a new author").contains("Expand").click();
      cy.contains("like").click();
      cy.contains("like").click();
      cy.get(".blog").eq(0).contains("a new title by a new author");
    });
  });
});
