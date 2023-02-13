const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket, io) => {
    // console.log('Cliente conectado', socket.id)
    const usuario = await comprobarJWT(socket.handshake.headers['x-token'])
    if (!usuario) {
        return socket.disconnect();
    }


    //Agregar al usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArray)
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)


    //MENSAJES PRIVADOS
    //Conectarlo a una sala especial
    socket.join(usuario.id); //SALAS: Global, socket.id, usuario.id


    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArray);
    });

    socket.on('enviar-mensaje', ({ mensaje, uid }) => {

        if( uid ){
            //Mensaje privado
            socket.to( uid ).emit('mensaje-privado', { de: usuario.name, mensaje })
        }else{
            chatMensajes.enviarMensaje(usuario.id, usuario.name, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }

    })
}

module.exports = {
    socketController
}