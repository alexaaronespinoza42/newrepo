const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view by inventory ID
router.get("/detail/:invId", invController.buildByInvId);

// Management Route
router.get('/', invController.managementView); // Sin prefijo '/inv'

// Ruta para ver el formulario de añadir clasificación
router.get('/add-classification', invController.addClassificationView); // Sin prefijo '/inv'

// Ruta para procesar el formulario de añadir clasificación
// router.post('/add-classification', invController.addClassification); // Sin prefijo '/inv'

// Ruta para ver el formulario de añadir inventario
router.get('/add-inventory', invController.addInventoryView); // Sin prefijo '/inv'

// Ruta para procesar el formulario de añadir inventario
// router.post('/add-inventory', invController.addInventory); // Sin prefijo '/inv'

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

// Error 500
router.get('/trigger-error', (req, res, next) => {
  const error = new Error("Intentional Error for 500");
  error.status = 500;
  next(error);
});

module.exports = router;
