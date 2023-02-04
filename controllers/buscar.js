const { response } = require("express");
const { Usuario } = require("../models");
const { ObjectId } = require("mongoose").Types;


const coleccionesPermitidas = [
    'categories',
    'products',
    'roles',
    'users',
];

const buscarUsuarios = async( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const usuario = await Usuario.findById( termino );

        res.json({
            //Pregunta por el usuario, si existe envia el arreglo con el usuario si no, envia arreglo vacio
            results: (usuario) ? [usuario] : []
        })
    }
}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch( coleccion ) {
        case 'users':
            buscarUsuarios( termino, res )
        break;
        case 'products':
        break;
        case 'categories':

        break;

        default:
            res.status(500).json({
                msg: "Busqueda sin implementar "
            })
    }
}


module.exports = {
    buscar
}