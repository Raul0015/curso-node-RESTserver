// Functions to contoll
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/user');



const getUsers = async(req = request, res = response) => {

    // const {q, nombre, apikey} = req.query;

    // Obtener limite
    const {limite = 5, desde = 0} = req.query;


    // Obtener todos los usuarios
    // const usuarios = await Usuario.find({estado: true}) // Para retornar solo los usuarios activos
    //     .limit(Number(limite))
    //     .skip(Number(desde));

    // const total = await Usuario.countDocuments({estado:true});

    // Hacemos las dos promesas de forma simultanea, usamos el promise
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado: true}) // Para retornar solo los usuarios activos
            .limit(Number(limite))
            .skip(Number(desde))
    ]);

    res.json({
        total,
        usuarios
        
        // q,
        // nombre,
        // apikey
    })
};

const getUserById = async(req, res = response) =>{
    const {id} = req.params;

    const usuario = await Usuario.findById(id)

    res.json({
        usuario
    });
};

const putUser = async (req, res = response) => {

    const { id }= req.params;
    // Extraer lo que no necesito
    const { _id ,password, google, correo, ...rest} = req.body;

    // Validar contra DB
    // Actualizar contraseña
    if(password){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); // Numero de vueltas para hacer más complicado el numero de encriptacion
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, rest); // primero el id, despues lo que se va a actualizar

    res.json({
        id,
        usuario
    });
};

const postUser = async(req, res = response) => {
    
    

    const {nombre, correo, password, rol} = req.body;
    // Podemos desestructurar
    // const {nombre, edad} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Verificar si el correo ya existe
    // const existeEmail = await Usuario.findOne({correo});
    // if( existeEmail ){
    //     return res.status(400).json({
    //         msg: 'El correo ya existe!!'
    //     })
    // }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // Numero de vueltas para hacer más complicado el numero de encriptacion
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await usuario.save();
    
    res.json({
        ok:true,
        msg: 'POST API fron Controller',
        usuario
    });
};

const deleteUser = async(req, res = response) => {

    const {id} = req.params;

    // Elimiar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id)

    // Cambiar estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json({
        usuario
    });
};

const patchUser = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'PATCH API from Controller'
    });
};


module.exports = {
    getUsers,
    getUserById,
    putUser,
    postUser,
    deleteUser,
    patchUser
}