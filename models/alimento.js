var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alimentoSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nombre: String,
  url: String,
  codigo_barra: String,
  creado_por: String,
  marca: String,
  imagen: String,
  imagen_peq: String,
  kcal_100g: {
    type: Number,
    default: 0
  },
  grasa_100g: {
    type: Number,
    default: 0
  },
  'grasas-std_100g': {
    type: Number,
    default: 0
  },
  carbohidratos_100g: {
    type: Number,
    default: 0
  },
  azucares_100g: {
    type: Number,
    default: 0
  },
  proteinas_100g: {
    type: Number,
    default: 0
  },
  sal_100g: {
    type: Number,
    default: 0
  },
  sodio_100g: {
    type: Number,
    default: 0
  },
  fibra_100g: {
    type: Number,
    default: 0
  },
  colesterol_100g: {
    type: Number,
    default: 0
  },
  potasio_100g: {
    type: Number,
    default: 0
  },
  alergenos: String,
  verificado: {
    type: Boolean,
    default: false
},
  etiquetas: [String]
});

module.exports = mongoose.model('alimento', alimentoSchema);



