const commentModel = require("../models/comment-model");
const utilities = require("../utilities");

const commentController = {};

// Procesar nuevo comentario
commentController.postComment = async (req, res) => {
  const { comment_text, inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    await commentModel.addComment(comment_text, account_id, inv_id);
    req.flash("notice", "✅ Comment posted successfully!");
  } catch (err) {
    console.error(err);
    req.flash("notice", "❌ Failed to post comment.");
  }

  res.redirect(`/inv/detail/${inv_id}`);
};

// Eliminar comentario
commentController.deleteComment = async (req, res) => {
  const comment_id = parseInt(req.params.comment_id);
  const user_id = res.locals.accountData.account_id;
  const user_type = res.locals.accountData.account_type;

  try {
    const deleted = await commentModel.deleteComment(comment_id, user_id, user_type);
    if (deleted) {
      req.flash("notice", "🗑️ Comment deleted.");
    } else {
      req.flash("notice", "⚠️ You can only delete your own comments.");
    }
  } catch (err) {
    console.error(err);
    req.flash("notice", "❌ Error deleting comment.");
  }

  res.redirect("back");
};

module.exports = commentController;
