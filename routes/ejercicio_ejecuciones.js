const router = require('express').Router();
// Require Item model in our routes module
var Ejecucion = require('../models/ejercicio_ejecucion');
var Ejercicio = require('../models/ejercicio');
var Usuario = require('../models/user');
const mongoose = require("mongoose");
'use strict';
const fs = require('fs');

const moment = require('moment');
const today = moment().startOf('day')
    /* [
        {name: 'Poca o ninguna', code: 'ninguna'},
        {name: 'Ejercicio moderado', code: 'ejercicio_moderado'},
        {name: 'Ejercicio muy fuerte', code: 'ejercicio_muy_fuerte'}
    ] */   

/* ESTO ES EL VO2 MAXIMO QUE SIRVE PARA CALCULAR EL MET PARA PODER CALCULAR LAS KCAL/MIN QUEMADAS.
 * LO HE PILLADO DE INTERNET, SIN EMBARGO, SOY CONSCIENTE DE QUE PUEDE ESTAR MAL PORQUE TAMBIÉN 
 * DEBERÍA DEPENDER DE LA EDAD DE LA PERSONA (O ESO CREO) Y NO SOLO DEL NIVEL DE ACTIVIDAD FISICA. 
 * UN SALUDO, ANGEL.    
*/
const dctActividadFisica = {
    'Baja':14,
    'Media':32.5,
    'Alta': 42.5
};

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

// Get by id
router.get('/:ejecucionId', async (req, res) => {
    try {
        const ejecucionId = mongoose.Types.ObjectId(req.params.ejecucionId);
        const items = await Ejecucion.findOne({_id:ejecucionId});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// OBTENER EJERCICIOS DE HOY HECHOS POR UN USUARIO
router.get('/done/:userId', async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);
    try {
        const items = await Ejecucion.find({$and: [{"hecho":true}, {"fecha": {$gte: today.toDate(),$lte: moment(today).endOf('day').toDate()}},
                                                    {'usuario': mongoose.Types.ObjectId(userId)}]});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

router.get('/done/:userId/:fecha', async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);
    let fechaInicio = new Date(req.params.fecha);
    fechaInicio.setHours(0,0,0,0)
    let fechaFin = new Date(req.params.fecha);
    fechaFin.setHours(23,59,59,999)
    try {
        const items = await Ejecucion.find({$and: [{"hecho": true}, {"fecha": {$gte: fechaInicio, $lte: fechaFin}}, {'usuario': userId}]});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

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
                ejecucion.kcal = 0;
                ejecucion.recomendado = true;
                ejecucion.hecho = false;
                ejecucion.usuario = userId;
                ejecucion.save();
                resEjecucion = ejecucion.toObject()
                resEjecucion.ejercicioDetalles = [ej];
                items.push(resEjecucion);
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

router.get('/:userId/:fecha/:exerciseId', async (req, res) => {
    try {
        const userId = req.params.userId
        const exerciseId = req.params.exerciseId
        let fechaInicio = new Date(req.params.fecha);
        let fechaFin = new Date(req.params.fecha);
        fechaInicio.setHours(0,0,0,0)
        fechaFin.setHours(23,59,59,999)

        const ejecucion = await Ejecucion.findOne({ejercicio: exerciseId, usuario: userId, fecha: {$gte: fechaInicio, $lt: fechaFin}});
        res.json(ejecucion);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});


router.post('/', async (req, res) => {
    try{
        const ejercicioRealizado = req.body;
        // COMPROBAMOS SI SE HA RECOMENDADO DICHO EJERCICIO HOY Y NO ESTÁ REALIZADO
        let ejercicio_ejecucion = await Ejecucion.find({$and: [{"hecho":false}, {"fecha": {$gte: today.toDate(),$lte: moment(today).endOf('day').toDate()}},
                                                    {'usuario': mongoose.Types.ObjectId(ejercicioRealizado.usuario)}, 
                                                    {"ejercicio":mongoose.Types.ObjectId(ejercicioRealizado.ejercicio)}]});
        
        ejercicio_ejecucion = ejercicio_ejecucion[0];
        //OBTENEMOS AL USUARIO QUE HA REALIZADO EL EJERCICIO PARA SACAR SU PESO Y ACTIVIDAD FISICA
        const usuario = await Usuario.findOne({_id: ejercicioRealizado.usuario});
        const peso = usuario.peso_actual;

        //CALCULAMOS LAS KCAL QUEMADAS
        const vo2 = dctActividadFisica[ejercicioRealizado.intensidad];
        //MET -> Equivalente Metabólico de Actividad (1 MET = 3,5 ml O2/kg x min)
        const met = round(vo2/3.5)
        const kcal_min = round(met*0.0175*peso)
        const kcal = round(kcal_min*ejercicioRealizado.minutos)
        
        //SI EXISTE LA RECOMENDACIÓN, ACTUALIZAMOS DICHA RECOMENDACIÓN
        if (ejercicio_ejecucion){
            ejercicio_ejecucion.intensidad = ejercicioRealizado.intensidad;
            ejercicio_ejecucion.minutos = ejercicioRealizado.minutos;
            ejercicio_ejecucion.kcal = kcal;
            ejercicio_ejecucion.hecho = true;
            const ejecucionDB = await Ejecucion.findByIdAndUpdate(ejercicio_ejecucion._id, ejercicio_ejecucion);
            res.status(200).json(ejecucionDB);
        //SI NO EXISTE DICHA RECOMENDACIÓN, LA CREAMOS
        }else{
            var ejecucion = new Ejecucion();
            ejecucion._id = new mongoose.Types.ObjectId();
            ejecucion.intensidad = ejercicioRealizado.intensidad;
            ejecucion.fecha = new Date();
            ejecucion.ejercicio  = ejercicioRealizado.ejercicio
            ejecucion.minutos = ejercicioRealizado.minutos;
            ejecucion.recomendado = false;
            ejecucion.kcal = kcal;
            ejecucion.hecho = true;
            ejecucion.usuario = ejercicioRealizado.usuario;
            const ejecucionDB = await Ejecucion.create(ejecucion);
            res.status(200).json(ejecucionDB);
        }
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

router.put('/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body; 
    try {
        const usuario = await Usuario.findOne({_id: body.usuario});

        const vo2 = dctActividadFisica[body.intensidad];
        const met = round(vo2/3.5)
        const kcal_min = round(met*0.0175*usuario.peso_actual)
        body.kcal = round(kcal_min*body.minutos)

        let ejecucionDB = await Ejecucion.findByIdAndUpdate(_id, body);
        
        res.status(200).json(ejecucionDB);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
});

router.delete('/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        let ejecucionDB = await Ejecucion.findById(_id);
        ejecucionDB.hecho = false
        ejecucionDB.save()
        res.status(200).json(ejecucionDB);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
});

function round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

module.exports = router; 