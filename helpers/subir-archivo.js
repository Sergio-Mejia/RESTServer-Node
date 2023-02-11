const path = require('path')
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionesValidas = ["jpg", "png", "jpeg", "gif"], carpeta = '' ) => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;

        const nombreCortado = archivo.name.split(".");
        const extension = nombreCortado[nombreCortado.length - 1];

        //Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject( `La extension ${extension} no es permitida. Extensiones permitidas: ${extensionesValidas}`)
        }

        const nombreTemporal = uuidv4() + "." + extension;
        //Ruta donde voy a mandar los archivos -> path.join para unir toda la ruta
        const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemporal);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject( err );
            }
            resolve( nombreTemporal );
        });
    });
};

module.exports = {
    subirArchivo,
};
