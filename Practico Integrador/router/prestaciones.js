const express = require('express');
const router = express.Router();
const db = require('../db/conexion');
const bodyParser = require('body-parser');
const pre = require('../controladores/prestaciones/controladorPrestaciones');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(express.json());

router.get('/', pre.getPrestaciones);
router.post('/registrar', pre.registrarPrestacion);
router.get('/detalle/:id', pre.getInformacionPrestacion);
router.post('/actualizar/:id', pre.actualizarPrestacion);
router.post('/buscar', pre.buscarPrestaciones);
router.post('/verificarNombre', async (req, res) => {
    const { nombre, id } = req.body;
    try {
        const esUnico = await pre.verificarNombreUnico(nombre, id);
        res.json({ esUnico });
    } catch (error) {
        console.error('Error al verificar el nombre:', error);
        res.status(500).json({ error: 'Error al verificar el nombre' });
    }
});

module.exports = router;