var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const food = new Schema({
  code: String,
  url: String,
  product_name: String,
  countries_en: String,
  image_url: String,
  image_small_url: String,
  image_ingredients_url: String,
  image_ingredients_small_url: String,
  image_nutrition_url: String,
  image_nutrition_small_url: String,
  energy_kcal_100g: Number,
  fat_100g: Number,
  saturated_fat_100g: Number,
  carbohydrates_100g: Number,
  sugars_100g: Number,
  proteins_100g: Number,
  salt_100g: Number,
  sodium_100g: Number
});

module.exports = mongoose.model('Food', food);
