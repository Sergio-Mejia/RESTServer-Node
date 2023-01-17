const { response } = require("express");
const bcryptjs = require( 'bcryptjs' );

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if( !usuario ){
            return res.status(400).json({
                msg : "Usuario/Contraseña no son correctos - email"
            })
        }
       
        
        //Verificar si el usuario esta activo
        if( !usuario.state ){
            return res.status(400).json({
                msg : "Usuario/Contraseña no son correctos - estado False"
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg : "Usuario/Contraseña no son correctos - Password"
            })
        }

        //Generar JWT  
        const token = await generarJWT( usuario.id ); 


        res.json({
            usuario,
            token

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal. Contactar al administrador'
        })
    }
}


module.exports = {
    login
}