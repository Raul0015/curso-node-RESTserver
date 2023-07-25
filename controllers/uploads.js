const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');

const { subirArchivo } = require('../helpers');

const {Usuario, Producto} = require('../models');
const { model } = require('mongoose');


// Function to upload files
const cargarArchivos = async(req, res = response) => {
  
    // // Pregunta si en el request viene una propiedad file, sino hace un return 
    // if (!req.files || Object.keys(req.files).length === 0) {
    //   res.status(400).json({msg: 'No hay archivos en la petición'});
    //   return;
    // }
  
    // if (!req.files.archivo) {
    //     res.status(400).json({ msg: 'No hay archivos en la petición'});
    //     return;
    // }

    // Imagenes
    // const nombre = await subirArchivo(req.files);

    try {
        // Subir extenciones como txt, pdf, etc y crear nuevas carpetas
        // const nombre = await subirArchivo(req.files, ['pdf', 'txt'], 'textos')
        // Vamos a permitir imagenes, mandamos argumentos por defecto , necesitamos todos los argumentos
        const nombre = await subirArchivo(req.files, undefined, 'imagenes')
        res.json({ nombre });
    } catch (msg) {
        res.status(400).json({ msg })
    }
    

    // res.json({
    //     nombre
    // })
}

const actualizarImagen = async (req, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No se encontro un producto con el id: ${id}`
                })
            }
        break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
            break;
    }

    // Limpiar imagenes previas
    if( modelo.img ){
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
        // Preguntamos si existe el archivo
        if ( fs.existsSync(pathImagen) ){
            fs.unlinkSync(pathImagen);
        }
    }


    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    
    await modelo.save();

    res.json({
        id, 
        coleccion,
        modelo
    })
};

const actualizarImagenCloudinary = async (req, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No se encontro un producto con el id: ${id}`
                })
            }
        break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
            break;
    }

    // Limpiar imagenes previas
    if( modelo.img ){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1]; // Necesitamos la ultima posición
        const [ public_id ] = nombre.split('.');
        // Borrar imagen doble de un usuario
        await cloudinary.uploader.destroy( public_id );
    }


    const { tempFilePath } = req.files.archivo;
    // Subir a cludinary
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;
    
    await modelo.save();

    res.json({
        id, 
        coleccion,
        modelo
    })

}

const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No es encontro un usuario con el id: ${id}`
                });
            };
        break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ){
                return res.status(400).json({
                    msg: `No se encontro un producto con el id: ${id}`
                });
            };
        break

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
            break;
    }

    // Limpiar imagenes previas
    if( modelo.img ){ // Ver si la imagen esta establecida 
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
        // Preguntamos si existe el archivo
        if ( fs.existsSync( pathImagen ) ){
            return res.sendFile( pathImagen );
        }
    }
    
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );
    // res.json({
    //     msg: 'Falta el place holder'
    // })
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}