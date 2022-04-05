const router = require('express').Router();
// Require Item model in our routes module
var Ejecucion = require('../models/ejercicio_ejecucion');
var Ejercicio = require('../models/ejercicio');
const mongoose = require("mongoose");
'use strict';
const fs = require('fs');

const moment = require('moment');
const today = moment().startOf('day')



// Get de Recomendados
router.get('/recomendacion/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        //OBTIENE LAS RECOMENDACIONES DE HOY Y LE AÑADE LOS DETALLES DEL EJERCICIO RELACIONADO
        let items = await Ejecucion.aggregate()
                        .match({'$and': [{"recomendado":true}, {"fecha": {$gte: today.toDate(),$lte: moment(today).endOf('day').toDate()}},
                                            {'usuario': mongoose.Types.ObjectId(userId)}]})
                        .lookup({from:'exercises',as:'ejercicioDetalles',localField:'ejercicio',foreignField:'_id'});
        
        //SI NO TIENE EJERCICIOS RECOMENDADOS, LOS CREA, GUARDA Y LOS AÑADE A items
        if (items.length < 1) {
            for (let i=8; i < 15; i++){

                let ej = await Ejercicio.aggregate().match({ "category": { "$eq": i } }).sample(1);
                ej = ej[0];
                              
                var ejecucion = new Ejecucion();
                ejecucion._id = new mongoose.Types.ObjectId();
                ejecucion.ejercicio  = ej._id;
                ejecucion.minutos = 0;
                ejecucion.recomendado = true;
                ejecucion.hecho = false;
                ejecucion.usuario = userId;
                ejecucion.save();
                ejecucion.ejercicioDetalles = ej;
                items.push(ejecucion);
            }
        } 
        res.json(items);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Get by id
router.get('/:ejecucionId', async (req, res) => {
    try {
        const ejecucionId = Number(req.params.ejecucionId);
        const items = await Ejecucion.find({ejecucionId});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Get by exercise id 
router.get('/:ejercicioId', async (req, res) => {
    try {
        const ejercicioId = Number(req.params.ejercicioId);
        const items = await Ejercicio.find({"ejercicio":ejercicioId});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Get by completion
router.get('/:done', async (req, res) => {
    try {
        const numb = Number(req.params.done);
        if (numb==1) {
            const done = true;
        }
        else {
            const done = false;
        }
        const items = await Ejecucion.find({"hecho":true});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Get con todos los documentos
router.get('/', async (req, res) => {
    try {
        const items = await Ejercicio.find();
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Exportamos la configuración de express app
module.exports = router; 