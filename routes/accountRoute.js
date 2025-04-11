// accountRoute.js
const regValidate = require('../utilities/account-validation')
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");

// Login view route
router.get("/login", accountController.buildLogin);

// Register view route
router.get("/register", accountController.buildRegister);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,(accountController.registerAccount)
)

// Error management
router.use((err, req, res, next) => {
  console.error("Error en accountRoute: ", err);
  const nav = "<ul><li><a href='/'>Home</a></li></ul>";
  res.status(err.status || 500).render("error", {
    title: "Error",
    message: err.message || "Error loading the page",
    status: err.status || 500,
    nav,
  });
});

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;
