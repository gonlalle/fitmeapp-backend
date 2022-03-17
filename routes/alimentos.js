const axios = require('axios');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const alimento = require('../models/alimento');

// Get con todos los documentos

router.get('/', async (req, res) => {
  try{
    const alimentosDB = await alimento.find().limit(100);
    res.json(alimentosDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

router.get('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const alimentoDB = await alimento.findOne({_id});
    res.json(alimentoDB);
} catch (error) {
    return res.status(400).json({
    mensaje: 'Ha ocurrido un error',
    error
    })
}
});

router.post('/', async(req, res) => {
  const body = req.body;  
  try {
      console.log("Creando un nuevo alimento", body);
      body._id = new mongoose.Types.ObjectId();
      const alimentoDB = await alimento.create(body);
      res.status(200).json(alimentoDB); 
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
      console.log("Actualizando un alimento")
      const alimentoDB = await alimento.findByIdAndUpdate(_id, body);
      res.status(200).json(alimentoDB);
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
      const alimentoDB = await alimento.findByIdAndDelete(_id);
      res.status(200).json(alimentoDB);
  } catch (error) {
      return res.status(500).json({
          mensaje: 'Ha ocurrido un error',
          error
      })
  }
});

// Exportamos la configuración de express app
module.exports = router;