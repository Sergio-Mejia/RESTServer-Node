const { response, json } = require("express");
const bcryptjs = require( 'bcryptjs' );

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async(req, res = response) => {
    const {id_token} = req.body;


    try {
        
        const googleUser = await googleVerify( id_token )
        console.log( googleUser ) 

        res.json({
            msg: 'Todo Ok', 
            id_token
        })

    } catch (error) {
        json.status(400).json({
            ok: false,
            msg: "El token no se pudo verificar"
        })
    }

}


module.exports = {
    login,
    googleSignIn
}