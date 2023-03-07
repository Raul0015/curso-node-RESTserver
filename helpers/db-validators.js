const Usuario = require('../models/user')
// Validacion de rol
const Role = require('../models/role');

const validateRole = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol){
           throw new Error(`El rol ${rol} no es valido en la DB`);
    }
};

const validateEmail = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error (`El correo ya existe en la DB`);
    }
};

const existeUsuario = async(id) => {
    const existeId = await Usuario.findById(id);
    if(!existeId){
        throw new Error ('El ID ingresado no existe en la DB');
    }
}

module.exports = {
    validateRole,
    validateEmail,
    existeUsuario
}