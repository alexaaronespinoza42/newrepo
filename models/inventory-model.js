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
    // Hacemos la consulta a la base de datos para obtener los detalles del vehículo
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`, 
      [invId]
    );
    
    // Si la consulta no devuelve resultados, retornamos null
    if (data.rows.length === 0) {
      return null;
    }

    // Aseguramos que los datos devueltos tengan las claves adecuadas
    const vehicle = data.rows[0];

    // Podemos devolver solo el objeto que necesitamos para el detalle del vehículo
    return {
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_price: vehicle.inv_price,
      inv_miles: vehicle.inv_miles,
      inv_color: vehicle.inv_color,
      inv_description: vehicle.inv_description,
      inv_image: vehicle.inv_image, // Asegúrate de que la clave de la imagen sea correcta
    };

  } catch (error) {
    console.error("Error en getInventoryById:", error);
    return null;
  }
}

module.exports = invModel;
