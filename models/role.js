// Roles model, to define the user's rol

const {Schema, model} = require('mongoose');

const RolSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});


module.exports = model('Role', RolSchema);