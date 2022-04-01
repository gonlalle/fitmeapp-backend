const router = require('express').Router();
// Require Item model in our routes module
var Recomendados = require('../models/ejercicioRecomendado');
var Ejercicio = require('../models/ejercicio');

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

// Get by id
router.get('/:recomendadoId', async (req, res) => {
    try {
        const recomendadoId = Number(req.params.recomendadoId);
        const items = await Ejercicio.find({recomendadoId});
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
        const items = await Ejercicio.find({"hecho":done});
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