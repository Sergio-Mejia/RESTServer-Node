const { response } = require("express");
const { Category } = require('../models')


//obtnerCategorias - paginado - total -populate(mongoose)
const obtenerCategorias = async( req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }


    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query ).populate('usuario', 'name')
            .skip( desde )
            .limit( limite )
    ]);

    res.json({
        total,
        categories
    })

}


const obtenerCategoria = async( req, res = response) => {
    const { id } = req.params;

    const categoria = await Category.findById( id ).populate('usuario', 'name');

    res.json( categoria )
}




const crearCategoria = async( req, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoriaDB = await Category.findOne({ name })

    //Si categoriaDB existe
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.name} ya existe`
        })
    }

    //Generar data a guardar
    const data = {
        name,
        usuario: req.usuario._id 
    }

    const categoria = new Category( data );

    //guardar DB
    await categoria.save();

    res.status(201).json( categoria )

}

const actualizarCategoria  = async (req, res = response) => {
    const {id} = req.params;
    //Sacar los datos que no ncesitamos actualizar, los datos que si nos interesan se guardan en ...resto
    const { usuario, estado, ...resto} = req.body;

    resto.name = resto.name.toUpperCase()
    resto.usuario = req.usuario._id;

    const categoriaDB = await Category.findByIdAndUpdate( id, resto, { new : true })

    res.json( categoriaDB )
}


const borrarCategoria = async( req, res = response ) => {
    const {id} = req.params;
    // new : true -> Para que se vean los nuevos cambios en la respuesta Json
    const categoria = await Category.findByIdAndUpdate( id, { estado : false}, { new : true });

    res.json( categoria )
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    borrarCategoria,
    actualizarCategoria
}