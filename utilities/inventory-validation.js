const { body, validationResult } = require("express-validator");
const utilities = require(".");
const invModel = require("../models/inventory-model");

const validate = {}

validate.classificationRules = () => {
  return [
    body("classificationName")
      .trim()
      .notEmpty()
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("The name can't contain spacial characters or spaces in between"),
  ]
}

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .isInt()
      .withMessage("Select a valid classification."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("The price must be a positive number."),
    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Enter a valid year."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required.")
  ]
}


validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addClassification", {
      errors: errors.array(),
      title: "Add Classification",
      nav,
      flashMessage: [],
    });
    return;
  }
  next();
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const classifications = await invModel.getClassifications();
  const classificationList = classifications.rows.map(c => 
    `<option value="${c.classification_id}" ${req.body.classification_id == c.classification_id ? 'selected' : ''}>${c.classification_name}</option>`
  ).join('');
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addInventory", {
      errors: errors.array(),
      title: "Add vehicle in Inventary",
      nav,
      flashMessage: [],
      classificationList,
    });
    return;
  }
  next();
}

/* ***************************
 * Check Update Data
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_id
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}


module.exports = validate;
