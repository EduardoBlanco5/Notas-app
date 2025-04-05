const express = require('express');
const router = express.Router();
const notasController = require('../controllers/notasController');
const upload = require('../middleware/upload');

// Rutas para notas
router.get("/", notasController.obtenerNotas);

// Ruta para obtener una nota por su ID
router.get("/:id", notasController.obtenerNota);


// Ruta para agregar una nueva nota, que incluye subir archivos
router.post("/", upload.fields([{ name: 'costura', maxCount: 1 }]), notasController.agregarNota);

// Ruta para actualizar el estatus de la nota
router.put("/:id", notasController.actualizarNota);

// Ruta para eliminar una nota
router.delete("/:id", notasController.eliminarNota);

// Ruta para agregar una nueva nota (incluyendo imagen)
router.post('/agregar', upload.fields([{ name: 'costura', maxCount: 1 }]), notasController.agregarNota);

module.exports = router;
