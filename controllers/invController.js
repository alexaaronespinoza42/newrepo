const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data.length) {
      return res.status(404).render("errors/404", { title: "Classification Not Found" })
    }

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav();
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error fetching classification:", error)
    res.status(500).send("Internal Server Error")
  }
}

/* ***************************
 *  Build inventory detail view by inventory ID
 * ************************** */
invController.buildByInvId = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const data = await invModel.getInventoryById(invId)

    if (!data) {
      return res.status(404).render("errors/404", { title: "Vehicle Not Found" })
    }

    const details = await utilities.buildDetailView(data)
    const nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      details,
    })
  } catch (error) {
    console.error("Error fetching vehicle details:", error)
    res.status(500).send("Internal Server Error")
  }
}

module.exports = invController;
