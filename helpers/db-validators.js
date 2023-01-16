const Role = require('../models/role');
const Usuario = require('../models/usuario')


const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}

const existeEmail = async (email = '') => {
    const emailDB = await Usuario.findOne({ email });
    if ( emailDB ) {
        throw new Error(`El email ${email} ya está registrado en la base de datos`)
    }
}

const existeUsuarioPorId = async (id = '') => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El id ${ id } no existe`)
    }
}

module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId,
}
