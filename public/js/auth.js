
const miFormulario = document.querySelector('form');



const url = (window.location.hostname.includes('localhost'))
    ? "http://localhost:8080/api/auth/"
    : "http://localhost:8081/api/auth/"



miFormulario.addEventListener('submit', ev => {
    //Evitar hacer refresh del navegador
    ev.preventDefault();

    const formData = {};

    for (let element of miFormulario.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg);
            }

            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => {
            console.log(err)
        })
})


function handleCredentialResponse(response) {
    //Google token: ID Token
    // console.log('Id_Token', response.credential);

    const body = {
        id_token: response.credential,
    };

    fetch(url + 'google', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
        .then((resp) => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

const button = document.getElementById("google_signout");
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    //obtener email de localStorage para logout
    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
        //Limpiar localSorage
        localStorage.clear();
        // Reacargar la pagina y borrar cualquier estado de la app
        location.reload();
    });
};