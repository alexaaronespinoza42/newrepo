const pool = require("../database");
const invModel = {}; 

/* ***************************
 *  Get all classification data
 * ************************** */
invModel.getClassifications = async function() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
invModel.getInventoryByClassificationId = async function(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
invModel.getInventoryById = async function(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`, 
      [invId]
    );
    
    if (data.rows.length === 0) {
      return null;
    }

    const vehicle = data.rows[0];

    return {
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_price: vehicle.inv_price,
      inv_miles: vehicle.inv_miles,
      inv_color: vehicle.inv_color,
      inv_description: vehicle.inv_description,
      inv_image: vehicle.inv_image,
    };

  } catch (error) {
    console.error("Error en getInventoryById:", error);
    return null;
  }
}

module.exports = invModel;
