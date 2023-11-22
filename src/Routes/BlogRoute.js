const express = require("express");
const route = express.Router();
route.use(express.json());

const {
  getAll,
  getById,
  addComment,
  blogPost,
  blogDelete,
  blogUpdate,
} = require("../Controller/BlogController");
const { body } = require("express-validator");

route.get("/blog", getAll);
route.get("/blog/:blogId", getById);
route.patch("/blog/:blogId/comment", addComment);

route.post(
  "/blog/post",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Not meet minimum character"),
    body("content")
      .isLength({ min: 5 })
      .withMessage("Not meet minimum character"),
  ],
  blogPost
);

route.put(
  "/blog/:blogId",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("minimum 5 characters required"),
    body("content")
      .isLength({ min: 15 })
      .withMessage("minimum of 15 characters required"),
  ],
  blogUpdate
);

route.delete("/blog/:blogId", blogDelete);

// General error handler
route.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = route;
