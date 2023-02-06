
const { response } = require("express");
const { subirArchivo } = require("../helpers");


const cargarArchivos = async(req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({ msg: "No hay archivos en la petición"});
        return;
    }

    try {
        const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos');
        res.json({ nombre });
    } catch (error) {
        res.status(400).json({ error })
    }

}


module.exports = {
    cargarArchivos
}