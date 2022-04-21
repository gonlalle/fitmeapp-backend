const router = require('express').Router();
// Require Item model in our routes module
var Ejercicio = require('../models/ejercicio');
var Musculo = require('../models/musculo');

const numReg = 24;

// Get con todos los documentos
router.get('/', async(req, res) => {
  const pagina = req.query.pagina;
  const buscador = !(req.query.buscador) ? '': req.query.buscador;
  const zonaMuscular = Number(req.query.zonaMuscular);
  let materiales = req.query.materiales;
  if (materiales){
    materiales = materiales.map(str => { return Number(str); });
  } 

  try {
    var exerciseBD = await Ejercicio.aggregate().match({'name': {$regex: buscador, $options:'i'}}).skip(numReg*pagina).limit(numReg)
                                    .lookup({from:'muscles',as:'muscles',localField:'muscles',foreignField:'_id'})
                                    .lookup({from:'muscles',as:'muscles_secondary',localField:'muscles_secondary',foreignField:'_id'})
                                    .lookup({from:'equipment',as:'equipment',localField:'equipment',foreignField:'_id'})
                                    .lookup({from:'categories',as:'category',localField:'category',foreignField:'_id'});
    var total = await Ejercicio.countDocuments({'name': {$regex: buscador, $options:'i'}});
    if ((zonaMuscular && zonaMuscular > 0) && materiales){

      exerciseBD = await Ejercicio.aggregate().match({$and:[{'name': {$regex: buscador, $options:'i'}}, {'category': zonaMuscular}, {'equipment': {$in: materiales}}]})
                                  .skip(numReg*pagina).limit(numReg)
                                  .lookup({from:'muscles',as:'muscles',localField:'muscles',foreignField:'_id'})
                                  .lookup({from:'muscles',as:'muscles_secondary',localField:'muscles_secondary',foreignField:'_id'})
                                  .lookup({from:'equipment',as:'equipment',localField:'equipment',foreignField:'_id'})
                                  .lookup({from:'categories',as:'category',localField:'category',foreignField:'_id'});
      total = await Ejercicio.countDocuments({'name': {$regex: buscador, $options:'i'}, 'category': zonaMuscular, 'equipment': {$in: materiales}});

    } else if (!(zonaMuscular && zonaMuscular > 0) && materiales){

      exerciseBD = await Ejercicio.aggregate().match({$and:[{'name': {$regex: buscador, $options:'i'}}, {'equipment': {$in: materiales}}]})
                                  .skip(numReg*pagina).limit(numReg)
                                  .lookup({from:'muscles',as:'muscles',localField:'muscles',foreignField:'_id'})
                                  .lookup({from:'muscles',as:'muscles_secondary',localField:'muscles_secondary',foreignField:'_id'})
                                  .lookup({from:'equipment',as:'equipment',localField:'equipment',foreignField:'_id'})
                                  .lookup({from:'categories',as:'category',localField:'category',foreignField:'_id'});
      total = await Ejercicio.countDocuments({'name': {$regex: buscador, $options:'i'}, 'equipment': {$in: materiales}});

    } else if ((zonaMuscular && zonaMuscular > 0) && !materiales){
      exerciseBD = await Ejercicio.aggregate().match({$and:[{'name':{$regex: buscador, $options:'i'} }, {'category': zonaMuscular }]})
                                  .skip(numReg*pagina).limit(numReg)
                                  .lookup({from:'muscles',as:'muscles',localField:'muscles',foreignField:'_id'})
                                  .lookup({from:'muscles',as:'muscles_secondary',localField:'muscles_secondary',foreignField:'_id'})
                                  .lookup({from:'equipment',as:'equipment',localField:'equipment',foreignField:'_id'})
                                  .lookup({from:'categories',as:'category',localField:'category',foreignField:'_id'}); 
      total = await Ejercicio.countDocuments({'name': {$regex: buscador, $options:'i'}, 'category': zonaMuscular});
    }
    res.json({
      resultado: exerciseBD,
      total: total
    });
  } catch (error) {
    console.log(error)
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