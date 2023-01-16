const { response } = require('express')
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')


const usersGet = (req, res = response) => {

    const { q, nombre = 'No name', apikey } = req.query

    res.json({
        msg: "Get Controlador",
        q,
        nombre,
        apikey
    })
}

const userPost = async (req, res = response) => {


    const { name, email, password, rol } = req.body;
    const usuario = new Usuario({ name, email, password, rol });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en base de datos
    await usuario.save();

    res.json({
        usuario
    })
}

const userPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //Validar contra base de datos 
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate( id, resto );


    res.status(400).json({
        msg: "Put Controlador",
        usuarioDB
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