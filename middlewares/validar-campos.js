const { validationResult } = require('express-validator');

// Muestra los errores
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next(); // Es lo que sigue en caso de que el middleware pasa
}

module.exports = {
    validarCampos   
}