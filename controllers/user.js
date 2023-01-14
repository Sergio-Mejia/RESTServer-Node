const { response } = require( 'express' )


const usersGet = (req, res = response) => {
    res.json({
        msg: "Get Controlador"
    })
}

const userPost = (req, res = response) => {
    res.status(201).json({
        msg: "Post Controlador"
    })
}

const userPut = (req, res = response ) => {
    res.status(400).json({
        msg: "Put Controlador"
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