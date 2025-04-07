// accountRoute.js
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");

// Ruta para mostrar la vista de login
router.get("/login", accountController.buildLogin);

// Ruta para mostrar la vista de login
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);
// Manejo de errores
router.use((err, req, res, next) => {
  console.error("Error en accountRoute: ", err);
  const nav = "<ul><li><a href='/'>Home</a></li></ul>";
  res.status(err.status || 500).render("error", {
    title: "Error",
    message: err.message || "Error al cargar la página",
    status: err.status || 500,
    nav,
  });
});

module.exports = router;
