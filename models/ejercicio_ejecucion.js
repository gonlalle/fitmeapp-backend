var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ejercicio_ejecucion = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    minutos: Number, 
    hecho: Boolean,
    recomendado: Boolean
}, { collection: 'ejercicio_ejecuciones' }); // Sin el segundo parámetro, mongoose crearia una colección ejercicio_ejecucions (el nombre de este schema 
// con s al final), pero nosotros la hemos creado ya con el nombre ejercicio_ejecuciones. Este segundo parámetro hace el mapeo de este schema y esa 
// colección.

module.exports = mongoose.model('ejercicio_ejecucion', ejercicio_ejecucion);
