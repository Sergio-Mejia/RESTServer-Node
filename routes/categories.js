const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        borrarCategoria,
        actualizarCategoria} = require('../controllers/categories');
const { existeCategoria } = require('../helpers/db-validators');
const { tieneRol, adminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get('/', obtenerCategorias)

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria)


router.post('/', [ 
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
 ], crearCategoria)


router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria)


router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria)



module.exports = router;