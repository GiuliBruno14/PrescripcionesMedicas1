const bcrypt = require('../node_modules/bcryptjs');
const conexion = require('../db/conexion');

exports.login = (req, res) => {
    const {
        username,
        password
    } = req.body;
    const query = 'SELECT * FROM usuarios WHERE username = ?';
    conexion.query(query, [username], (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
        if (results.length === 0) {
            return res.status(401).json({
                error: 'Usuario no encontrado'
            });
        }
        // Verifica si la contraseña proporcionada coincide con el hash almacenado en la base de datos
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error al comparar contraseñas:', err);
                return res.status(500).json({
                    error: 'Error interno del servidor'
                });
            }
            if (!result) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Si el usuario es un profesional, obtener el nombre y apellido
            if (user.rol === 'profesional') {
                const profesionalQuery = 'SELECT nombre, apellido, estado FROM profesionales WHERE id = ?';
                conexion.query(profesionalQuery, [user.id_profesional], (err, profesionalResults) => {
                    if (err) {
                        console.error('Error al consultar la base de datos de profesionales:', err);
                        return res.status(500).json({
                            error: 'Error interno del servidor'
                        });
                    }
                    if (profesionalResults.length === 0) {
                        console.error('Profesional no encontrado');
                        return res.status(401).json({
                            error: 'Profesional no encontrado'
                        });
                    }
                    if (!profesionalResults[0].estado) {
                        console.error('Profesional inactivo');
                        return res.redirect('/');
                    }
                    const profesional = profesionalResults[0];
                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        rol: user.rol,
                        nombre: profesional.nombre,
                        apellido: profesional.apellido,
                        profesional: user.id_profesional
                    };
                    return res.redirect('/inicio');
                });
            } else {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    rol: user.rol
                };
                return res.redirect('/inicio');
            }
        });
    });
};

exports.register = async (req, res) => {
    const {
        username,
        password,
        rol,
        matricula
    } = req.body;
    try {
        // Hash de la contraseña antes de guardarla en la base de datos
        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
                console.error('Error al hashear la contraseña:', err);
                return res.status(500).json({
                    error: 'Error interno del servidor'
                });
            }
            let idProfesional = null;
            if (rol === "profesional") {
                idProfesional = await getIdProfesional(matricula);
            }
            await insertUser(username, hashedPassword, rol, idProfesional);
            // Si se ha creado el usuario correctamente, redirige al usuario a la página de inicio de sesión
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error al registrar el nuevo usuario:', error);
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

async function getIdProfesional(matricula) {
    const query = 'SELECT id FROM profesionales WHERE matricula = ?';
    const [result] = await new Promise((resolve, reject) => {
        conexion.query(query, [matricula], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    return result.id;
}

async function insertUser(username, hashedPassword, rol, idProfesional) {
    const query = 'INSERT INTO usuarios (username, password, rol, id_profesional) VALUES (?, ?, ?, ?)';
    await conexion.query(query, [username, hashedPassword, rol, idProfesional]);
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/inicio');
        }
        res.redirect('/');
    });
}

exports.verificarUsername = async (username) => {
    try {
        let query = 'SELECT COUNT(*) AS count FROM usuarios WHERE username = ?';
        let params = [username];
        const [result] = await new Promise((resolve, reject) => {
            conexion.query(query, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result.count === 0;
    } catch (err) {
        console.error('Error al verificar el username: ', err);
        throw err;
    }
}

exports.verificarCredenciales = async (username, password) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE username = ?';
        conexion.query(query, [username], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length === 0) {
                return resolve(false);
            }
            const user = results[0];
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
};

exports.verificarEstado = async (username) => {
    try {
        const query = 'SELECT id_profesional FROM usuarios WHERE username = ?';
        const [result] = await new Promise((resolve, reject) => {
            conexion.query(query, [username], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        if (result.id_profesional === null) {
            return true;
        } else {
            const id_profesional = result.id_profesional;
            const queryE = 'SELECT estado FROM profesionales WHERE id = ?';
            const [resultE] = await new Promise((resolve, reject) => {
                conexion.query(queryE, [id_profesional], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return resultE.estado; // Devuelve true si el estado es activo, false si el estado es inactivo
        }
    } catch (error) {
        console.error('Error al verificar el estado del profesional:', error);
        return false;
    }
}