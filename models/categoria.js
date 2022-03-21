var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoria = new Schema({
    _id: Number,
    name: String,
});

module.exports = mongoose.model('categorie', categoria);