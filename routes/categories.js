const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//Get all categories-> publico
router.get('/', (req, res) => {
    res.json( 'Get' )
})

//Obtener una categoría por id -> publico
router.get('/:id', (req, res) => {
    res.json( 'Get - id' )
})

//Crear categoría -> privado -> cualquier persona con un token valido
router.post('/:id', (req, res) => {
    res.json( 'Post' )
})

//Actualizar categoría -> privado -> cualquier persona con un token valido
router.put('/:id', (req, res) => {
    res.json( 'Put' )
})

//Delete categoría -> privado -> Admin
router.delete('/:id', (req, res) => {
    res.json( 'Delete' )
})



module.exports = router;