const express = require('express');
const router = express.Router();
const authController = require('../controladores/autenticacion');
const bodyParser = require('body-parser');
const {
    verificarSesion
} = require('../middlewares/auth');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(express.json());

router.get('/', verificarSesion, (req, res) => {
    res.render('login', {
        title: 'Iniciar Sesión'
    });
});
router.post('/', authController.login);
router.get('/logout', authController.logout);
router.post('/verificarCredenciales', async (req, res) => {
    const {
        username,
        password
    } = req.body;
    try {
        const esValido = await authController.verificarCredenciales(username, password);
        res.json({
            esValido
        });
    } catch (error) {
        console.error('Error al verificar las credenciales:', error);
        res.status(500).json({
            error: 'Error al verificar las credenciales'
        });
    }
});

router.post('/verificarEstado', async (req, res) => {
    const {
        username
    } = req.body;
    try {
        const esValido = await authController.verificarEstado(username);
        res.json({
            esValido
        });
    } catch (error) {
        console.error('Error al verificar el estado:', error);
        res.status(500).json({
            error: 'Error al verificar el estado'
        });
    }
});

module.exports = router;