var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var d = new Date();

const consumicionSchema = new Schema({
  fecha: {
    type: Date,
    default: Date.now
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
  alimento:
        {
            type: Schema.Types.ObjectId,
            ref: 'Alimento'
        },
  cantidad: Number,
  tipo: String,
  calculadora: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('consumicion', consumicionSchema);