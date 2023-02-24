require('dotenv').config(); // Para que tome el archivo .env y tome todas las variables de entorno


const Server = require('./models/server');


const server = new Server();

server.listen();