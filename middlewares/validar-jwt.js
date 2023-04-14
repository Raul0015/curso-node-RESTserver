const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');

const validarJWT = async(req = request, res = response, next) => {

    // Reading the name of header
    const token = req.header('x-token');

    // If token's not there 
    if ( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try{

        // Validate and verify token
        const { uid } = jwt.verify( token, process.env.SECRETOPRIVATEKEY );


        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB'
            })
        }

        // Valdiar si el usuario que esta eliminando el registro no esta eliminado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado: false'
            })
        }


        req.usuario = usuario;

        next();

    } catch(error){

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }

}


module.exports = {
    validarJWT
}