const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const validate = require("../utilities/comment-validation");
const utilities = require("../utilities");

// Post comment (logged in only)
router.post(
  "/add",
  utilities.checkLogin,
  validate.commentRules(),
  validate.checkCommentData,
  commentController.postComment
);

// Delete comment
router.post(
  "/delete/:comment_id",
  utilities.checkLogin,
  commentController.deleteComment
);

module.exports = router;
