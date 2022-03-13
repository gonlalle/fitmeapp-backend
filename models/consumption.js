var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumption = new Schema({
  username: String,
  product_id: String,
  num_consumption: Number,
  last_consumption: String,
});

module.exports = mongoose.model('consumption', consumption);