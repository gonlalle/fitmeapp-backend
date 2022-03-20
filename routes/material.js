const router = require('express').Router();
// Require Item model in our routes module
var Material = require('../models/material');

// Get con todos los documentos

router.get('/', async (req, res) => {
    const items = await Material.find();
    res.json(items);
});

router.get('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const items = await Material.findById(_id);
        res.json(items);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

// router.get('/getnombres/:idString', async (req, res) => {
//     const ids = req.params.idString.split(",");
//     try {
//         ret = ""
//         for (idChar in ids) {
//             var _id = parseInt(idChar);
//             const items = await Material.find({_id});
//             ret += items["name"];
//         }
//         res.json(ret);
//     } catch (error) {
//         return res.status(400).json({
//         mensaje: 'An error has occurred',
//         error
//         })
//     }
// });

// Exportamos la configuración de express app
module.exports = router;