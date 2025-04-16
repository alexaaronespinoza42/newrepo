const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view by inventory ID
router.get("/detail/:invId", invController.buildByInvId);

// Management Route
router.get('/', invController.managementView); 

// Route add Classification
router.get('/add-classification', invController.addClassificationView); 

// Route add Inventory
router.get('/add-inventory', invController.addInventoryView); 

router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  invController.addClassification
);

router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  invController.addInventory
);

router.get("/getInventory/:classification_id", invController.getInventoryJSON);

router.get("/edit/:inv_id", invController.editInventoryView)

router.post(
  "/update",
  validate.inventoryRules(),
  validate.checkUpdateData,
  invController.updateInventory
)

router.get("/delete/:inv_id", invController.deleteInventoryView);

router.post("/delete", invController.deleteInventoryItem);


// Error 500
router.get('/trigger-error', (req, res, next) => {
  const error = new Error("Intentional Error for 500");
  error.status = 500;
  next(error);
});


module.exports = router;
