const { response, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario/Contraseña no son correctos - email"
            })
        }


        //Verificar si el usuario esta activo
        if (!usuario.state) {
            return res.status(400).json({
                msg: "Usuario/Contraseña no son correctos - estado False"
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario/Contraseña no son correctos - Password"
            })
        }

        //Generar JWT  
        const token = await generarJWT(usuario.id);


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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {

        const {email, name, img } = await googleVerify(id_token)

        //Generar referencia
        let usuario = await Usuario.findOne({ email });
        if( !usuario ){
            //Si no existe tengo que grabarlo
            const data = {
                name,
                email,
                password: ':0',
                img,
                rol: 'ADMIN_ROLE',
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario en DB 
        if( !usuario.state ){
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            });
        }


        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "El token no se pudo verificar"
        });
    }
}

const renovarToken = async(req, res = response) => {
    const {usuario} = req;
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })
}


module.exports = {
    login,
    googleSignIn,
    renovarToken
}