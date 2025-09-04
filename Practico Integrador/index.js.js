const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const indexRouter = require('./router/index.js');
const loginRouter = require('./router/login.js');
const registroRouter = require('./router/registro.js');
const medicamentosRouter = require('./router/medicamentos');
const pacientesRouter = require('./router/pacientes');
const profesionalesRouter = require('./router/profesionales');
const prestacionesRouter = require('./router/prestaciones');
const prescripcionesRouter = require('./router/prescripciones');
const datosRouter = require('./router/datos');
const {
    authorize,
    restrictRoutesToAdmin,
    restrictRoutesToProfessionals
} = require('./middlewares/auth.js');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.userRole = req.session.user.rol;
        res.locals.username = req.session.user.username;
        if (req.session.user.rol === 'profesional') {
            res.locals.nombre = req.session.user.nombre;
            res.locals.apellido = req.session.user.apellido;
            res.locals.idProfesional = req.session.user.profesional;
        }
    } else {
        res.locals.userRole = null;
        res.locals.username = null;
    }
    next();
});

app.use('/',loginRouter);
app.use('/registro', authorize(['admin']), restrictRoutesToProfessionals, registroRouter);
app.use('/inicio', authorize(['admin', 'profesional']), indexRouter);
app.use('/prescripciones', authorize(['profesional']), restrictRoutesToAdmin, prescripcionesRouter);
app.use('/medicamentos', authorize(['admin']), restrictRoutesToProfessionals, medicamentosRouter);
app.use('/pacientes', authorize(['admin', 'profesional']), pacientesRouter);
app.use('/profesionales', authorize(['admin']), restrictRoutesToProfessionals, profesionalesRouter);
app.use('/prestaciones', authorize(['admin']), restrictRoutesToProfessionals, prestacionesRouter);
app.use ('/datos', authorize(['admin', 'profesional']), datosRouter);

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});