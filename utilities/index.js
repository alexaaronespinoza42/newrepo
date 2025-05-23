const invModel = require("../models/inventory-model")
const Util = {}

const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();

    // Verificamos que data y data.rows existan antes de usar .forEach
    if (!data || !data.rows || !Array.isArray(data.rows)) {
      throw new Error("Data format is incorrect or empty.");
    }

    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error building nav : ", error);
    return "<ul><li>Error: Unable to load navigation.</li></ul>";
  }
};


/* **************************************
* Build the classification view HTML
* ************************************ */
  Util.buildClassificationGrid = async function(data){
      let grid
      if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
          grid += '<li>'
          grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
          + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
          + 'details"><img src="' + vehicle.inv_thumbnail 
          +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
          +' on CSE Motors" /></a>'
          grid += '<div class="namePrice">'
          grid += '<hr />'
          grid += '<h2>'
          grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
          grid += '</h2>'
          grid += '<span>$' 
          + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
          grid += '</div>'
          grid += '</li>'
        })
        grid += '</ul>'
      } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
      }
      return grid
    }

  /* **************************************
  * Detail view HTML
  * ************************************ */
  Util.buildDetailView = function(data) {
    let detail = `
      <div class="vehicle-details">
        <h1>${data.inv_make} ${data.inv_model} (${data.inv_year})</h1>
        <p class="price">Price: $${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
        <div class="vehicle-image">
          <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}" />
        </div>
      </div>
    `;
    return detail;
  }


  Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }
  
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        req.flash("notice", "Session expired. Please log in.");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
      console.log("Decoded JWT:", decoded);  
      res.locals.accountData = decoded;
      res.locals.firstname = decoded.account_firstname;
      res.locals.loggedin = true;
      next();
    });
  } else {
    res.locals.loggedin = false;
    next();
  }
};



/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util
