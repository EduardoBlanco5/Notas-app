const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;