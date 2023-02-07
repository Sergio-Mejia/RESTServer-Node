const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivos, actualizarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivo } = require('../middlewares');


const router = Router();

router.post( '/', validarArchivo ,cargarArchivos );


router.put( '/:coleccion/:id',[
    validarArchivo,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users', 'products'])),
    validarCampos
], actualizarImagen );

module.exports = router;