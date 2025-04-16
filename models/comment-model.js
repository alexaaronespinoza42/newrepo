const pool = require("../database");

const commentModel = {};

// Agregar nuevo comentario
commentModel.addComment = async (comment_text, account_id, inv_id) => {
  const sql = `INSERT INTO comments (comment_text, account_id, inv_id) VALUES ($1, $2, $3) RETURNING *`;
  const result = await pool.query(sql, [comment_text, account_id, inv_id]);
  return result.rows[0];
};

// Obtener comentarios por ID de vehículo
commentModel.getCommentsByInvId = async (inv_id) => {
  const sql = `
    SELECT c.comment_id, c.comment_text, c.comment_date, a.account_firstname, a.account_id
    FROM comments c
    JOIN account a ON c.account_id = a.account_id
    WHERE c.inv_id = $1
    ORDER BY c.comment_date DESC
  `;
  const result = await pool.query(sql, [inv_id]);
  return result.rows;
};

// Eliminar comentario
commentModel.deleteComment = async (comment_id, user_id, user_type) => {
  const sql = user_type === "Admin" || user_type === "Employee"
    ? `DELETE FROM comments WHERE comment_id = $1 RETURNING *`
    : `DELETE FROM comments WHERE comment_id = $1 AND account_id = $2 RETURNING *`;
  const params = user_type === "Admin" || user_type === "Employee" ? [comment_id] : [comment_id, user_id];
  const result = await pool.query(sql, params);
  return result.rows[0];
};

module.exports = commentModel;
