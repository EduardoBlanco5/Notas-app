const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: 'drykewdqh', // Sustituye por tu cloud name
  api_key: '239179887547838',       // Sustituye por tu api key
  api_secret: 'SrJMmcW4uf9M7Yb77fPGqmLQRtk'  // Sustituye por tu api secret
});

module.exports = cloudinary;
