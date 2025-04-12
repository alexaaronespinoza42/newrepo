// routes/accountRoute.js
const express = require("express");
const router = express.Router();
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");            // ← Agrégalo
const accountController = require("../controllers/accountController");

// Login view
router.get("/login", accountController.buildLogin);

// Register view
router.get("/register", accountController.buildRegister);

// Process registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
);

// Process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin
);

// Account management view (protegida)
router.get(
  "/",
  utilities.checkLogin,      // ← Ahora utilities está definido
  accountController.buildAccount
);

// Error management
router.use((err, req, res, next) => {
  console.error("Error en accountRoute:", err);
  const nav = "<ul><li><a href='/'>Home</a></li></ul>";
  res.status(err.status || 500).render("error", {
    title: "Error",
    message: err.message || "Error loading the page",
    status: err.status || 500,
    nav,
  });
});

module.exports = router;
