const router = require('express').Router();
// Require Item model in our routes module
var Alimento = require('../models/alimento');
const Consumicion = require('../models/consumicion');
const Dia = require('../models/dia');
const Mongoose = require('mongoose')

function aggreationFuntion(tipo, fecha, userId){
    fechaAUsar = new Date(Date.parse(fecha).valueOf());
    
    fechaAUsar.setHours(2);
    fechaAUsar.setMinutes(0);
    fechaAUsar.setSeconds(0);
    fechaAUsar.setMilliseconds(0);

    fechaInicio =new Date(fechaAUsar.valueOf());

    fechaAUsar.setHours(25);
    fechaAUsar.setMinutes(59);
    fechaAUsar.setSeconds(59);
    fechaAUsar.setMilliseconds(999);

    fechaFin =new Date(fechaAUsar.valueOf());

    agg = [
        {
            '$match': {
              '$and': [
                {
                  'usuario': Mongoose.Types.ObjectId(userId) 
                }, {
                  'fecha': {
                    '$gt': fechaInicio, 
                    '$lt': fechaFin
                  }
                }
              ]
            }
          },
        {
          '$lookup': {
            'from': 'consumicions', 
            'localField': 'consumiciones'+tipo, 
            'foreignField': '_id', 
            'as': 'consumiciones'
          }
        }, {
          '$unwind': {
            'path': '$consumiciones', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'alimentos', 
            'localField': 'consumiciones.alimento', 
            'foreignField': '_id', 
            'as': 'consumiciones.alimento'
          }
        }, {
          '$unwind': {
            'path': '$consumiciones.alimento', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'usuario': {
              '$first': '$usuario'
            }, 
            'fecha': {
              '$first': '$fecha'
            }, 
            'pesoActual': {
              '$first': '$pesoActual'
            }, 
            'kcalRec': {
              '$first': '$kcalRec'
            }, 
            'proteinasRec': {
              '$first': '$proteinasRec'
            }, 
            'carbRec': {
              '$first': '$carbRec'
            }, 
            'grasasRec': {
              '$first': '$grasasRec'
            }, 
            'kcalIngeridas': {
              '$first': '$kcalIngeridas'+tipo
            }, 
            'proteinasIngeridas': {
              '$first': '$proteinasIngeridas'+tipo
            }, 
            'carbIngeridas': {
              '$first': '$carbIngeridas'+tipo
            }, 
            'grasasIngeridas': {
              '$first': '$grasasIngeridas'+tipo
            }, 
            'consumiciones': {
              '$push': '$consumiciones'
            }
          }
        }
      ];

    return agg;

}

router.get('/:tipo/:fecha/:userId', async(req, res) => {
    try {
        const tipo = req.params.tipo;
        const fecha = req.params.fecha;
        const userId = req.params.userId;
        var agg = aggreationFuntion(tipo, fecha, userId)
        const diaDB = await Dia.aggregate(agg);
        const diaFinal = diaDB[0];
        diaFinal.tipo = tipo;
        res.json(diaFinal);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

  router.post('/add/:alimento_id/:cantidad/:diaId/:tipo', async (req, res, next) => {
    
    const alimentoId = req.params.alimento_id;
    const diaId = req.params.diaId;
    const cantidad = req.params.cantidad;
    const alimento = await Alimento.findOne({"_id": alimentoId});
    const dia = await Dia.findOne({"_id": diaId});
    
    if(dia && alimento){

      const consumicion = await Consumicion.findOne({"alimento": alimentoId, "usuario": dia.usuario});
      
      if (consumicion){
        Consumicion.findOneAndUpdate({ "_id": consumicion._id },{
                    
          $set: {
            cantidad: cantidad
          }
          },
          function(error, info) {
          if (error) {
              res.json({
                  resultado: false,
                  msg: 'No se pudo modificar la comida',
                  error
              });
          
          } else {
              res.json({
                  resultado: "Modificado con éxito",
                  info: info
              })
          }})
      }else{
        var nuevaConsumicion = new Consumicion();
        nuevaConsumicion.alimento = Mongoose.Types.ObjectId(alimentoId),
        nuevaConsumicion.cantidad = cantidad;
        nuevaConsumicion.usuario = dia.usuario;

        nuevaConsumicion.save().then(item => {
          //seguir aquí
          res.status(200).json({'item': 'Consumption added successfully'});
        })
        .catch(err => {
          console.log(err)
          res.status(400).send("unable to save to database");
          err
        });
      }
    }

  });

  router.delete('/carrusel/:alimentoId/:tipo/:fecha/:username', async(req, res) => {
    return res.status(404).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  });

module.exports = router;