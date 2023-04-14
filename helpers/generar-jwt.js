const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => { // user identifier
    return new Promise ( (resolve, reject ) => {
        const payload = {uid} // aqui odemos grabar lo que nosotros queramos

        jwt.sign(payload, process.env.SECRETOPRIVATEKEY, {
            expiresIn: '4h',
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('No se pudo generar el JWT')
            }
            else{
                resolve(token)
            }
        }) 
    })
}


module.exports = {
    generarJWT
}