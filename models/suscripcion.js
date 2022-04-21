var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suscripcion = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: {}
    },
    fechaInicio: Date,
    fechaFin: Date,
    precio: Number
});

module.exports = mongoose.model('suscripcion', suscripcion);