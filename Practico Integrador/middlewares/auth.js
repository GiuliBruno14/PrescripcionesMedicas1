function authorize(roles) {
    return function (req, res, next) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        const userRole = req.session.user.rol;

        if (roles.includes(userRole)) {
            next();
        } else {
            return res.status(403).send('Acceso denegado');
        }
    };
}

function restrictRoutesToAdmin(req, res, next) {
    if (req.session.user.rol === 'admin') {
        return res.status(403).send('Acceso denegado a las prescripciones para administradores');
    }

    next();
}

function restrictRoutesToProfessionals(req, res, next) {
    if (req.session.user.rol == 'profesional') {
        return res.status(403).send('Acceso denegado. Esta ruta solo es accesible para profesionales.');
    }

    next();
}

function verificarSesion(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect('/inicio');
    }
    next();
}

module.exports = {
    authorize,
    restrictRoutesToAdmin,
    restrictRoutesToProfessionals,  
    verificarSesion
};