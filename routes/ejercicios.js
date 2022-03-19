const router = require('express').Router();
// Require Item model in our routes module
var Ejercicio = require('../models/exercise');

// Get con todos los documentos

router.get('/', async (req, res) => {
  const items = await Ejercicio.find().limit(8);
  res.json(items);

});


// Exportamos la configuración de express app
module.exports = router; 