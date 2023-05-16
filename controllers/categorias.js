const {response, request} = require('express');

const { Categoria } = require('../models/index')

// obtenerCategorias - paginado - total - populate
const getCategories = async(req, res = response) => {
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true })
            .populate("usuario", "nombre")
    ]);

    res.json({
        total,
        categorias
    });
};

// obtenerCategoria - populate {}
const getCategoryById = async(req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');


    res.json({
        categoria
    });
}

// Crear categoria 
const postCategory = async(req, res = response) => { // Crear categoria
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){ // Si la categoria existe
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    console.log(data);

    const categoria = new Categoria( data );

    // Guardar en DB
    await categoria.save();

    res.status(201).json({
        categoria
    })
};

// actualizarCategoria
const putCategory = async(req, res = response) => {
    const { id } = req.params;

    // Extraemos lo que necesitamos
    const { estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        categoria
    });
};


// borrarCategoria - estado: false
const deleteCategory = async(req, res = response) => {
    const { id } = req.params;

    // Cambiar el estado de la categoria
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        categoria
    })
}



module.exports = {
    getCategories,
    getCategoryById,
    postCategory,
    putCategory,
    deleteCategory
}