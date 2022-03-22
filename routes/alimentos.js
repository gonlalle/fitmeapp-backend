
const axios = require('axios');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const alimento = require('../models/alimento');
// Require Item model in our routes module
var Alimento = require('../models/alimento');
var Consumicion = require('../models/consumption')
// Get con todos los documentos


router.get('/', async (req, res) => {
  try{
    const alimentosDB = await Alimento.find().limit(100);
    res.json(alimentosDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

router.get('/creados/:username', async (req, res) => {
  const username = req.params.username;
  const items = await Alimento.find({"creado_por":username}).limit(500);
  res.json(items);
});

router.get('/alergenos/:alergeno', async (req, res) => {
  const alergeno = req.params.alergeno;
  const items = await Alimento.find({"alergenos": {$not: {$regex : alergeno}}}).limit(500);
  res.json(items);
});

router.get('/favoritos/:username', async (req, res) => {

  var alimento = 0;
  var alimentos =[];
  var lista_productos = [];
  const name = req.params.username;
  const items = await Consumicion.find({"username": name},{"product_id": 1, "_id":0}).sort({"num_consumption": -1}).limit(500);
  if (items.length > 0){
    for (var i = 0; i < items.length; i++){
      alimento = await Alimento.find({"_id":items[i]["product_id"]}).limit(500);
      alimentos = alimentos.concat(alimento);
      lista_productos.push(items[i]["product_id"]);
    }
    resto_alimentos = await Alimento.find({"_id":{$nin:  lista_productos}}).limit(500);
    alimentos = alimentos.concat(resto_alimentos);
  } else{
    alimentos = await Alimento.find().limit(500);
  }
  
  
  res.json(alimentos);
  
});

router.get('/recientes/:username', async (req, res) => {

  var alimento = 0;
  var resto_alimentos = [];
  var alimentos = [];
  const lista_productos = [];
  const name = req.params.username;
  const items = await Consumicion.find({"username": name},{"product_id": 1, "_id":0}).sort({"last_consumption": -1}).limit(500);

  if (items.length > 0){
    for (var i = 0; i < items.length; i++){
      alimento = await Alimento.find({"_id":items[i]["product_id"]}).limit(500);
      alimentos = alimentos.concat(alimento);
      lista_productos.push(items[i]["product_id"]);
    }

    resto_alimentos = await Alimento.find({"_id":{$nin:  lista_productos}}).limit(500);
    alimentos = alimentos.concat(resto_alimentos);

  } else{
    alimentos = await Alimento.find().limit(500);
  }
  
  
  res.json(alimentos);
  
});

router.post('/newConsumption/:alimentoId/:username', async (req, res, next) => {
  const username = req.params.username;
  const alimentoId = req.params.alimentoId;
  var item = new Consumicion();
  item.num_consumption = 1;
  item.last_consumption = Date();
  const consumicion = await Consumicion.find({"username": username, "product_id": alimentoId});
  if (consumicion.length == 0){
      item.username = username;
      item.product_id = alimentoId;
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

router.get('/buscador/:name', async (req, res) => {
  const name = req.params.name;
  const items = await Alimento.find({"nombre": {$regex : name}}).limit(500);
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

router.get('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const alimentoDB = await Alimento.findOne({_id});
    res.json(alimentoDB);
} catch (error) {
    return res.status(400).json({
    mensaje: 'Ha ocurrido un error',
    error
    })
}
});

router.post('/', async(req, res) => {
  const body = req.body;  
  try {
      console.log("Creando un nuevo alimento", body);
      body._id = new mongoose.Types.ObjectId();
      const alimentoDB = await Alimento.create(body);
      res.status(200).json(alimentoDB); 
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          mensaje: 'Ha ocurrido un error',
          error
      })
  }
});


router.put('/:id', async(req, res) => {
  const _id = req.params.id;
  const body = req.body;  
  try {
      console.log("Actualizando un alimento")
      const alimentoDB = await Alimento.findByIdAndUpdate(_id, body);
      res.status(200).json(alimentoDB);
  } catch (error) {
      return res.status(500).json({
          mensaje: 'Ha ocurrido un error',
          error
      })
  }
});

router.delete('/:id', async(req, res) => {
  const _id = req.params.id;
  try {
      const alimentoDB = await Alimento.findByIdAndDelete(_id);
      res.status(200).json(alimentoDB);
  } catch (error) {
      return res.status(500).json({
          mensaje: 'Ha ocurrido un error',
          error
      })
  }
});


// Exportamos la configuración de express app
module.exports = router;
