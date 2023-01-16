const { response } = require('express')
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')


const usersGet = async (req, res = response) => {


    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        usuarios
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

    res.json(usuario)
}

const userPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //Validar contra base de datos 
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate(id, resto);


    res.status(400).json({
        usuarioDB
    })
}


const userDelete = async(req, res = response) => {
    const { id } = req.params;

    //Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );
    
    //Cambiar estado del usuario
    const usuario = await Usuario.findByIdAndUpdate( id, { state: false} );

    res.json( usuario );
}


module.exports = {
    usersGet,
    userPost,
    userPut,
    userDelete
}