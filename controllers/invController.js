const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const flash = require("connect-flash");

const invController = {}

// Método para mostrar la vista de administración
invController.managementView = async (req, res) => {
  const flashMessage = req.flash('notice',"Inventory Added")
  const nav = await utilities.getNav(); 
  res.render('inventory/managementView', { 
    flashMessage, 
    title: "Inventory Administration", 
    nav 
  });
};


invController.addClassificationView = (req, res) => {
  const flashMessage = req.flash('notice',"Classification Added") 

  const nav = `
    <ul>
      <li><a href='/'>Home</a></li>
      <li><a href='/inv/type/1'>Custom</a></li>
      <li><a href='/inv/type/2'>Sedan</a></li>
      <li><a href='/inv/type/3'>SUV</a></li>
      <li><a href='/inv/type/4'>Truck</a></li>
    </ul>
  `;

  res.render("inventory/addClassification", {
    title: "Add Classification",
    nav,
    flashMessage,
    errors: [],
    classificationName: ""
  });
};



invController.addClassification = async (req, res) => {
  const { classificationName } = req.body;

  // Validación simple
  if (!/^[a-zA-Z0-9]+$/.test(classificationName)) {
    req.flash('message', "The name of the classification can't contain special caracters or spaces in between");
    return res.redirect('/inv/add-classification');
  }

  try {
    await invModel.addClassification(classificationName);

    const nav = await utilities.getNav();
    const flashMessage = req.flash("notice","Classification Added");

    res.render('inventory/managementView', {
      title: 'Inventory Administration',
      nav,
      flashMessage
    });
  } catch (err) {
    req.flash('message', 'Error adding new Classification.');
    res.redirect('/inv/add-classification');
  }
}

invController.addInventoryView = async (req, res) => {
  const flashMessage = req.flash("notice","Vehicle Added");
  const nav = await utilities.getNav();
  const classifications = await invModel.getClassifications();
  const classificationList = classifications.rows.map(c =>
    `<option value="${c.classification_id}">${c.classification_name}</option>`
  ).join("");

  res.render("inventory/addInventory", {
    title: "Add New Vehicle",
    nav,
    flashMessage,
    classificationList,
    errors: [],
    vehicleName: "",
    make: "",
    model: "",
    description: "",
    image_path: "",
    thumbnail_path: "",
    price: "",
    year: "",
    miles: "",
    color: ""
  });
};

// Método para procesar el formulario de añadir inventario
invController.addInventory = async (req, res) => {
  const {
    make, model, description,
    image_path, thumbnail_path, price,
    year, miles, color, classification_id
  } = req.body;

  try {
    await invModel.addInventory(
      make, model, description,
      image_path, thumbnail_path, price,
      year, miles, color, classification_id
    );

    const nav = await utilities.getNav();
    req.flash('message', 'Vehicle added.');

    res.render('inventory/managementView', {
      title: 'Inventory Administration',
      nav,
      flashMessage: req.flash('message')
    });

  } catch (err) {
    req.flash('message', 'Error adding vehicle.');
    res.redirect('/inv/add-inventory');
  }
}



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
