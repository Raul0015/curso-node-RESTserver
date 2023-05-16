const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server{

    // Properties
    constructor(){
        this.app = express(); // Create express app like a propertie of the class
        this.port = process.env.PORT

        // Rutas
        this.paths = {
            auth: '/api/auth', // Ruta auth
            user: '/api/users', // Ruta user
            categorias: '/api/categorias', // Ruta categorias
            productos: '/api/productos', // Ruta productos
            buscar: '/api/buscar'
        }

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
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.user, require('../routes/users'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor trabajando en el puerto: ${this.port}`);
        });
    }
}

module.exports = Server;