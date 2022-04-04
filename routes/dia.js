const axios = require('axios');
const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose')
const Dia = require('../models/dia');


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

module.exports = router;