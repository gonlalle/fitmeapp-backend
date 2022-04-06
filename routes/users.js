const axios = require('axios');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose')
const User = require('../models/user');

router.get('/favoritos/:userId', async(req, res) => {
    const userId = req.params.userId;
        try {
            const userDB = await User.findOne({"_id": Mongoose.Types.ObjectId(userId)});
            res.json(userDB.alimentosFavoritos);
        } catch (error) {
            return res.status(400).json({
            mensaje: 'An error has occurred',
            error
            })
        }
    });

router.post('/favoritos/:userId/:alimentoId', async(req, res) => {
    const userId = req.params.userId;
    const alimentoId = req.params.alimentoId;
        try {

            const user = await User.findOne({"_id": Mongoose.Types.ObjectId(userId)});
            favs = user.alimentosFavoritos;
            favs.push(alimentoId)
            
            const userDB = await User.findByIdAndUpdate({"_id": Mongoose.Types.ObjectId(userId)},{
                
                $set: {
                    alimentosFavoritos: favs
                }
            });
        } catch (error) {
            return res.status(400).json({
            mensaje: 'An error has occurred',
            error
            })
        }
    });

router.delete('/favoritos/:userId/:alimentoId', async(req, res) => {
    const userId = req.params.userId;
    const alimentoId = req.params.alimentoId;
        try {
            const user = await User.findOne({"_id": Mongoose.Types.ObjectId(userId)});
            var favs = user.alimentosFavoritos.filter(e => e._id != alimentoId)
            
            const userDB = await User.findByIdAndUpdate({"_id": Mongoose.Types.ObjectId(userId)},{
                
                $set: {
                    alimentosFavoritos: favs
                }
            });
            res.status(200).json(userDB); 
        } catch (error) {

            return res.status(400).json({
            mensaje: 'An error has occurred',
            error
            })
        }
    });


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



router.post('/', async(req, res) => {
    const body = req.body;  
    try {
    body._id = new mongoose.Types.ObjectId();
    console.log("Posting a new user")
    const userDB = await User.create(body);
    res.status(200).json(userDB); 
    } catch (error) {
        console.log("Error::", error)
    return res.status(500).json({
        mensaje: 'An error has occurred',
        error
    })
    }
});

router.put('/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;  
    try {
        console.log("Updating a user")
        console.log("User ID: ", _id)
        console.log("Body: ", req.body)
        const userDB = await User.findByIdAndUpdate(_id, body);
        res.status(200).json(userDB);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

router.delete('/test', async(req, res) => {
    try {
        const userDB = await User.findOneAndDelete({isTestUser: true});
        res.status(200).json(userDB);
    } catch (error) {
        console.log("Error::", error)
        return res.status(500).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

router.delete('/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const userDB = await User.findByIdAndDelete(_id);
        res.status(200).json(userDB);
    } catch (error) {
        console.log("Error::", error)
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
  });


module.exports = router;