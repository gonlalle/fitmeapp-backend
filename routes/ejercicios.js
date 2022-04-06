const axios = require('axios');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
// Require Item model in our routes module
var Ejercicio = require('../models/ejercicio');

// Get con todos los documentos

router.get('/', async (req, res) => {
  const items = await Ejercicio.find();
  res.json(items);
});



router.post('/', async(req, res) => {
  const body = req.body;  
  try {
      console.log("Creando un nuevo ejercicio: ", body);
      body._id = new mongoose.Types.ObjectId();
      const db = await Ejercicio.create(body);
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
      console.log("Actualizando un ejercicio: ")
      const db = await Ejercicio.findByIdAndUpdate(_id, body);
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
      const db = await Ejercicio.findByIdAndDelete(_id);
      res.status(200).json(db);
  } catch (error) {
      return res.status(500).json({
          mensaje: 'Ha ocurrido un error',
          error
      })
  }
});

// Exportamos la configuración de express app
module.exports = router; 