const express = require("express");
const dbconnect = require("./config/db");
const productosRoutes = require("./routes/productos");

const app = express();
const PORT = 3000;

// Permite recibir información en formato JSON.
app.use(express.json());

// Activa las rutas relacionadas con productos.
app.use(productosRoutes);

// Ruta inicial para comprobar que el servidor funciona.
app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "API de inventario funcionando correctamente",
  });
});

// Primero conecta MongoDB y después inicia el servidor.
dbconnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
  });
});