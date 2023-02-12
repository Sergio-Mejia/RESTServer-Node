const url = ( window.location.hostname.includes('localhost'))
            ? "http://localhost:8080/api/auth/"
            : "http://localhost:8081/api/auth/"


        
let usuario = null;
let socket = null;

//Referencias HTML
const txtUid     = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir   = document.querySelector('#btnSalir')


//Validar tocken localStorage
const validarJWT = async() => {
    const token = localStorage.getItem('token');

    if(token.length <= 10 ){
        window.location = 'index.html';
        throw new Error("No hay token en el servidor")
    }

    const respuesta = await fetch( url, {
        headers: { 'x-token': token}
    })

    const { usuario: userDB, token: tokenDB } = await respuesta.json();
    console.log(userDB, tokenDB);
    usuario = userDB;

    document.title = usuario.name;

    await conectarSocket();
}


const conectarSocket = async() => {
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes', () => {

    });

    socket.on('usuarios-activos', (payload) => {
        console.log(payload);
    });

    socket.on('mensaje-privado', () => {

    });
}


const main = async() => {

    //Validar JWT
    await validarJWT()

}


main();


