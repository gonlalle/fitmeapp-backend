// importar el modelo nota
const router = require('express').Router();
var Exercise = require('../models/ejercicio');

// Get con parámetros
router.get('/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const exerciseBD = await Exercise.find({_id});
      res.json(exerciseBD);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

  router.get('/muscle/:id', async(req, res) => {
    console.log("hey");
    const _muscle = Number(req.params.id);
    console.log(_muscle);
    try {
      const exerciseBD = await Exercise.find({muscles: { $elemMatch: {$eq: _muscle} }}).limit(3);
      res.json(exerciseBD);
      console.log(exerciseBD);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });
  
  // Get con todos los documentos
  router.get('/', async(req, res) => {
    try {
      const exerciseBD = await Exercise.find();
      res.json(exerciseBD);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

  module.exports = router;