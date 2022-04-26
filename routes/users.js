const axios = require('axios');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Dia = require('../models/dia');
const Suscripcion = require('../models/suscripcion');

router.get('/favoritos/:userId', async(req, res) => {
    const userId = req.params.userId;
        try {
            const userDB = await User.findOne({"_id": mongoose.Types.ObjectId(userId)});
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

            const user = await User.findOne({"_id": mongoose.Types.ObjectId(userId)});
            favs = user.alimentosFavoritos;
            favs.push(alimentoId)
            
            const userDB = await User.findByIdAndUpdate({"_id": mongoose.Types.ObjectId(userId)},{
                
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
        const user = await User.findOne({"_id": mongoose.Types.ObjectId(userId)});
        var favs = user.alimentosFavoritos.filter(e => e._id != alimentoId)
        
        const userDB = await User.findByIdAndUpdate({"_id": mongoose.Types.ObjectId(userId)},{
            
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

router.get('/suscripcion/:userId', async(req, res) => {
    const userId = req.params.userId;
    try {
        let res = 'NO';
        const userDB = await User.findOne({"_id": mongoose.Types.ObjectId(userId)});
        if(userDB.suscripcion){
            let suscrito = await Suscripcion.findOne({"_id": userDB.suscripcion});
            let hoy = new Date();

            if (suscrito){
                hoy.setHours(suscrito.fechaFin.getHours(), suscrito.fechaFin.getMinutes(), suscrito.fechaFin.getSeconds(), suscrito.fechaFin.getMilliseconds());
                
                if (suscrito.fechaFin > hoy){
                    res = suscrito;
                }
            }
        }
        res.send(res)
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

router.get('/isAdmin', async(req, res) => {
    try {
        let userId = req.query.userId;
        let user = await User.findById(userId)
        res.json(user.isAdmin);
    } catch (error) {
        console.log("Error: ", error)
        return res.status(400).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

router.get('/', async(req, res) => {
    try {
        let userId = req.query.userId
        let userDB = {}
        let usuario = await User.findById(userId)

        if (usuario.isAdmin) {
            userDB = await User.find()
        } else {
            userDB = await User.find({isAdmin: false, isTestUser: false}).select("-_id username");
        }
        res.json(userDB);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

router.get('/updateIfBirthday', async(req, res) => {
    try {
        let userId = req.query.userId
        let usuario = await User.findById(userId)
        var hoy = new Date();
        var cumpleanos = new Date(usuario.fechaNacimiento);
        var m = cumpleanos.getMonth()-hoy.getMonth()
        var d = cumpleanos.getDate()-hoy.getDate()
        if ((d==0)&&(m==0)) {
            var corrector_actividad = 1.2
            var tmb = 0
            if(usuario.nivel_actividad == "Ejercicio Ligero"){
                corrector_actividad = 1.375
            }else if(usuario.nivel_actividad == "Ejercicio moderado"){
                corrector_actividad = 1.55
            }else if(usuario.nivel_actividad == "Ejercicio fuerte"){
                corrector_actividad = 1.725
            }else if(usuario.nivel_actividad == "Ejercicio muy fuerte"){
                corrector_actividad = 1.9
            }
    
            if (usuario.sexo == "Masculino"){
                tmb = 66 + (13.7 * usuario.peso_actual) + (5 * usuario.altura) - (6.75 * calcularEdad(usuario.fechaNacimiento))
                tmb *= corrector_actividad  
                if(usuario.objetivo == "Perder peso" || usuario.objetivo == "Aumentar masa muscular"){
                    tmb += usuario.objetivo_semanal * 1000
                }
            }else{
                tmb = 665 + (9.6 * usuario.peso_actual) + (1.8 * usuario.altura) - (4.7 * calcularEdad(usuario.fechaNacimiento))
                tmb *= corrector_actividad  
                if(usuario.objetivo == "Perder peso" || usuario.objetivo == "Aumentar masa muscular"){
                    tmb += usuario.objetivo_semanal * 1600
                }
            }
    
            if(tmb > 1200)  {
                usuario.kcal_recomendadas = tmb
            }else{
                usuario.kcal_recomendadas = 1200
            }
    
            if(usuario.dieta_pref == "Estándar"){
                usuario.carbohidratos_recomendados = usuario.kcal_recomendadas * 0.5
                usuario.proteinas_recomendadas = usuario.kcal_recomendadas * 0.2
                usuario.grasas_recomendadas = usuario.kcal_recomendadas * 0.3
            }else if(usuario.dieta_pref == "Baja en carbohidratos"){
                usuario.carbohidratos_recomendados = usuario.kcal_recomendadas * 0.3
                usuario.proteinas_recomendadas = usuario.kcal_recomendadas * 0.25
                usuario.grasas_recomendadas = usuario.kcal_recomendadas * 0.45
            }else if(usuario.dieta_pref == "Alta en proteínas"){
                usuario.carbohidratos_recomendados = usuario.kcal_recomendadas * 0.35
                usuario.proteinas_recomendadas = usuario.kcal_recomendadas * 0.4
                usuario.grasas_recomendadas = usuario.kcal_recomendadas * 0.25
            }else if(usuario.dieta_pref == "Baja en grasas"){
                usuario.carbohidratos_recomendados = usuario.kcal_recomendadas * 0.55
                usuario.proteinas_recomendadas = usuario.kcal_recomendadas * 0.2
                usuario.grasas_recomendadas = usuario.kcal_recomendadas * 0.25
            }
            res.json(true);
        }
        res.json(false);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

function calcularEdad(fechaNacimiento) {
    var hoy = new Date();
    var cumpleanos = new Date(fechaNacimiento);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
}

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
        axios.get('updateIfBirthday/'+_id);
        res.status(200).json(userDB);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

router.put('/pasos/:pasos/:diaId', async(req, res) => {
    const _id = req.params.userId;
    const pasos = req.params.pasos;    
    const diaId = req.params.diaId;  
    const body = req.body;  
    try {
        const diaDB = await Dia.findByIdAndUpdate(diaId, {
           $set: {
               pasosRealizados: pasos
           }
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

router.put('/agua/:agua/:diaId', async(req, res) => {
    const _id = req.params.userId;
    const agua = req.params.agua;    
    const diaId = req.params.diaId;  
    const body = req.body;  
    try {
        const diaDB = await Dia.findByIdAndUpdate(diaId, {
           $set: {
            agua: agua
           }
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

router.put('/peso/:peso/:userId/:diaId', async(req, res) => {
     const _id = req.params.userId;
     const peso = req.params.peso;    
     const diaId = req.params.diaId;  
     const body = req.body;  
     try {
         const userDB = await User.findByIdAndUpdate(_id, {
            $set: {
                peso_actual: peso
            }
         });

         const diaDB = await Dia.findByIdAndUpdate(diaId, {
            $set: {
                pesoActual: peso
            }
         });
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