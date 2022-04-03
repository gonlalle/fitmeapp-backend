const router = require('express').Router();
// Require Item model in our routes module
var Ejecucion = require('../models/ejercicio_ejecucion');
var Ejercicio = require('../models/ejercicio');

const moment = require('moment')
const today = moment().startOf('day')

// Get de Recomendados
router.get('/recomendacion', async (req, res) => {
    try {
        console.log("hey")
        const items = await Ejecucion.find({"recomendado":true, fecha: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
          }});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Get by id
router.get('/:ejecucionId', async (req, res) => {
    try {
        const ejecucionId = Number(req.params.ejecucionId);
        const items = await Ejecucion.find({ejecucionId});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Get by exercise id 
router.get('/:ejercicioId', async (req, res) => {
    try {
        const ejercicioId = Number(req.params.ejercicioId);
        const items = await Ejercicio.find({"ejercicio":ejercicioId});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Get by completion
router.get('/:done', async (req, res) => {
    try {
        const numb = Number(req.params.done);
        if (numb==1) {
            const done = true;
        }
        else {
            const done = false;
        }
        const items = await Ejecucion.find({"hecho":true});
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Get con todos los documentos
router.get('/', async (req, res) => {
    try {
        const items = await Ejercicio.find();
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// Exportamos la configuración de express app
module.exports = router; 