const mongoose = require('mongoose');


const dbConnection = async() => {
    try{
        // Esperamos a que la conexión se haga
        await mongoose.connect(process.env.MONGODB_ATLAS);

        console.log('Base de datos conectada')

    }catch(error){
        console.log(error);
        throw new Error ('Erro con la conexión a la base de datos')
    }
}


module.exports = {
    dbConnection
}