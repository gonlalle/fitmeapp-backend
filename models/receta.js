var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredienteSchema = new Schema({
    ingrediente: String,
    cantidad: String
});

const recetaSchema = new Schema({
  nombre: String,
  raciones: Number,
  ingredientes: [ingredienteSchema],
  pasos: [String]
});

module.exports = mongoose.model('receta', recetaSchema);