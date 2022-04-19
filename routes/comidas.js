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
      }, {
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

  router.post('/add/:alimento_id/:cantidad/:diaId/:tipo/:calculadora', async (req, res, next) => {
    
    const alimentoId = req.params.alimento_id;
    const diaId = req.params.diaId;
    const cantidad = req.params.cantidad;
    const tipo = req.params.tipo;
    const calculadora = req.params.calculadora;
    const alimento = await Alimento.findOne({"_id": alimentoId});
    const dia = await Dia.findOne({"_id": diaId});

    if(dia && alimento){
      const consumicion = await Consumicion.findOne({"alimento": alimentoId, "usuario": dia.usuario, "fecha": dia.fecha, "tipo": tipo});
      if (consumicion){
        candiadAntigua = consumicion.cantidad
        Consumicion.findOneAndUpdate({ "_id": consumicion._id },{
                    
          $set: {
            cantidad: cantidad,
            calculadora: false
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

              var cambio = {}
              if(tipo == "Desayuno") {
                cambio = {
                  kcalIngeridasDesayuno: Math.abs(dia.kcalIngeridasDesayuno + alimento.kcal_100g* cantidad/100 - alimento.kcal_100g*candiadAntigua/100),
                  grasasIngeridasDesayuno: Math.abs(dia.grasasIngeridasDesayuno + alimento.grasa_100g* cantidad/100 - alimento.grasa_100g*candiadAntigua/100),
                  carbIngeridasDesayuno: Math.abs(dia.carbIngeridasDesayuno + alimento.carbohidratos_100g* cantidad/100 - alimento.carbohidratos_100g*candiadAntigua/100),
                  proteinasIngeridasDesayuno: Math.abs(dia.proteinasIngeridasDesayuno + alimento.proteinas_100g* cantidad/100 - alimento.proteinas_100g*candiadAntigua/100)
                }
              }else if(tipo == "Almuerzo"){
                cambio = {
                  kcalIngeridasAlmuerzo: Math.abs(dia.kcalIngeridasAlmuerzo + alimento.kcal_100g* cantidad/100 - alimento.kcal_100g*candiadAntigua/100),
                  grasasIngeridasAlmuerzo: Math.abs(dia.grasasIngeridasAlmuerzo + alimento.grasa_100g* cantidad/100 - alimento.grasa_100g*candiadAntigua/100),
                  carbIngeridasAlmuerzo: Math.abs(dia.carbIngeridasAlmuerzo + alimento.carbohidratos_100g* cantidad/100 - alimento.carbohidratos_100g*candiadAntigua/100),
                  proteinasIngeridasAlmuerzo: Math.abs(dia.proteinasIngeridasAlmuerzo + alimento.proteinas_100g* cantidad/100 - alimento.proteinas_100g*candiadAntigua/100)
                }
              }else if(tipo == "Cena"){
                cambio = {
                  kcalIngeridasCena: Math.abs(dia.kcalIngeridasCena + alimento.kcal_100g* cantidad/100 - alimento.kcal_100g*candiadAntigua/100),
                  grasasIngeridasCena: Math.abs(dia.grasasIngeridasCena + alimento.grasa_100g* cantidad/100 - alimento.grasa_100g*candiadAntigua/100),
                  carbIngeridasCena: Math.abs(dia.carbIngeridasCena + alimento.carbohidratos_100g* cantidad/100 - alimento.carbohidratos_100g*candiadAntigua/100),
                  proteinasIngeridasCena: Math.abs(dia.proteinasIngeridasCena + alimento.proteinas_100g* cantidad/100 - alimento.proteinas_100g*candiadAntigua/100)
                }
              }

              Dia.findOneAndUpdate({ "_id": dia._id },{
                $set: cambio
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


          }})
      }else{
        var nuevaConsumicion = new Consumicion();
        nuevaConsumicion.alimento = Mongoose.Types.ObjectId(alimentoId),
        nuevaConsumicion.cantidad = cantidad;
        nuevaConsumicion.usuario = dia.usuario;
        nuevaConsumicion.fecha = dia.fecha;
        nuevaConsumicion.tipo = tipo;
        nuevaConsumicion.calculadora = calculadora;
        nuevaConsumicion.save().then(item => {
                 
          var cambio = {}
          if(tipo == "Desayuno") {
            var conDesayuno = dia.consumicionesDesayuno
            conDesayuno.push(nuevaConsumicion._id)
            cambio = {
              consumicionesDesayuno: conDesayuno,
              kcalIngeridasDesayuno: dia.kcalIngeridasDesayuno + alimento.kcal_100g* cantidad/100,
              grasasIngeridasDesayuno: dia.grasasIngeridasDesayuno + alimento.grasa_100g* cantidad/100,
              carbIngeridasDesayuno: dia.carbIngeridasDesayuno + alimento.carbohidratos_100g* cantidad/100,
              proteinasIngeridasDesayuno: dia.proteinasIngeridasDesayuno + alimento.proteinas_100g* cantidad/100
            }
          }else if(tipo == "Almuerzo"){
            var conAlmuerzo = dia.consumicionesAlmuerzo
            conAlmuerzo.push(nuevaConsumicion._id)
            cambio = {
              consumicionesAlmuerzo: conAlmuerzo,
              kcalIngeridasAlmuerzo: dia.kcalIngeridasAlmuerzo + alimento.kcal_100g* cantidad/100,
              grasasIngeridasAlmuerzo: dia.grasasIngeridasAlmuerzo + alimento.grasa_100g* cantidad/100,
              carbIngeridasAlmuerzo: dia.carbIngeridasAlmuerzo + alimento.carbohidratos_100g* cantidad/100,
              proteinasIngeridasAlmuerzo: dia.proteinasIngeridasAlmuerzo + alimento.proteinas_100g* cantidad/100
            }
          }else if(tipo == "Cena"){
            var conCena = dia.consumicionesCena
            conCena.push(nuevaConsumicion._id)
            cambio = {
              consumicionesCena: conCena,
              kcalIngeridasCena: dia.kcalIngeridasCena + alimento.kcal_100g* cantidad/100,
              grasasIngeridasCena: dia.grasasIngeridasCena + alimento.grasa_100g* cantidad/100,
              carbIngeridasCena: dia.carbIngeridasCena + alimento.carbohidratos_100g* cantidad/100,
              proteinasIngeridasCena: dia.proteinasIngeridasCena + alimento.proteinas_100g* cantidad/100
            }
          }


          Dia.findOneAndUpdate({ "_id": dia._id },{
                      
            $set: cambio
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
        })
        .catch(err => {
          console.log(err)
          res.status(400).send("unable to save to database");
          err
        });
      }
    }

  });

  router.delete('/carrusel/:consumicionId/:diaId/:tipo', async(req, res) => {
    const consumicionId = req.params.consumicionId;
    const diaId = req.params.diaId;
    const tipo = req.params.tipo;
    const dia = await Dia.findOne({"_id": diaId});
    const consumicion = await Consumicion.findOne({"_id": consumicionId});
    const alimento = await Alimento.findOne({"_id": consumicion.alimento});
    if (dia && consumicion){

      var conDesayuno = dia.consumicionesDesayuno.filter(e => e._id != consumicionId)

      var cambio = {}
      if(tipo == "Desayuno") {
        var conDesayuno = dia.consumicionesDesayuno.filter(e => e._id != consumicionId)
        cambio = {
          consumicionesDesayuno: conDesayuno,
          kcalIngeridasDesayuno: Math.abs(dia.kcalIngeridasDesayuno - alimento.kcal_100g* consumicion.cantidad/100),
          grasasIngeridasDesayuno: Math.abs(dia.grasasIngeridasDesayuno - alimento.grasa_100g* consumicion.cantidad/100),
          carbIngeridasDesayuno: Math.abs(dia.carbIngeridasDesayuno - alimento.carbohidratos_100g* consumicion.cantidad/100),
          proteinasIngeridasDesayuno: Math.abs(dia.proteinasIngeridasDesayuno - alimento.proteinas_100g* consumicion.cantidad/100)
        }
      }else if(tipo == "Almuerzo"){
        var conAlmuerzo = dia.consumicionesAlmuerzo.filter(e => e._id != consumicionId)
        cambio = {
          consumicionesAlmuerzo: conAlmuerzo,
          kcalIngeridasAlmuerzo: Math.abs(dia.kcalIngeridasAlmuerzo - alimento.kcal_100g* consumicion.cantidad/100),
          grasasIngeridasAlmuerzo: Math.abs(dia.grasasIngeridasAlmuerzo - alimento.grasa_100g* consumicion.cantidad/100),
          carbIngeridasAlmuerzo: Math.abs(dia.carbIngeridasAlmuerzo - alimento.carbohidratos_100g* consumicion.cantidad/100),
          proteinasIngeridasAlmuerzo: Math.abs(dia.proteinasIngeridasAlmuerzo - alimento.proteinas_100g* consumicion.cantidad/100)
        }
      }else if(tipo == "Cena"){
        var conCena = dia.consumicionesCena.filter(e => e._id != consumicionId)
        cambio = {
          consumicionesCena: conCena,
          kcalIngeridasCena: Math.abs(dia.kcalIngeridasCena - alimento.kcal_100g* consumicion.cantidad/100),
          grasasIngeridasCena: Math.abs(dia.grasasIngeridasCena - alimento.grasa_100g* consumicion.cantidad/100),
          carbIngeridasCena: Math.abs(dia.carbIngeridasCena - alimento.carbohidratos_100g* consumicion.cantidad/100),
          proteinasIngeridasCena: Math.abs(dia.proteinasIngeridasCena - alimento.proteinas_100g* consumicion.cantidad/100)
        }
      }

      Dia.findOneAndUpdate({ "_id": dia._id },{
                      
        $set: cambio
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




      Consumicion.findOneAndDelete({"_id": consumicionId }, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            //console.log("Deleted Consumicion : ", docs);
        }
      });
    }
    
    

  });

  router.delete('/limpiarCarrusel/:userId/:diaId/:tipo', async(req, res) => {
    const userId = req.params.userId;
    const diaId = req.params.diaId;
    const tipo = req.params.tipo;
    //const dia = await Dia.findOne({"_id": diaId});
    const consumiciones = await Consumicion.find({"calculadora": true, usuario: userId, tipo: tipo},{"_id": 1});
    const dia = await Dia.findOne({"_id": diaId});
    

    for(var i =0; i<consumiciones.length;i++){

    Consumicion.findOneAndDelete({"_id": consumiciones[i]._id }, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          //console.log("Deleted Consumicion : ", docs);
      }
    });
    var cambio = {}
      if(tipo == "Desayuno") {
        var conDesayuno = dia.consumicionesDesayuno.filter(e => e._id != consumiciones[i]._id.toString())
        cambio = {
          consumicionesDesayuno: conDesayuno,
        }
      }else if(tipo == "Almuerzo"){
        var conAlmuerzo = dia.consumicionesAlmuerzo.filter(e => e._id != consumiciones[i]._id.toString())
        cambio = {
          consumicionesAlmuerzo: conAlmuerzo,
        }
      }else if(tipo == "Cena"){
        var conCena = dia.consumicionesCena.filter(e => e._id != consumiciones[i]._id.toString())
        cambio = {
          consumicionesCena: conCena,
        }
      }
      console.log(cambio)
    Dia.findOneAndUpdate({ "_id": diaId },{
                      
      $set: cambio
      },
      function(error, info) {
      if (error) {
          res.json({
              resultado: false,
              msg: 'No se pudo modificar la comida',
          });
      
      }})

  }

  });

module.exports = router;