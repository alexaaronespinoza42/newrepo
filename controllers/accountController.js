// controllers/accountController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const { updateAccountRules } = require("../utilities/account-validation");

/* Deliver login view */
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      flashMessage: req.flash("notice"),
      account_email: ""
    });
  } catch (error) {
    next(error);
  }
}

/* Deliver registration view */
async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
}

/* Process registration */
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );
    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        flashMessage: req.flash("notice"),
        account_email
      });
    }
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
}

/* Process login request */
async function accountLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        flashMessage: req.flash("notice"),
        account_email
      });
    }
    const match = await bcrypt.compare(account_password, accountData.account_password);
    if (match) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      const cookieOptions = { httpOnly: true, maxAge: 3600 * 1000 };
      if (process.env.NODE_ENV !== "development") cookieOptions.secure = true;
      res.cookie("jwt", accessToken, cookieOptions);
      return res.redirect("/account");
    }
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      flashMessage: req.flash("notice"),
      account_email
    });
  } catch (error) {
    next(error);
  }
}

/* Deliver account management view */
async function buildAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountData = res.locals.accountData;
    console.log("Account Data in buildAccount:", accountData); 

    res.render("account/management", {
      title: "Account Management",
      nav,
      firstname: accountData.account_firstname,
      account_id: accountData.account_id,
      account_type: accountData.account_type,
      flashMessage: req.flash("notice")
    });
  } catch (error) {
    next(error);
  }
}



async function buildUpdateView  (req, res) {
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  const nav = await utilities.getNav()

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    flashMessage: req.flash("notice"),
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

async function updateAccount (req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
  const nav = await utilities.getNav()

  if (updateResult) {
    req.flash("notice", "✅ Account updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      flashMessage: req.flash("notice"),
      account_id: accountData.account_id,
      firstname: accountData.account_firstname,
      account_type: accountData.account_type
    })
  } else {
    req.flash("notice", "❌ Update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

async function updatePassword  (req, res) {
  const { account_id, account_password } = req.body
  const nav = await utilities.getNav()
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

  if (updateResult) {
    req.flash("notice", "✅ Password updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      flashMessage: req.flash("notice"),
      account_id: accountData.account_id,
      firstname: accountData.account_firstname,
      account_type: accountData.account_type
    })
  } else {
    req.flash("notice", "❌ Password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  buildUpdateView,
  updateAccount,
  updateAccountRules,
  updatePassword
};
