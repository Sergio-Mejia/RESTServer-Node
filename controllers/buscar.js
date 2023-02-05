const { response } = require("express");
const { Usuario, Product, Category } = require("../models");
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
        //return para no ejecutar nada fuera del if
        return res.json({
            //Pregunta por el usuario, si existe envia el arreglo con el usuario si no, envia arreglo vacio
            results: (usuario) ? [usuario] : []
        })
    }

    //Expresion regular -> Hacer ****insensible**** a minusculas y mayusculas
    const regex = new RegExp( termino, 'i')

    const usuarios = await Usuario.find({ 
        $or:[{ name: regex }, { email: regex }],
        $and: [{ state: true}]
    });
    res.json({
        results: usuarios
    })
}


const buscarProductos = async( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const producto = await Product.findById( termino )
                                .populate( 'categoria', 'name' );
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp( termino, 'i' )

    const productos = await Product.find({ name: regex, estado: true })
                            .populate( 'categoria', 'name' );


    res.json({
        result: productos
    });
}


const buscarCategories = async( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const categoria = await Category.findById( termino );
        return res.json({
            result: ( categoria ) ? [ categoria ] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const categories = await Category.find({ name: regex, estado: true })

    res.json({
        result: categories
    })
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
            buscarProductos( termino, res )
        break;

        case 'categories':
            buscarCategories( termino, res )
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