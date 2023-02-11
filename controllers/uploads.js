const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

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


const actualizarImagenCloudinary = async (req, res = response) => {

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


    //Eliminar imagenes previas de Cloudinary (no repeticion )
    //Si la propiedad img existe en el servidor
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ]; 
        const [ public_id ] = nombre.split('.');

        //Borrar
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url;

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
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImage)) {
            return res.sendFile( pathImage )
        }
    }

    const pathImage = path.join( __dirname, '../assets/NoImage.png');
    res.sendFile( pathImage )

    // res.json({msg: 'Falta placeholder'})
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}