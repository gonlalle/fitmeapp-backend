var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musculo = new Schema({
    _id: Number,
    name: String,
    url_main: String,
    url_sec: String,
});

module.exports = mongoose.model('muscle', musculo);