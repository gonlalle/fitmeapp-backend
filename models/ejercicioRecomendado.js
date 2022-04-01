var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ejercicioRecomendado = new Schema({
    _id: Number,
    uuid: String,
    ejercicio: Number,
    hecho: Boolean,
    intensidad: Number,
    tiempo: Number,
});

module.exports = mongoose.model('ejerciciosRecomendados', ejercicioRecomendado);
