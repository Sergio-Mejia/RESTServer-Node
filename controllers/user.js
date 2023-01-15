const { response } = require( 'express' )
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')


const usersGet = (req, res = response) => {

    const { q, nombre = 'No name', apikey} = req.query

    res.json({
        msg: "Get Controlador",
        q,
        nombre,
        apikey
    })
}

const userPost = async(req, res = response) => {


    const { name, email, password, rol } = req.body;
    const usuario = new Usuario({ name, email, password, rol });

    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ email });
    if( existeEmail ){
        return res.status(400).json({
            msg: "El correo ya está registrado"
        })
    }

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );
 
    //Guardar en base de datos
    await usuario.save();

    res.json({
        usuario
    })
}

const userPut = (req, res = response ) => {

    const {id} = req.params;
    res.status(400).json({
        msg: "Put Controlador",
        id
    })
}

const userDelete = (req, res = response) => {
    res.json({
        msg: "Delete Controlador"
    })
}


module.exports = {
    usersGet,
    userPost,
    userPut,
    userDelete
}