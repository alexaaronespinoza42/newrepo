/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const bodyParser = require("body-parser");
const pool = require("./database/");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");

/* ***********************
 * Setup for Static Files (CSS, JS, Images)
 *************************/
app.use(express.static("public"));

/* ***********************
 * Routes Setup
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Middleware
 ************************/
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Session Middleware (ensure it's after bodyParser)
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(flash());

/* ***********************
 * Express Routes
 *************************/
app.use(static);

// Index route
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

/* ***********************
 * Middleware for Error Handling
 ************************/
app.use((err, req, res, next) => {
  console.log("Error middleware activated");
  console.log("Error message:", err.message);
  console.log("Status:", err.status);

  const nav = "<ul><li><a href='/'>Home</a></li></ul>";

  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    message: err.message || "Can't start the page",
    status: err.status || 500,
    nav,
  });
});
