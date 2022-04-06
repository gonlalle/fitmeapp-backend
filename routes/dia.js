const axios = require('axios');
const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose');
const mongoDB = require('mongodb');
const Dia = require('../models/dia');
const Usuario = require('../models/user');
const Alimento = require('../models/alimento');
const Consumicion = require('../models/consumicion');


router.get('/', async(req, res) => {
    try {
        const diaDB = await Dia.find();
        res.json(diaDB);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

 router.get('/:id', async(req, res) => {
 const _id = req.params.id;
     try {
         const diaDB = await Dia.findOne({"_id": _id});
         res.json(diaDB);
     } catch (error) {
         return res.status(400).json({
         mensaje: 'An error has occurred',
         error
         })
     }
 });

router.post('/', async(req, res) => {
    const body = req.body;
    body._id = new Mongoose.Types.ObjectId()  
    try {
    console.log("Posting a new dia")
    const diaDB = await Dia.create(body);
    res.status(200).json(diaDB); 
    } catch (error) {
        console.log(error)
    return res.status(500).json({
        mensaje: 'An error has occurred',
        error
    })
    }
});

router.get('/:username/:fecha', async(req, res) => {
    //if(req.params.username == req.query.username){
        const username = req.params.username;
        const fecha = req.params.fecha;

        const usuarioDB = await Usuario.findOne({"username": username});

        try{
            const diaDB = await Dia.findOne({"usuario": usuarioDB._id, "fecha":{$gte: new Date(fecha), $lte:Date(fecha + "T23:59:59.999Z")}});
            res.json(diaDB);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                mensaje: "Se ha producido un error",
                error
            })
        }
    /* }else{
        return res.status(403).json({
            mensaje: "Acceso no permitido",
            error
        })
    } */
});

router.get('/:username/:fecha/:tipo', async(req, res) => {
    //if(req.params.username == req.query.username){
        const username = req.params.username;
        const fecha = req.params.fecha;
        const tipo = req.params.tipo;
        var comidasJson = [];
        const imagenPlaceholder = "https://www.club33rpm.com/wp-content/themes/themes/club33rpm/assets/images/sin-imagen.jpg";

        const usuarioDB = await Usuario.findOne({"username": username});

        try{
            const diaDB = await Dia.findOne({"usuario": usuarioDB._id, "fecha":{$gte: new Date(fecha), $lte:Date(fecha + "T23:59:59.999Z")}});
            
            if(tipo == 'Desayuno'){
                var arrayDesayuno = diaDB.consumicionesDesayuno;
                if(arrayDesayuno.length != 0){
                    for(var i = 0; i< arrayDesayuno.length; i++){
                        var consumicionDB = await Consumicion.findById(arrayDesayuno[i]);
                        var alimentoDB = await Alimento.findById(consumicionDB.alimento);
                        if(alimentoDB.imagen == null) alimentoDB.imagen = imagenPlaceholder;
                        comidasJson.push([alimentoDB.nombre, alimentoDB.imagen]);
                    }
                }else{
                    comidasJson.push(["No se han añadido consumiciones todavía", imagenPlaceholder])
                }
            }else if(tipo == 'Almuerzo'){
                var arrayAlmuerzo = diaDB.consumicionesAlmuerzo;
                if(arrayAlmuerzo.length != 0){
                    for(var i = 0; i< arrayAlmuerzo.length; i++){
                        var consumicionDB = await Consumicion.findById(arrayAlmuerzo[i]);
                        var alimentoDB = await Alimento.findById(consumicionDB.alimento);
                        if(alimentoDB.imagen == null) alimentoDB.imagen = imagenPlaceholder;
                        comidasJson.push([alimentoDB.nombre, alimentoDB.imagen]);
                    }
                }else{
                    comidasJson.push(["No se han añadido consumiciones todavía", imagenPlaceholder])
                }
            }else if(tipo == 'Cena'){
                var arrayCena = diaDB.consumicionesCena;
                if(arrayCena.length != 0){
                    for(var i = 0; i< arrayCena.length; i++){
                        var consumicionDB = await Consumicion.findById(arrayCena[i]);
                        var alimentoDB = await Alimento.findById(consumicionDB.alimento);
                        if(alimentoDB.imagen == null) alimentoDB.imagen = imagenPlaceholder;
                        comidasJson.push([alimentoDB.nombre, alimentoDB.imagen]);
                    }
                }else{
                    comidasJson.push(["No se han añadido consumiciones todavía", imagenPlaceholder])
                }
            }
            res.json(comidasJson);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                mensaje: "Se ha producido un error",
                error
            })
        }
    /* }else{
        return res.status(403).json({
            mensaje: "Acceso no permitido",
            error
        })
    } */
});

router.get('/:username/:fecha/pesos', async(req, res) => {
    //if(req.params.username == req.query.username){
        const username = req.params.username;
        const fecha = req.params.fecha;
        var dateOriginal = new Date(fecha);
    
        const usuarioDB = await Usuario.findOne({"username": username});
        var jsonUnido = [];
    
        try{
            for(var i = 0; i<7; i++){
                var dateAux = new Date(dateOriginal.getFullYear(), dateOriginal.getMonth(), dateOriginal.getDate() + 1 - i);
                var diaDB = await Dia.findOne({"usuario": usuarioDB._id, "fecha":{$gte: new Date(dateAux.getFullYear(), dateAux.getMonth(), dateAux.getDate() + 1), $lte: new Date(dateAux.getFullYear(), dateAux.getMonth(), dateAux.getDate() + 2)}});
                if(diaDB != null){
                    jsonUnido.push([dateAux, diaDB.pesoActual]);
                }else{
                    jsonUnido.push([dateAux, -1]);
                }
            }
            res.json(jsonUnido);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                mensaje: "Se ha producido un error",
                error
            })
        }
    /* }else{
        return res.status(403).json({
            mensaje: "Acceso no permitido",
            error
        })
    } */
    
});

module.exports = router;