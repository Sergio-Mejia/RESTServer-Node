const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Product } = require('../models')


const cargarArchivos = async (req, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'textos');
        res.json({ nombre });
    } catch (error) {
        res.status(400).json({ error })
    }
}


const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: `No validado` });
    }


    //Eliminar imagenes previas 
    //Si la propiedad img existe en el servidor
    if (modelo.img) {
        //Borarr imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}


const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: `No validado` });
    }


    //Si la propiedad img existe en el servidor
    if (modelo.img) {
        //Borarr imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImage)) {
            return res.sendFile( pathImage )
        }
    }

    res.json({msg: 'Falta placeholder'})
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen
}