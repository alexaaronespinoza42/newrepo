// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
console.log("InvController:", invController)
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view by inventory ID
router.get("/detail/:invId", invController.buildByInvId);

// Error 500
router.get('/trigger-error', (req, res, next) => {
  const error = new Error("Intentional Error for 500");
  error.status = 500;
  next(error);  
});

module.exports = router;