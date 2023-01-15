const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, userPost, userPut, userDelete } = require('../controllers/user');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();


router.get('/', usersGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),  //.not().isEmpty() no tiene que estar vacio el campo de nombre
    check('email', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria con mas de 6 letras').isLength({ min: 6 }),
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], userPost);

router.put('/:id', userPut);

router.delete('/', userDelete);


module.exports = router;