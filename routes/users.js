const {Router} = require('express');
const {check} = require('express-validator');

const router = Router();

const { validateRole, validateEmail, existeUsuario } = require('../helpers/db-validators');

const {getUsers,
       getUserById,
       putUser,
       postUser,
       deleteUser,
       patchUser} = require('../controllers/users');

       
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');
const {
       validarCampos,
       validarJWT,
       esAdminRole,
       tieneRol
} = require('../middlewares') // Podemos poner ../middlewares/index pero esta de más 

router.get('/', getUsers);

router.get('/:id', [
       check('id', 'No es un ID validio').isMongoId(),
       check('id').custom(existeUsuario),
       validarCampos
],getUserById);

// Update informatio
router.put('/:id', [
       check('id', 'No es un ID valido').isMongoId(),
       check('id').custom(existeUsuario),
       check('rol').custom(validateRole), // Actualizar el rol es a elección
       validarCampos
],putUser);

// Add a new user or other
router.post('/', [
       check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Verificamo si el nombre no esta vacio
       check('password', 'El password es obligatorio y debe tener más de 6 carácteres').isLength({min: 6}),
       check('correo', 'El correo no es válido').isEmail(),
       check('correo').custom(validateEmail),
       // check('rol', 'No es un rol váldio').isIn(['ADMIN_ROLE', 'USER_ROLE']),
       check('rol').custom( validateRole ),
       validarCampos
],postUser); // Para definir un middleware, es el segundo argumento (si son varios se ponene como arreglo)

// Delete something
router.delete('/:id', [
       validarJWT, // Validate JWT
       // esAdminRole, // Ver si tiene rol de ADMIN solo puede ser admin
       tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
       check('id', 'No es un ID valido').isMongoId(),
       check('id').custom(existeUsuario),
       validarCampos
],deleteUser);

router.patch('/', patchUser)

module.exports = router;