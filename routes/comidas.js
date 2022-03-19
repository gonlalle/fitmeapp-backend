const router = require('express').Router();
// Require Item model in our routes module
var Comida = require('../models/comida');
var Alimento = require('../models/alimento');
var ComidaIn = require('../models/comidaIn');

  router.post('/add', async (req, res, next) => {
    var item = new Comida(req.body);
    var itemIn = new ComidaIn(req.body);
    console.log(item)
    console.log(itemIn)
    const comida = await Comida.find({"username": item.username, "tipo": item.tipo, "fecha": item.fecha});
    const alimento = await Alimento.find({"_id": itemIn.alimento_id});
    if (comida.length == 0 && alimento.length > 0){
        console.log(itemIn.alimento_cantidad/100)
        item.kcal_100g = alimento[0].kcal_100g * itemIn.alimento_cantidad/100
        item.grasa_100g = alimento[0].grasa_100g * itemIn.alimento_cantidad/100
        item.carbohidratos_100g = alimento[0].carbohidratos_100g * itemIn.alimento_cantidad/100
        item.proteinas_100g = alimento[0].proteinas_100g * itemIn.alimento_cantidad/100
        item.alimentos[0] = {
            alimento_id: itemIn.alimento_id,
            cantidad: itemIn.alimento_cantidad
        }
        console.log(item)
        item.save()
        .then(item => {
          res.status(200).json({'item': 'Consumption added successfully'});
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
          err
        });
    }else{
        if (alimento.length > 0){
           
            console.log({
                alimento_id: itemIn.alimento_id,
                cantidad: itemIn.alimento_cantidad
            })                
                comida[0].alimentos.push({
                    alimento_id: itemIn.alimento_id,
                    cantidad: itemIn.alimento_cantidad
                })
                Comida.findOneAndUpdate({ "_id": comida[0]._id },{
                    
                $set: {
                alimentos: comida[0].alimentos,
                kcal_100g: comida[0].kcal_100g + alimento[0].kcal_100g* itemIn.alimento_cantidad/100,
                grasa_100g: comida[0].grasa_100g + alimento[0].grasa_100g* itemIn.alimento_cantidad/100,
                carbohidratos_100g: comida[0].carbohidratos_100g + alimento[0].carbohidratos_100g* itemIn.alimento_cantidad/100,
                proteinas_100g: comida[0].proteinas_100g + alimento[0].proteinas_100g* itemIn.alimento_cantidad/100
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
            res.json({
                resultado: false,
                msg: 'No se pudo modificar la comida',
            });
        }
      
  }
  });

  router.delete('/carrusel/:comidaId/:alimentoId', async(req, res) => {
    const comidaId = req.params.comidaId;
    const alimentoId = req.params.alimentoId;
    try {
        const comida = await Comida.find({"_id": comidaId});
        const item = await Alimento.find({"_id": alimentoId}).limit(500);

        if (item.length > 0 && comida.length > 0){
            alimento_from_comida = comida[0].alimentos.filter(e => e.alimento_id === alimentoId);
            cantidad = 0
            if (alimento_from_comida.length > 0) {
                cantidad = alimento_from_comida[0].cantidad;
            }
            comida[0].alimentos = comida[0].alimentos.filter(e => e.alimento_id != alimentoId);
            console.log(alimento_from_comida)
            Comida.findOneAndUpdate({ "_id": comida[0]._id },{
               
                $set: {
                  alimentos: comida[0].alimentos,
                  kcal_100g: comida[0].kcal_100g - item[0].kcal_100g * cantidad/100,
                  grasa_100g: comida[0].grasa_100g - item[0].grasa_100g  * cantidad/100,
                  carbohidratos_100g: comida[0].carbohidratos_100g - item[0].carbohidratos_100g  * cantidad/100,
                  proteinas_100g: comida[0].proteinas_100g - item[0].proteinas_100g  * cantidad/100
              }
            },
            function(error, info) {
              if (error) {
                  res.json({
                      resultado: false,
                      msg: 'No se pudo modificar la Comida',
                      error
                  })
              } else {
                  res.json({
                      resultado: "Modificado con éxito",
                      info: info
                  })
              }
            }
            )

        }else{
            return res.status(404).json({
                mensaje: 'Ha ocurrido un error',
                error
            })
        }
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
  });

  //para pruebas visuales (temporal)
router.get('/carrusel/:comidaId', async (req, res) => {
    const comidaId = req.params.comidaId;
    const comida = await Comida.find({"_id":comidaId}).limit(10);
    var items = 0;
    var jsonUnido = [];
    for (var i = 0; i < comida[0].alimentos.length; i++){
        items = await Alimento.find({"_id":comida[0].alimentos[i]["alimento_id"]}).limit(100);
        alimento = items[0];
        cantidad = comida[0].alimentos[i]["cantidad"]
        console.log(comida[0].alimentos[i]["cantidad"])
        console.log({alimento, cantidad})
        jsonUnido = jsonUnido.concat({alimento, cantidad});
      }
    console.log(jsonUnido)
    res.json(jsonUnido);
    
  });

module.exports = router;