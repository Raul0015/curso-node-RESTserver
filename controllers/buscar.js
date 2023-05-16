const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // True si es un mongo id

    if (esMongoID){ // Si el termino es un id de mongo
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : [] // Si el usuario existe mando un arreglo con el  usuario, sino mando un arreglo vacio (usamos el terminario para evitar un NULL en caso de error)
        })
    }

    // Vamos a hacer busquedas in sencibles para que se pueda escribir con mayusculas u otras variaciones
    const regexp = new RegExp(termino, 'i');


    const usuarios = await Usuario.find({
        $or: [{nombre: regexp}, {correo: regexp}],
        $and: [{estado: true}] // El estado debe ser true
    });
    res.json({
        results: usuarios
    })

}

const buscarCategoria = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regexp = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        nombre: regexp,
        $and: [{estado: true}]
    });

    res.json({results: categorias})

}


const buscarProducto = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // True si es un mongo id

    if (esMongoID){ // Si el termino es un id de mongo
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : [] // Si el usuario existe mando un arreglo con el  usuario, sino mando un arreglo vacio (usamos el terminario para evitar un NULL en caso de error)
        })
    }

    // Vamos a hacer busquedas in sencibles para que se pueda escribir con mayusculas u otras variaciones
    const regexp = new RegExp(termino, 'i');


    const productos = await Producto.find({nombre: regexp, estado: true});
    res.json({
        results: productos
    })

}

const buscar = (req, res = response) => {
    
    const { coleccion, termino} = req.params;
    
    // Ver si la coleccion que pasa por la URL esta permitida
    if(!coleccionesPermitidas.includes(coleccion)){ // Si no esta incluida
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }


    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategoria(termino, res);
        break;
        case 'productos':
            buscarProducto(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta búsqueda'
            })
    }

};

module.exports = {
    buscar
}