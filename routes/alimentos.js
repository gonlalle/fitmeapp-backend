const router = require('express').Router();
// Require Item model in our routes module
var Alimento = require('../models/alimento');
var Consumicion = require('../models/consumption')
// Get con todos los documentos

router.get('/', async (req, res) => {
  const items = await Alimento.find().limit(500);
  res.json(items);
  
});

router.get('/favoritos/:username', async (req, res) => {

  var alimentos =[];
  const lista_productos = [];
  const name = req.params.username;
  const items = await Consumicion.find({"username": name},{"product_id": 1, "_id":0}).sort({"num_consumption": 1}).limit(500);
  console.log(items);
  if (items.length > 0){
    for (var i = 0; i < items.length; i++){
      lista_productos.push(items[i]["product_id"]);
    }
    alimentos = await Alimento.find({"_id":lista_productos}).limit(500);
    
  } else{
    alimentos = await Alimento.find().limit(500);
  }
  
  
  res.json(alimentos);
  
});

router.get('/recientes/:username', async (req, res) => {

  var alimentos =[];
  const lista_productos = [];
  const name = req.params.username;
  const items = await Consumicion.find({"username": name},{"product_id": 1, "_id":0}).sort({"last_consumption": -1}).limit(500);
  console.log(items);
  if (items.length > 0){
    for (var i = 0; i < items.length; i++){
      lista_productos.push(items[i]["product_id"]);
    }
    alimentos = await Alimento.find({"_id":lista_productos}).limit(500);
  } else{
    alimentos = await Alimento.find().limit(500);
  }
  
  
  res.json(alimentos);
  
});

router.post('/newConsumption', async (req, res, next) => {
  var item = new Consumicion(req.body);
  item.num_consumption = 1;
  item.last_consumption = Date();
  const consumicion = await Consumicion.find({"username": item.username, "product_id": item.product_id});
  if (consumicion.length == 0){
      item.save()
      .then(item => {
        res.status(200).json({'item': 'Consumption added successfully'});
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
  }else{
    Consumicion.findOneAndUpdate({ "_id": consumicion[0]._id },{
      $set: {
        num_consumption: consumicion[0].num_consumption+1,
        last_consumption: Date()
    }
  },
  function(error, info) {
    if (error) {
        res.json({
            resultado: false,
            msg: 'No se pudo modificar la consumición',
            error
        });
    } else {
        res.json({
            resultado: "Modificado con éxito",
            info: info
        })
    }
  }
  )
}
});


//para pruebas visuales (temporal)
router.get('/carrusel', async (req, res) => {
  const items = await Alimento.find().limit(10);
  res.json(items);
  
});

router.get('/:name', async (req, res) => {
  const name = req.params.name;
  const items = await Alimento.find({"product_name": {$regex : name}}).limit(500);
  res.json(items);
});

router.route('/add').post((req, res, next) => {
  var item = new Alimento(req.body);
  item.save()
  .then(item => {
    res.status(200).json({'item': 'Item added successfully'});
  })
  .catch(err => {
    res.status(400).send("unable to save to database");
  });
});

// Exportamos la configuración de express app
module.exports = router;