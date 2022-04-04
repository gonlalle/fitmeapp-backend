const axios = require('axios');
const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Suscripcion = require('../models/suscripcion');


router.get('/', async(req, res) => {
    try {
        const userDB = await User.find({isAdmin: false, isTestUser: false}).select("-_id username");
        res.json(userDB);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

 router.get('/:username', async(req, res) => {
 const username = req.params.username;
     try {
         const userDB = await User.findOne({"username": username});
         res.json(userDB);
     } catch (error) {
         return res.status(400).json({
         mensaje: 'An error has occurred',
         error
         })
     }
 });

 router.get('/suscripcion/:userId', async(req, res) => {
    const userId = req.params.userId;
    try {
        const userDB = await User.findOne({"_id": userId});
        const suscrito = await Suscripcion.findOne({"_id": userDB.suscripcion})
        let hoy = new Date();
        hoy.setHours(suscrito.fechaFin.getHours(), suscrito.fechaFin.getMinutes(), suscrito.fechaFin.getSeconds(), suscrito.fechaFin.getMilliseconds());
        let res = '';
        if (suscrito && suscrito.fechaFin > hoy){
            res = suscrito;
        }
        res.json(res);
        
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
    const userDB = await User.create(body);
    res.status(200).json(userDB); 
    } catch (error) {
    return res.status(500).json({
        mensaje: 'An error has occurred',
        error
    })
    }
});

// router.put('/:id', async(req, res) => {
//     const _id = req.params.id;
//     const body = req.body;  
//     try {
//         console.log("Updating a user")
//         console.log("User ID: ", _id)
//         console.log("Body: ", req.body)

//         const userDB = await User.findByIdAndUpdate(_id, body);

//         res.status(200).json(userDB);
//     } catch (error) {
//         return res.status(500).json({
//             mensaje: 'An error has occurred',
//             error
//         })
//     }
// });

router.delete('/test', async(req, res) => {
    try {
        const userDB = await User.findOneAndDelete({isTestUser: true});
        res.status(200).json(userDB);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});


module.exports = router;