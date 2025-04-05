const db = require('../config/firebase');  // Asegúrate de que esto esté configurado correctamente
const cloudinary = require('cloudinary').v2;

// Función para subir imagen a Cloudinary
const subirImagen = async (archivo) => {
    try {
      // Subir el archivo físico de la carpeta 'uploads' a Cloudinary
      const result = await cloudinary.uploader.upload(archivo.path, {
        folder: 'costura',  // Nombre del folder en Cloudinary
        public_id: `costura_${Date.now()}`,  // Nombre único basado en la fecha
        resource_type: 'auto',  // Detecta automáticamente el tipo de archivo (imagen, video, etc.)
      });
    
      return result.secure_url;  // Devuelve la URL segura para acceder a la imagen
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      throw new Error('Error al subir la imagen a Cloudinary');
    }
  };

 // Función para obtener los detalles de una nota por su ID
exports.obtenerNota = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID de la nota desde los parámetros de la ruta
        // Aquí deberías hacer una consulta a tu base de datos para obtener la nota
        // Asumiendo que estás usando Firebase, MongoDB o una base de datos SQL
        // Aquí un ejemplo con Firebase Firestore:

        const docRef = await db.collection("notas").doc(id).get();
        
        if (!docRef.exists) {
            return res.status(404).json({ error: "Nota no encontrada" });
        }

        // Devuelve los datos de la nota
        res.json({ id: docRef.id, ...docRef.data() });

    } catch (error) {
        res.status(500).json({ error: "Error al obtener la nota", detalle: error.message });
    }
};
 
// Agregar una nueva nota
exports.agregarNota = async (req, res) => {
    try {
        const { materiales, lugar, agregadoPor } = JSON.parse(req.body.data);
        const archivos = req.files;

        // Subir la imagen de "Costura" si está presente en los materiales
        for (let i = 0; i < materiales.length; i++) {
            if (materiales[i].nombre.toLowerCase() === 'costura' && archivos && archivos['costura']) {
                // Subir la imagen a Cloudinary
                const imagenURL = await subirImagen(archivos['costura'][0]);  // Subir imagen a Cloudinary
                materiales[i].foto = imagenURL;  // Guardar la URL de la imagen
            }
        }

        // Calcular el total
        const total = materiales.reduce((acc, material) => acc + (material.precio || 0), 0);

        const nuevaNota = {
            materiales,
            lugar,
            total,
            estatus: "pendiente",
            agregadoPor,
            timestamp: new Date().toISOString(),
        };

        // Guardar la nueva nota en Firestore (Firebase)
        const docRef = await db.collection("notas").add(nuevaNota);
        res.json({ id: docRef.id, ...nuevaNota });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar la nota", detalle: error.message });
    }
};



// Obtener todas las notas
exports.obtenerNotas = async (req, res) => {
    try {
        const snapshot = await db.collection("notas").get();
        const notas = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            materiales: doc.data().materiales,  // Aquí estamos obteniendo los materiales de la nota
        }));
        res.json(notas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las notas", detalle: error.message });
    }
};

// Marcar nota como surtida
exports.actualizarNota = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection("notas").doc(id).update({ estatus: "surtido" });
        res.json({ message: "Nota actualizada" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la nota", detalle: error.message });
    }
};

// Eliminar una nota
exports.eliminarNota = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection("notas").doc(id).delete();
        res.json({ message: "Nota eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la nota", detalle: error.message });
    }
};
