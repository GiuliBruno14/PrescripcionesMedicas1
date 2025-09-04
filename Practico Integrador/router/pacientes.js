const express = require('express');
const router = express.Router();
const db = require('../db/conexion');
const bodyParser = require('body-parser');
const pac = require('../controladores/pacientes/controladorPacientes');
const obras = require('../controladores/pacientes/controladorObraSocial');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(express.json());

router.get('/', pac.getPacientes);
router.get('/planes/:id', obras.getPlanesdeObraSocial);
router.post('/registrar', pac.registrarPaciente);
router.get('/detalle/:id', pac.getInformacionPaciente);
router.post('/actualizar/:id', pac.actualizarPaciente);
router.post('/buscar', pac.buscarPacientes);
router.get("/datos/:id", pac.getDetallesPorPaciente);
router.get("/datos/:pacienteId/:obraSocialId", pac.getPlanPaciente)
router.post('/verificarDNI', async (req, res) => {
    const {
        documento,
        id
    } = req.body;
    try {
        const esUnico = await pac.verificarDNI(documento, id);
        res.json({
            esUnico
        });
    } catch (error) {
        console.error('Error al verificar el DNI:', error);
        res.status(500).json({
            error: 'Error al verificar el DNI'
        });
    }
});

module.exports = router;