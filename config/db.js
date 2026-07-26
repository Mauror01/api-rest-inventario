const mongoose = require("mongoose");

const dbconnect = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/dbInventario"
    );

    console.log("Conexión a la base de datos establecida");
  } catch (error) {
    console.error(
      "Error al conectar con la base de datos:",
      error.message
    );
  }
};

module.exports = dbconnect;