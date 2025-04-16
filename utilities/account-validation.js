const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }
  

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  
  validate.loginRules = () => {
    return [
      body("account_email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email."),
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
    ]
  }
  
  validate.checkLoginData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav()
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: errors.array(),
        account_email: req.body.account_email
      })
    }
    next()
  }
  
  validate.updateAccountRules = () => {
    return [
      body("account_firstname").trim().notEmpty().withMessage("First name is required."),
      body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
      body("account_email").trim().isEmail().withMessage("Valid email is required.")
    ]
  }
  
  validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav()
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: errors.array(),
        flashMessage: [],
        ...req.body
      })
    }
    next()
  }
  
  validate.passwordRule = () => {
    return [
      body("account_password").trim().isStrongPassword({
        minLength: 12,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }).withMessage("Password must be strong (12+ chars, upper, number, symbol).")
    ]
  }
  
  validate.checkPasswordUpdate = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav()
      const accountData = await accountModel.getAccountById(req.body.account_id)
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: errors.array(),
        flashMessage: [],
        ...accountData
      })
    }
    next()
  }
  

  module.exports = validate