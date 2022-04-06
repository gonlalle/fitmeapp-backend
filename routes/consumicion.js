const axios = require('axios');
const express = require('express');
const router = express.Router();

const Consumicion = require('../models/consumicion');


router.get('/', async(req, res) => {
    try {
        const consumicionDB = await Consumicion.find();
        res.json(consumicionDB);
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
         const consumicionDB = await Consumicion.findOne({"_id": _id});
         res.json(consumicionDB);
     } catch (error) {
         return res.status(400).json({
         mensaje: 'An error has occurred',
         error
         })
     }
 });

router.post('/', async(req, res) => {
    const body = req.body;  
    try {
    console.log("Posting a new user")
    const consumicionDB = await Consumicion.create(body);
    res.status(200).json(consumicionDB); 
    } catch (error) {
    return res.status(500).json({
        mensaje: 'An error has occurred',
        error
    })
    }
});

module.exports = router;