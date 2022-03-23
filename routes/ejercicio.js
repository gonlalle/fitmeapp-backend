const router = require('express').Router();
// Require Item model in our routes module
var Ejercicio = require('../models/ejercicio');
var Musculo = require('../models/musculo');

// Get con todos los documentos

router.get('/', async (req, res) => {
  const items = await Ejercicio.find();
  res.json(items);
});
// Exportamos la configuración de express app
module.exports = router;