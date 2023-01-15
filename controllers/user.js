const { response } = require( 'express' )
const Usuario = require('../models/usuario')


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

    const body = req.body;
    const usuario = new Usuario( body );

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