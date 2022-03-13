/*
    Buscar
    ruta: /api/todo/:busqueda
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');

const router = Router();


router.post('/:busqueda', validarJWT, getTodo);
router.post('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);


module.exports = router;