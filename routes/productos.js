const { Router } = require('express');
const { check } = require('express-validator');


const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');

const { postProducto, getProducto, getProductoById, putProducto, deleteProducto } = require('../controllers/productos');

const router = Router();

// Obtener todos los productos - publico
router.get('/', getProducto);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], getProductoById);

// Crear una nuevo producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], postProducto);


// Actualizar una categoria por id - privado - cualquier persona con un token valido
router.put('/:id', [ // No obligamos a revisar el nombre porque tal vez quiere actualizar el precio
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], putProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido'),
    check('id').custom(existeProducto),
    validarCampos
], deleteProducto)

module.exports = router;