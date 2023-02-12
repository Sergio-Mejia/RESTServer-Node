const url = ( window.location.hostname.includes('localhost'))
            ? "http://localhost:8080/api/auth/"
            : "http://localhost:8081/api/auth/"


        
let usuario = null;
let socket = null;


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
}


const main = async() => {

    //Validar JWT
    await validarJWT()

}


main();


// const socket = io();
