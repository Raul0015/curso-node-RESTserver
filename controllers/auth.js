const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {
    const { correo, password } = req.body;

    try{

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - EMAIL' // Indicamos que el correo no se encontro
            })
        }

        // Si el usuario está activo
        if (!usuario.estado) { // estado false
            return res.status(400).json({
                msg: 'Usuario no activo'
            })
        }

        // Verificar la contraseña 
        const validatePassword = bcryptjs.compareSync(password, usuario.password);
        if (!validatePassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - PASSWORD' // Indicamos que el correo no se encontro
            })
        }
        // Generar el JWT
        const token = await generarJWT( usuario.id )
    
        res.json({
            usuario,
            token
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({ // Status 500 = internal server error
            msg: 'Algo salio mal, hable con el administrador'
        })
    }

};

module.exports = {
    login
}