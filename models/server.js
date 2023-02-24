const express = require('express');
const cors = require('cors');


class Server{

    // Properties
    constructor(){
        this.app = express(); // Create express app like a propertie of the class
        this.port = process.env.PORT || 3000;
        this.userPath = '/api/users';

        // Middlewares
        this.middleware();

        // Rutes
        this.routes();
    }

    // Methods
    middleware(){

        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.userPath, require('../routes/users'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor trabajando en el puerto: ${this.port}`);
        });
    }
}

module.exports = Server;
