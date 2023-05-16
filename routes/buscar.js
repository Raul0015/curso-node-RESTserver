const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

// Usualmente las busquedas son peticiones GET, pero pueden ser PUT, DELETE, POST
router.get('/:coleccion/:termino', buscar) // Va a recibir la coleccion a buscar y el termino de busqueda


module.exports = router;