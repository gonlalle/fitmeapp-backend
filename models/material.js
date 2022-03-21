var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const material = new Schema({
    _id: Number,
    name: String,
});

module.exports = mongoose.model('equipment', material);