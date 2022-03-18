var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumption = new Schema({
  username: String,
  product_id: String,
  num_consumption: Number,
  last_consumption: Date,
  imagen: String,
  kcal_100g: Number,
  grasa_100g: Number,
  carbohidratos_100g: Number,
  proteinas_100g: Number,
  
});

module.exports = mongoose.model('consumption', consumption);