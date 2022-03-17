var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumption = new Schema({
  username: String,
  product_id: String,
  num_consumption: Number,
  last_consumption: Date,
  image_url: String,
  energy_kcal_100g: Number,
  fat_100g: Number,
  carbohydrates_100g: Number,
  proteins_100g: Number,
  
});

module.exports = mongoose.model('consumption', consumption);