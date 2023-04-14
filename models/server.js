const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server{

    // Properties
    constructor(){
        this.app = express(); // Create express app like a propertie of the class
        this.port = process.env.PORT


        this.userPath = '/api/users';
        // Rura para autenticación
        this.authPath = '/api/auth';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middleware();

        // Rutes
        this.routes();
    }

    // Methods
    async conectarDB(){
        await dbConnection();
    }

    middleware(){

        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.userPath, require('../routes/users'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor trabajando en el puerto: ${this.port}`);
        });
    }
}

module.exports = Server;