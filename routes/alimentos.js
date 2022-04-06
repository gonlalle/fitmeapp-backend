const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const alimento = require('../models/alimento');

var Alimento = require('../models/alimento');
var Consumicion = require('../models/consumicion')

router.get('/:id', async(req, res) => {
  const _id = req.params.id;
      try {
          const alimentoDB = await alimento.findOne({"_id": _id});
          res.json(alimentoDB);
      } catch (error) {
          return res.status(400).json({
          mensaje: 'An error has occurred',
          error
          })
      }
  });

//OBTENER 100 ALIMENTOS (EN FRONTEND SE HACE UN LAZYLOAD) BUSCA POR TERMINO, ALERGENOS (QUE NO TENGA)  Y ORDEN
router.get('/', async (req, res) => {
  const pagina = req.query.pagina;
  const ordenar = req.query.ordenar;
  const buscador = !(req.query.buscador) ? '': req.query.buscador;
  const alergeno = req.query.filters;
  try{
    var alimentosDB = await Alimento.find({"nombre": {$regex : buscador, $options:"i"}}).skip(9*pagina).limit(9)
    var total =  await Alimento.countDocuments({"nombre": {$regex : buscador}});
    if (ordenar && alergeno){
      alimentosDB = await Alimento.find({"nombre": {$regex : buscador, $options:"i"}, 
                                  "alergenos": {$not: {$regex : alergeno}}}).sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9);
      total = await Alimento.countDocuments({"nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}});
    }else if(ordenar && !alergeno){
      alimentosDB = await Alimento.find({"nombre": {$regex : buscador, $options:"i"}}).sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9);
    }else if(!ordenar && alergeno){
      alimentosDB = await Alimento.find({"nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}}).skip(9*pagina).limit(9);
      total = await Alimento.countDocuments({"nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}});
    }
    res.json({
      resultado: alimentosDB,
      total: total
  });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

//OBTENER 100 ALIMENTOS CREADOS POR UN USUARIO (EN FRONTEND SE HACE UN LAZYLOAD)
router.get('/creados/:username', async (req, res) => {
  const username = req.params.username;
  const pagina = req.query.pagina;
  const ordenar = req.query.ordenar;
  const buscador = !(req.query.buscador) ? '': req.query.buscador;
  const alergeno = req.query.filters;
  var alimentosDB = await Alimento.find({"creado_por":username, "nombre": {$regex : buscador, $options:"i"}}).skip(9*pagina).limit(9)
  var total =  await Alimento.countDocuments({"creado_por":username, "nombre": {$regex : buscador, $options:"i"}});

  if (ordenar && alergeno){
    alimentosDB = await Alimento.find({"creado_por":username, "nombre": {$regex : buscador, $options:"i"}, 
                                "alergenos": {$not: {$regex : alergeno}}}).sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9);
    total = await Alimento.countDocuments({"creado_por":username, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}});
  }else if(ordenar && !alergeno){
    alimentosDB = await Alimento.find({"creado_por":username, "nombre": {$regex : buscador, $options:"i"}}).sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9);
  }else if(!ordenar && alergeno){
    alimentosDB = await Alimento.find({"creado_por":username, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}}).skip(9*pagina).limit(9);
    total = await Alimento.countDocuments({"creado_por":username, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}});
  }
  res.json({
    resultado: alimentosDB,
    total: total
  });
});

//OBTENER LOS 25 ALIMENTOS MAS RECIENTES DEL USUARIO
router.get('/recientes/:userId', async (req, res) => {

  const userId = req.params.userId;
  const pagina = req.query.pagina;
  const ordenar = req.query.ordenar;
  const buscador = !(req.query.buscador) ? '': req.query.buscador;
  const alergeno = req.query.filters;

  var consumiciones = await Consumicion.aggregate().match({"usuario": mongoose.Types.ObjectId('6244d94635c17b47d527f178')})
  .sort({"fecha":-1}).group({"_id": "$alimento"});

  var alimentosDB = await Alimento.find({"_id":consumiciones, "nombre": {$regex : buscador, $options:"i"}}).skip(pagina*9).limit(9);
  var total =  await Alimento.countDocuments({"_id":consumiciones, "nombre": {$regex : buscador, $options:"i"}});

  if (ordenar && alergeno){
    alimentosDB = await Alimento.find({"_id":consumiciones, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}})
                                .sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9);
    total = await Alimento.countDocuments({"_id":consumiciones, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}});
  }else if(ordenar && !alergeno){
    alimentosDB = await Alimento.find({"_id":consumiciones, "nombre": {$regex : buscador, $options:"i"}})
                                .sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9);
  }else if(!ordenar && alergeno){
    alimentosDB = await Alimento.find({"_id":consumiciones, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}})
                                .skip(9*pagina).limit(9);
    total = await Alimento.countDocuments({"_id":consumiciones, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}});
  }

  res.json({
    resultado: alimentosDB,
    total: total
  });
});


//OBTENER LOS 25 ALIMENTOS MAS RECIENTES DEL USUARIO
router.get('/favoritos/:userId', async (req, res) => {

  const userId = req.params.userId;
  const pagina = req.query.pagina;
  const ordenar = req.query.ordenar;
  const buscador = !(req.query.buscador) ? '': req.query.buscador;
  const alergeno = req.query.filters;
  const alimentoIds = req.query.alimentoIds;


  var alimentosDB = await Alimento.find({"_id":alimentoIds, "nombre": {$regex : buscador, $options:"i"}}).skip(pagina*9).limit(9);
  var total =  await Alimento.countDocuments({"_id":alimentoIds, "nombre": {$regex : buscador, $options:"i"}});

  if (ordenar && alergeno){
    alimentosDB = await Alimento.find({"_id":alimentoIds, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}})
                                .sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9);
    total = await Alimento.countDocuments({"_id":alimentoIds, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}});
  }else if(ordenar && !alergeno){
    alimentosDB = await Alimento.find({"_id":alimentoIds, "nombre": {$regex : buscador, $options:"i"}})
                                .sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9);
  }else if(!ordenar && alergeno){
    alimentosDB = await Alimento.find({"_id":alimentoIds, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}})
                                .skip(9*pagina).limit(9);
    total = await Alimento.countDocuments({"_id":alimentoIds, "nombre": {$regex : buscador, $options:"i"}, "alergenos": {$not: {$regex : alergeno}}});
  }

  res.json({
    resultado: alimentosDB,
    total: total
  });
});

router.route('/add').post((req, res, next) => {
  var item = new Alimento(req.body);
  item.save()
  .then(() => {
    res.status(200).json({'item': 'Item added successfully'});
  })
  .catch(() => {
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
      body._id = new mongoose.Types.ObjectId();
      const alimentoDB = await Alimento.create(body);
      res.status(200).json(alimentoDB); 
  } catch (error) {
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


//CAMBIAR POR UN ROUTER GET EN USUARIO-----------------------
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
//------------------------------------------------------------

// Exportamos la configuración de express app
module.exports = router;
