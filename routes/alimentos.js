const router = require('express').Router();
// Require Item model in our routes module
var Alimento = require('../models/alimento');

// Get con todos los documentos

router.get('/', async (req, res) => {
  const items = await Alimento.find().limit(100);
  res.json(items);
  
});

router.get('/:code', async (req, res) => {
  const code = req.params.code;
  const items = await Alimento.findOne({code: '3327986'});
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