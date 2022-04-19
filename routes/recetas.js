
const axios = require('axios');
const express = require('express');
const mongoose = require("mongoose");
const router = require('express').Router();
// Require Item model in our routes module
const Receta = require('../models/receta');

// Get con todos los documentos
router.get('/', async (req, res) => {
    const items = await Receta.find();
    res.json(items);
});


// Get de una receta por id
router.get('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
      const recetaDB = await Receta.findOne({_id});
      res.json(recetaDB);
  } catch (error) {
      return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
      })
  }
  });

// Post de una receta
router.post('/', async(req, res) => {
    const body = req.body;  
    try {
    body._id = new mongoose.Types.ObjectId();
    console.log("Posting a new recipe")
    const recetaDB = await Receta.create(body);
    res.status(200).json(recetaDB); 
    } catch (error) {
        console.log("Error::", error)
    return res.status(500).json({
        mensaje: 'An error has occurred',
        error
    })
    }
});

// Put de una receta
router.put('/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;  
    try {
        console.log("Actualizando una receta")
        const recetaDB = await Receta.findByIdAndUpdate(_id, body);
        res.status(200).json(recetaDB);
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
        const recetaDB = await Receta.findByIdAndDelete(_id);
        res.status(200).json(recetaDB);
    } catch (error) {
        console.log("Error::", error)
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
});

// Exportamos la configuración de express app
module.exports = router;