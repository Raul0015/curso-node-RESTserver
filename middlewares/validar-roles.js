const { response } = require("express");


const esAdminRole = (req, res = response, next)  => {

    if(!req.usuario){
        return res.status(500).json({ // status 500: internal server error
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }
    
    const { rol, nombre} = req.usuario;

    if ( rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede realizar está acción`
        })
    }

    next();
}


const tieneRol = ( ...roles ) => {
    return (req, res = response, next) => {
        if (!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if( !roles.includes(req.usuario.rol) ){ // If the rol is not includes in the array allowed
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            });
        }

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRol
}