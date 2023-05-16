// Ruta para las categorias
const {Router} = require('express');
const {check} = require('express-validator');


const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { postCategory, getCategories, getCategoryById, putCategory, deleteCategory } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoraia por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], getCategoryById);

// Crear una nueva categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCategory );

// Actualizar una categoria por id - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], putCategory);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], deleteCategory);

module.exports = router;