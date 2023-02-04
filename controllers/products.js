const { response } = require("express");
const { Product } = require('../models');


const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('usuario', 'name')
            .populate('categoria', 'name')
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        products
    });
}

const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Product.findById(id)
        .populate('usuario', 'name')
        .populate('categoria', 'name');

    res.json(producto)
}


const crearProducto = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Product.findOne({ name: body.name })

    //Si productoDB existe
    if (productoDB) {
        return res.status(400).json({
            msg: `El Producto ${productoDB.name} ya existe`
        })
    }

    //Generar data a guardar
    const data = {
        ...body,
        name : body.name.toUpperCase(),
        usuario: req.usuario._id,
    }

    const product = new Product(data);

    //guardar DB
    await product.save();
    res.status(201).json(product)

}


const actualizarProducto  = async (req, res = response) => {
    const {id} = req.params;
    //Sacar los datos que no ncesitamos actualizar, los datos que si nos interesan se guardan en ...data
    const { usuario, estado, ...data} = req.body;

    if( data.name ){
        data.name = data.name.toUpperCase()
    }
    data.usuario = req.usuario._id;

    const productoDB = await Product.findByIdAndUpdate( id, data, { new : true })

    res.json( productoDB )
}

const borrarProducto = async( req, res = response ) => {
    const {id} = req.params;
    // new : true -> Para que se vean los nuevos cambios en la respuesta Json
    const producto = await Product.findByIdAndUpdate( id, { estado : false}, { new : true });

    res.json( producto )
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}