const pool = require("../database");
const invModel = {}; 

/* ***************************
 *  Get all classification data
 * ************************** */
invModel.getClassifications = async function () {
  return await pool.query("SELECT * FROM classification ORDER BY classification_name");
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
      inv_thumbnail: vehicle.inv_thumbnail
    };

  } catch (error) {
    console.error("Error en getInventoryById:", error);
    return null;
  }
}

invModel.addClassification = async function(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    await pool.query(sql, [classification_name]);
  } catch (error) {
    throw new Error("Database Error: " + error);
  }
}

invModel.addInventory = async function(make, model, description, image, thumbnail, price, year, miles, color, classification_id) {
  try {
    const sql = `
      INSERT INTO inventory 
      (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `;
    await pool.query(sql, [make, model, description, image, thumbnail, price, year, miles, color, classification_id]);
  } catch (error) {
    throw new Error("Error inserting inventory: " + error);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invModel.updateInventory = async function(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      UPDATE public.inventory
      SET inv_make = $1,
          inv_model = $2,
          inv_description = $3,
          inv_image = $4,
          inv_thumbnail = $5,
          inv_price = $6,
          inv_year = $7,
          inv_miles = $8,
          inv_color = $9,
          classification_id = $10
      WHERE inv_id = $11
      RETURNING *;
    `
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("Update error:", error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invModel.deleteInventoryItem = async function (inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const result = await pool.query(sql, [inv_id])
    return result
  } catch (error) {
    console.error("Delete Inventory Error:", error)
    return { rowCount: 0 }
  }
}


module.exports = invModel;
