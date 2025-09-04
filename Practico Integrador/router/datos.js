const express = require('express');
const router = express.Router();
const db = require('../db/conexion');
const bodyParser = require('body-parser');
const med = require('../controladores/medicamentos/controladorMedicamentos');
const pre = require('../controladores/prestaciones/controladorPrestaciones');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(express.json());

router.get('/medicamento/:id',med.getDetallesPorMedicamento);
router.get('/prestacion/:id', pre.getDetallesPorPrestacion);

module.exports = router;