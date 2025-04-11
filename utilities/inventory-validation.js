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
    body("vehicleName")
      .trim()
      .notEmpty()
      .withMessage("The name of the vehicle is required."),
    body("classification_id")
      .isInt()
      .withMessage("Select a valid classification."),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("The price must be a positive integeter."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addClassification", {
      errors: errors.array(),
      title: "Añadir Clasificación",
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

module.exports = validate;
