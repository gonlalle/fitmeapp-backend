var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ejercicio_ejecucion = new Schema({
    _id: String,
    fecha: {
        type: Date,
        default: Date.now
      },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ejercicio: Number,
    intensidad: {
        type: String,
        enum : ["Baja","Media","Alta"],
        default: "Media"
      },
    segundos: Number, // (Diego) Mi idea es que se guarde el tiempo en segundos porque tengo entendido que mongoose solo acepta timestamps que incluyen fechas,
    // se podría añadir un paraámetro minutos, para no tener que hacer conversiones de minutos:segundos a segundos y viceversa, pero añadiría un
    // dato más que es innecesario a cada documento de la colección a cambio de evitar un pequeño cálculo.
    hecho: Boolean,
    recomendado: Boolean
}, { collection: 'ejercicio_ejecuciones' }); // Sin el segundo parámetro, mongoose crearia una colección ejercicio_ejecucions (el nombre de este schema 
// con s al final), pero nosotros la hemos creado ya con el nombre ejercicio_ejecuciones. Este segundo parámetro hace el mapeo de este schema y esa 
// colección.

module.exports = mongoose.model('ejercicio_ejecucion', ejercicio_ejecucion);
