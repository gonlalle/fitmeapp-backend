const axios = require('axios');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const done_exercise = require('../models/done_exercise');

router.post('/', async(req, res) => {
    const body = req.body;  
    try {
        console.log("Guardando el ejercicio realizado", body);
        body._id = new mongoose.Types.ObjectId();
        const done_exerciseDB = await done_exercise.create(body);
        res.status(200).json(done_exerciseDB); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
  });

// Exportamos la configuración de express app
module.exports = router;