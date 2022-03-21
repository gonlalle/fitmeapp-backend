const axios = require('axios');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Alimento = require('../models/alimento');


//ESTO REALMENTE SERÍA EN USER CON URL /:ID/COMIDA/:ID/CARROUSEL
router.get('/', async (req, res) => {
    try{
      const alimentosDB = await Alimento.find().limit(10);
      res.json(alimentosDB);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ha ocurrido un error',
        error
      })
    }
});

// Exportamos la configuración de express app
module.exports = router;