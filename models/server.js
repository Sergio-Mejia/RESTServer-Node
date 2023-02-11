const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');
 
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server)


        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads'
        }

        //Conexion base de datos 
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas app
        this.routes();

        //Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //Lectura y parse del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        //FileUpload -Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            //Crear una carpeta si no existe
            createParentPath: true
        }));
    }

    routes() {
        //Que necesito llamar? -> require('../routes/user')
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }


    sockets(){
        this.io.on("connection", socketController);
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server Running port', this.port);
        })
    }


}

module.exports = Server;
