/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
/* ***********************
 * Setup for Static Files (CSS, JS, Images)
 *************************/
app.use(express.static("public"));

/* ***********************
 * Routes
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)
// Inventory routes
app.use("/inv", inventoryRoute)
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Middleware de manejo de errores
// server.js
app.use((err, req, res, next) => {
  console.log("Error middleware activated");
  console.log("Error message:", err.message);
  console.log("Status:", err.status);

  // Enviar un valor por defecto para `nav` si no está definido
  const nav = "<ul><li><a href='/'>Home</a></li></ul>"; // Puede ser un valor por defecto o llamando a un método si lo necesitas

  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    message: err.message || "No se pudo cargar la página",
    status: err.status || 500,
    nav,  // Asegúrate de que `nav` siempre esté definido
  });
});


  module.exports = app;