const router = require('express').Router();
// Require Item model in our routes module
var Ejercicio = require('../models/ejercicio');
var Musculo = require('../models/musculo');


// Get con todos los documentos
router.get('/', async(req, res) => {
  try {
    const exerciseBD = await Ejercicio.find();
    res.json(exerciseBD);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Get con parámetros
router.get('/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const exerciseBD = await Ejercicio.findOne({_id});
    res.json(exerciseBD);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

router.get('/muscle/:id', async(req, res) => {
  const _muscle = Number(req.params.id);
  try {
    const exerciseBD = await Ejercicio.find({muscles: { $elemMatch: {$eq: _muscle} }}).limit(3);
    res.json(exerciseBD);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Exportamos la configuración de express app
module.exports = router;