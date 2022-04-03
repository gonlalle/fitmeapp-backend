var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dia = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    pesoActual: Number,
    ejercicios:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'EjercicioRecomendado'
        }],
        default: []
    },
	consumicionesDesayuno: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Consumicion'
        }],
        default: []
    },
	consumicionesAlmuerzo: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Consumicion'
        }],
        default: []
    },
	consumicionesCena: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Consumicion'
        }],
        default: []
    },
	pasosObjetivo: Number,
	pasosRealizados: {
        type: Number,
        default: 0
    },
	kcalRec: Number,
	proteinasRec: Number,
	carbRec: Number,
	grasasRec: Number,
	pasosRec: Number,
	kcalIngeridasDesayuno: {
        type: Number,
        default: 0
    },
	proteinasIngeridasDesayuno: {
        type: Number,
        default: 0
    },
	carbIngeridasDesayuno: {
        type: Number,
        default: 0
    },
	grasasIngeridasDesayuno: {
        type: Number,
        default: 0
    },
	kcalIngeridasAlmuerzo: {
        type: Number,
        default: 0
    },
	proteinasIngeridasAlmuerzo: {
        type: Number,
        default: 0
    },
	carbIngeridasAlmuerzo: {
        type: Number,
        default: 0
    },
	grasasIngeridasAlmuerzo: {
        type: Number,
        default: 0
    },
	kcalIngeridasCena: {
        type: Number,
        default: 0
    },
	proteinasIngeridasCena: {
        type: Number,
        default: 0
    },
	carbIngeridasCena: {
        type: Number,
        default: 0
    },
	grasasIngeridasCena: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('dia', dia);