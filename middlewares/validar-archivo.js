const { response } = require("express")

const validarArchivoSubir = (req, res = response, next) => {
    // Pregunta si en el request viene una propiedad file, sino hace un return 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ 
            msg: 'No hay archivos en la petición'
        });    
    }
    
    if (!req.files.archivo) {
        return res.status(400).json({ 
            msg: 'No hay archivos en la petición'
        });
    }

    next();
}

module.exports = {
    validarArchivoSubir
}