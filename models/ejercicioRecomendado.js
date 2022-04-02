var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ejercicioRecomendado = new Schema({
    fecha: {
        type: Date,
        default: Date.now
      },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ejercicio: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    },
    intensidad: {
        type: String,
        enum : ["Baja","Media","Alta"],
        default: "Media"
      },
    tiempo: Number,
    hecho: Boolean
});

module.exports = mongoose.model('ejerciciosRecomendados', ejercicioRecomendado);
