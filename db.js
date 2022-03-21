require("dotenv").config();
const mongoose = require("mongoose");

const Ejercicio = require("./models/ejercicio");

const DB_URL = process.env.MONGO_URL || "mongodb://localhost/fitmeapp"

const dbConnect = function () {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection error: "));
  return mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  });
};

// Ejercicio.find({descripcion: {$ne: null}}).then(res => {
//   for (let ejercicio of res) {
//     ejercicio.description = ejercicio.description.replace(/(<p>)+/gm, "")
//     ejercicio.description = ejercicio.description.replace(/(<\/p>)+/gm, "")
//     console.log("Ejercicio: ", ejercicio)
//     ejercicio.save()
//   }
// })


// Ejercicio.find({images: {$exists: false}}).then(ejercicios => {
//   for (let ejercicio of ejercicios) {
//     ejercicio.images = []
//     ejercicio.save()
//   }
// })

module.exports = dbConnect;