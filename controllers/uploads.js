const path = require('path')
const { v4: uuidv4 } = require('uuid');

const { response } = require("express");


const cargarArchivos = (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({ msg: "No hay archivos en la petición"});
        return;
    }

    const { archivo } = req.files; 

    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[ nombreCortado.length - 1 ]

    //Validar la extension
    const extensionesValidas = ['jpg', 'png', 'jpeg', 'gif']
    if( !extensionesValidas.includes( extension )){
        res.status(400).json({
            msg: `La extension ${extension} no es permitida. Extensiones permitidas: ${ extensionesValidas }`
        })
    }

   
    const nombreTemporal = uuidv4() + "."+ extension;
    //Ruta donde voy a mandar los archivos -> path.join para unir toda la ruta
    const uploadPath = path.join( __dirname , '../uploads/', nombreTemporal ) ;

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