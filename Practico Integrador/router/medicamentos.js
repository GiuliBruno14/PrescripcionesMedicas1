const express = require('express');
const router = express.Router();
const db = require('../db/conexion');
const bodyParser = require('body-parser');
const med = require('../controladores/medicamentos/controladorMedicamentos');
const {authorize} = require('../middlewares/auth');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(express.json());

router.get('/', med.getMedicamentos);

router.post('/registrar', med.registrarMedicamento);
router.get('/detalle/:id', med.getInformacionMedicamento);
router.post('/actualizar/:id', med.actualizarMedicamento);
router.post('/buscar', med.buscarMedicamentos);
router.get('/buscar', med.buscarMedicamentos);
router.post('/verificarNombreGenerico', async (req, res) => {
    const { nombreGenerico, id } = req.body;
    try {
        const esUnico = await med.verificarNombreGenericoUnico(nombreGenerico, id);
        res.json({ esUnico });
    } catch (error) {
        console.error('Error al verificar el nombre genérico:', error);
        res.status(500).json({ error: 'Error al verificar el nombre genérico' });
    }
});

module.exports = router;