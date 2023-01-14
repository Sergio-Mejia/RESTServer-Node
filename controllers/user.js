const { response } = require( 'express' )


const usersGet = (req, res = response) => {

    const { q, nombre = 'No name', apikey} = req.query

    res.json({
        msg: "Get Controlador",
        q,
        nombre,
        apikey
    })
}

const userPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.status(201).json({
        msg: "Post Controlador",
        nombre,
        edad
    })
}

const userPut = (req, res = response ) => {

    const {id} = req.params;
    res.status(400).json({
        msg: "Put Controlador",
        id
    })
}

const userDelete = (req, res = response) => {
    res.json({
        msg: "Delete Controlador"
    })
}


module.exports = {
    usersGet,
    userPost,
    userPut,
    userDelete
}