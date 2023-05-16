const {response, request} = require('express');

const {Producto} = require('../models/index');
const { body } = require('express-validator');

const getProducto = async(req, res = response) => {
    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({ estado: true })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    })
}

const getProductoById = async(req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        producto
    })
}

const postProducto = async(req, res = response) => {
    const {estado, usuario, ...body} = req.body; // Ignorar usuario y estado

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if (productoDB) { // Si el producto existe
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe en la DB`
        });
    }

    // Generar data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    };

    console.log(data);

    const producto = new Producto( data );

    // Guardar en DB
    await producto.save();

    res.status(201).json({
        producto
    })
};

const putProducto = async(req, res = response) => {
    const { id } = req.params;

    // Extraemos lo que necesitamos
    const {estado, usuario, ...body} = req.body;

    if (body.nombre) { // Si viene el nombre se pone en mayusuclas sino, no se cambia
        body.nombre = body.nombre.toUpperCase();
    }
    
    body.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, body, {new: true});

    res.status(201).json({
        producto
    });
};

const deleteProducto = async(req, res = response) => {
    const {id} = req.params;

    // Cambiar el estado del producto
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        producto
    })
};

module.exports = {
    getProducto,
    getProductoById,
    postProducto,
    putProducto,
    deleteProducto
}