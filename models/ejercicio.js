var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ejercicio = new Schema({
    uuid: String,
    name: String,
    images: [String],
    exercise_base: Number,
    status: String,
    description: String,
    creation_date: String,
    category: Number,
    muscles: Array,
    muscles_secondary: Array,
    equipment: Array,
    language: Number,
    license: Number,
    license_author: String,
    variations: Array,
});

module.exports = mongoose.model('exercise', ejercicio);