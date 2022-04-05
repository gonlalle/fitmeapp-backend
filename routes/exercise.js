// importar el modelo nota
const axios = require('axios');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
var Exercise = require('../models/ejercicio');


// Get con parámetros
router.get('/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const exerciseBD = await Exercise.find({_id});
      res.json(exerciseBD);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

  router.get('/muscle/:id', async(req, res) => {
    const _muscle = Number(req.params.id);
    console.log(_muscle);
    try {
      const exerciseBD = await Exercise.find({muscles: { $elemMatch: {$eq: _muscle} }});
      res.json(exerciseBD);
      console.log(exerciseBD);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });
  
  // Get con todos los documentos
  router.get('/', async(req, res) => {
    try {
      const exerciseBD = await Exercise.find();
      res.json(exerciseBD);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

  router.post('/', async(req, res) => {
    const body = req.body;  
    try {
        console.log("Creando un nuevo ", body);
        body._id = new mongoose.Types.ObjectId();
        const db = await Exercise.create(body);
        res.status(200).json(db); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
  });
  
  
  router.put('/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;  
    try {
        console.log("Actualizando un Ejercicio"+req.body)
        const db = await Exercise.findByIdAndUpdate(_id, body);
        res.status(200).json(db);
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
        const db = await Exercise.findByIdAndDelete(_id);
        res.status(200).json(db);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
  });

  module.exports = router;