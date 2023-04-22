const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req = request, res = response) => {
    const {id_token} = req.body;

    try{

        const {nombre, img, correo} = await googleVerify(id_token);
        

        // Ver si el correo ya esta en la base
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: '123456',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);

            await usuario.save();
        }

        // // Si el ususario en DB
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // // Generar el JWT
        const token = await generarJWT( usuario.id )


        res.json({
            msg: 'Todo bien, se realizo el registro con Google Sign-in',
            usuario,
            token
        });
    } catch(error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }


}

module.exports = {
    login,
    googleSignIn
}