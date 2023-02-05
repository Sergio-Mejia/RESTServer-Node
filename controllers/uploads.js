const path = require('path')

const { response } = require("express");


const cargarArchivos = (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({ msg: "No hay archivos en la petición"});
        return;
    }

    const { archivo } = req.files; 

    //Ruta donde voy a mandar los archivos -> path.join para unir toda la ruta
    const uploadPath = path.join( __dirname , '../uploads/', archivo.name ) ;

    archivo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ err });
        }

        res.json({ msg: 'File uploaded to ' + uploadPath });
    });
}


module.exports = {
    cargarArchivos
}