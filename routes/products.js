const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto,
    obtenerProductos,
    obtenerProducto, 
    actualizarProducto,
    borrarProducto} = require('../controllers/products');
const { existeCategoria, existeProductoId } = require('../helpers/db-validators');
const { adminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



const router = Router();

router.get('/', obtenerProductos)

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], obtenerProducto)


router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un Id de Mongo valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto)


router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], actualizarProducto)


router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos
], borrarProducto)


module.exports = router;