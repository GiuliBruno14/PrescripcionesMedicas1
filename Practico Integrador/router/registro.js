const express = require('express');
const router = express.Router();
const authController = require('../controladores/autenticacion');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(express.json());

router.get('/', (req, res) => {
    res.render('crearUsuario', { title: 'Crear Usuario' });
});
router.post('/registrar', authController.register);
router.post('/verificarUsername', async (req, res) => {
    const {username} = req.body;
    try {
        const esUnico = await authController.verificarUsername(username);
        res.json({
            esUnico
        });
    } catch (error) {
        console.error('Error al verificar el username:', error);
        res.status(500).json({
            error: 'Error al verificar el username'
        });
    }
});

module.exports = router;