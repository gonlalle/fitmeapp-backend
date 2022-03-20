var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alimentoSchema = new Schema({
  nombre: String,
  url: String,
  codigo_barra: String,
  creado_por: String,
  marca: String,
  imagen: String,
  imagen_peq: String,
  kcal_100g: Number,
  grasa_100g: Number,
  'grasas-std_100g': Number,
  carbohidratos_100g: Number,
  azucares_100g: Number,
  proteinas_100g: Number,
  sal_100g: Number,
  sodio_100g: Number,
  fibra_100g: Number,
  colesterol_100g: Number,
  potasio_100g: Number,
  alergenos: String,
  verificado: Boolean
});

module.exports = mongoose.model('alimento', alimentoSchema);
