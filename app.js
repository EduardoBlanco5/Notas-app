const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
const notasRoutes = require("./routes/notasRoutes");
const cloudinary = require('./config/cloudinaryConfig'); // Importar configuración de Cloudinary

dotenv.config();
const app = express();



// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/notas", notasRoutes);
// Servir los archivos de la carpeta 'uploads' como archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
