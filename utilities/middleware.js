require("dotenv").config()
const jwt = require("jsonwebtoken")

function checkLogin(req, res, next) {
  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      res.locals.loggedin = true
      res.locals.firstname = decoded.account_firstname
      res.locals.accountData = decoded
      return next()
    } catch (error) {
      res.locals.loggedin = false
      req.flash("notice", "Invalid token. Please login again.")
      return res.redirect("/account/login")
    }
  } else {
    res.locals.loggedin = false
    req.flash("notice", "You must be logged in.")
    return res.redirect("/account/login")
  }
}

function authorizeEmployeeOrAdmin(req, res, next) {
  const accountType = res.locals.accountData?.account_type
  if (accountType === "Employee" || accountType === "Admin") {
    return next()
  }
  req.flash("notice", "Unauthorized. Employees or Admins only.")
  return res.redirect("/account/login")
}

module.exports = {
  checkLogin,
  authorizeEmployeeOrAdmin
}
