const express = require('express');
const router = express.Router();
const db = require('../db/conexion'); 
const bodyParser = require('body-parser');
const prof = require('../controladores/profesionales/controladorProfesionales');
const profesiones = require('../controladores/profesionales/controladorProfesiones');
const fs = require('fs');
const path = require('path');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(express.json());
const idrefepsFilePath = path.join(__dirname, '/../public/archivos/idrefeps.json');

let validIdrefeps;
try {
    const data = fs.readFileSync(idrefepsFilePath, 'utf8');
    validIdrefeps = JSON.parse(data).idrefeps;
} catch (err) {
    console.error('Error leyendo el archivo idrefeps:', err);
}

router.get('/', prof.getProfesionales);
router.get('/especialidades/:id', profesiones.getEspecialidadProfesion);
router.post('/registrar', prof.registrarProfesional);
router.get('/detalle/:id', prof.getInformacionProfesional);
router.post('/actualizar/:id', prof.actualizarProfesional);
router.post('/buscar', prof.buscarProfesionales);
router.post('/verificarDNI', async (req, res) => {
    const {
        documento,
        id
    } = req.body;
    try {
        const esUnico = await prof.verificarDNI(documento, id);
        res.json({
            esUnico
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al verificar el DNI'
        });
    }
});
router.post('/verificarMatricula', async (req, res) => {
    const {
        matricula,
        id
    } = req.body;
    try {
        const esUnica = await prof.verificarMatricula(matricula, id);
        res.json({
            esUnica
        });
    } catch (error) {
        console.error('Error al verificar la Matricula:', error);
        res.status(500).json({
            error: 'Error al verificar la Matricula'
        });
    }
});
router.post('/verificarIdRefeps', (req, res) => {
    const { idRefeps } = req.body;
    const esValido = validIdrefeps.includes(idRefeps.trim());
    res.json({ esValido });
});
router.post('/verificarIdRefepsUnico', async (req, res) => {
    const { idRefeps, id } = req.body;
    try {
        const esUnico = await prof.verificarIdRefepsUnico(idRefeps, id);
        res.json({
            esUnico
        });
    } catch (error) {
        console.error('Error al verificar el ID Refeps:', error);
        res.status(500).json({
            error: 'Error al verificar el ID Refeps'
        });
    }
});
router.post('/validarMatricula', async (req, res) => {
    const { matricula } = req.body;
    try {
        const esValida = await prof.validarMatricula(matricula);
        res.json({
            esValida
        });
    } catch (error) {
        console.error('Error al validar la Matricula:', error);
        res.status(500).json({
            error: 'Error al validar la Matricula'
        });
    }
});
router.post('/verificarMatriculaUsada', async (req, res) => {
    const { matricula } = req.body;
    try {
        const esUsada = await prof.verificarMatriculaUsada(matricula);
        res.json({
            esUsada
        });
    } catch (error) {
        console.error('Error al verificar la Matricula:', error);
        res.status(500).json({
            error: 'Error al verificar la Matricula'
        });
    }
});

module.exports = router;