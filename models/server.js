const express = require('express');
const cors = require('cors')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Middlewares
        this.middlewares();

        //Rutas app
        this.routes();  
    }

    middlewares(){

        //CORS
        this.app.use(cors())
        //Directorio publico
        this.app.use( express.static('public'))
    }

    routes() {
        this.app.get('/api', (req, res) => {
            res.json({
                msg: "Get"
            })
        });

        this.app.put('/api', (req, res) => {
            res.status(400).json({
                msg: "Put"
            })
        });

        this.app.post('/api', (req, res) => {
            res.status(201).json({
                msg: "Post"
            })
        });

        this.app.delete('/api', (req, res) => {
            res.json({
                msg: "Delete"
            })
        });
    }

    listen(){
        this.app.listen( this.port , () => {
            console.log('Server Running port', this.port); 
        })
    }


}

module.exports = Server;