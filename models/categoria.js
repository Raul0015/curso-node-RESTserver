// Modelo para las categorias
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: { // Vamos a ver que usuario fue el que creo la categoria
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

CategoriaSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema);