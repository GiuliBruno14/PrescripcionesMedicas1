const express = require('express');
const router = express.Router();
const db = require('../db/conexion'); 
const bodyParser = require('body-parser');
const pres = require('../controladores/prescripciones/controladorPrescripciones');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(express.json());

router.get('/', pres.getPrescripciones);
router.post('/registrar', pres.registrarPrescripciones);
router.get('/verprescripciones', pres.obtenerTodasPrescripciones);
router.get('/:id', pres.getInformacionPrescripcion);
router.post('/actualizar/:id', pres.actualizarPrescripcion);
router.get('/detalle/:id', pres.datosCompletos);

module.exports = router;