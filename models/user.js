

const {Schema, model} = require('mongoose')


const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] // Si es requerido, mensaje en caso de error
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USE_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


module.exports = model('Usuario', UsuarioSchema);
// {
//     nombre: '',
//     correo: '',
//     password: '',
//     img: '1561516',
//     rol: '415646',
//     estado: false,
//     google: true,
// }