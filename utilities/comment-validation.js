const { body, validationResult } = require("express-validator");
const utilities = require(".");

const validate = {};

validate.commentRules = () => {
  return [
    body("comment_text")
      .trim()
      .notEmpty()
      .withMessage("Comment cannot be empty.")
      .isLength({ max: 500 })
      .withMessage("Comment too long (max 500 characters).")
  ];
};

validate.checkCommentData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", errors.array().map(e => e.msg).join(" "));
    return res.redirect("back");
  }
  next();
};

module.exports = validate;
