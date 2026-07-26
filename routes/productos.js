const express = require("express");
const Producto = require("../models/productomodel");

const router = express.Router();

// Crear un nuevo producto.
router.post("/productos", async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear el producto",
      error: error.message,
    });
  }
});


// Obtener todos los productos.
router.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.find();

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los productos",
      error: error.message,
    });
  }
});


// Obtener un producto por su ID.
router.get("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({
      mensaje: "ID de producto inválido",
      error: error.message,
    });
  }
});


// Actualizar el stock de varios productos.
router.put("/productos/actualizar-stock", async (req, res) => {
  try {
    const actualizaciones = req.body;

    // Comprobar que el cuerpo sea un arreglo con al menos un producto.
    if (!Array.isArray(actualizaciones) || actualizaciones.length === 0) {
      return res.status(400).json({
        mensaje: "Debés enviar un arreglo de productos para actualizar",
      });
    }

    // Validar todas las actualizaciones antes de modificar la base.
    const datosInvalidos = actualizaciones.some(
      (producto) =>
        !producto.id ||
        !Number.isInteger(producto.cantidad) ||
        producto.cantidad < 0
    );

    if (datosInvalidos) {
      return res.status(400).json({
        mensaje:
          "Cada producto debe incluir un ID y una cantidad entera mayor o igual a cero",
      });
    }

    const productosActualizados = [];

    for (const actualizacion of actualizaciones) {
      const productoActualizado = await Producto.findByIdAndUpdate(
        actualizacion.id,
        {
          cantidad: actualizacion.cantidad,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!productoActualizado) {
        return res.status(404).json({
          mensaje: `No se encontró el producto con ID ${actualizacion.id}`,
        });
      }

      productosActualizados.push(productoActualizado);
    }

    res.status(200).json({
      mensaje: "Stock actualizado correctamente",
      productos: productosActualizados,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el stock",
      error: error.message,
    });
  }
});


// Actualizar un producto por su ID.
router.put("/productos/:id", async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!productoActualizado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el producto",
      error: error.message,
    });
  }
});


// Eliminar un producto por su ID.
router.delete("/productos/:id", async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(
      req.params.id
    );

    if (!productoEliminado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.status(200).json({
      mensaje: "Producto eliminado correctamente",
      producto: productoEliminado,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al eliminar el producto",
      error: error.message,
    });
  }
});


// Obtener productos por categoría.
router.get("/productos/categoria/:categoria", async (req, res) => {
  try {
    const categoria = req.params.categoria;

    const productos = await Producto.find({
      categoria: categoria,
    });

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los productos por categoría",
      error: error.message,
    });
  }
});


// Obtener productos con bajo stock.
router.get("/productos/bajo-stock/:cantidad", async (req, res) => {
  try {
    const cantidad = Number(req.params.cantidad);

    if (!Number.isInteger(cantidad) || cantidad < 0) {
      return res.status(400).json({
        mensaje: "La cantidad debe ser un número entero mayor o igual a cero",
      });
    }

    const productos = await Producto.find({
      cantidad: {
        $lt: cantidad,
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los productos con bajo stock",
      error: error.message,
    });
  }
});

module.exports = router;
