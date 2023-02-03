const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, userPost, userPut, userDelete } = require('../controllers/user');

const { esRolValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    adminRole,
    tieneRol
 } = require('../middlewares');

const router = Router();


router.get('/', usersGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),  //.not().isEmpty() no tiene que estar vacio el campo de nombre
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( existeEmail ),
    check('password', 'La contraseña es obligatoria con mas de 6 letras').isLength({ min: 6 }),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRolValido ),
    validarCampos
], userPost);


router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRolValido ),
    validarCampos
], userPut);


router.delete('/:id', [
    validarJWT,
    // adminRole, //Forzar a que el usuario sea administrador para eliminar de la DB
    tieneRol( 'ADMIN_ROLE', 'VENTAS_ROLE' ),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,userDelete );


module.exports = router;