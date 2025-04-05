const multer = require('multer');
const path = require('path');

// Definir el almacenamiento local para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname); // Obtener la extensión del archivo
    cb(null, `costura_${Date.now()}${fileExtension}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
