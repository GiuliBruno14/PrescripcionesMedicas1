const conexion = require('../../db/conexion.js');
const prof = require('../profesionales/controladorProfesiones.js');

exports.getProfesionales = async (req, res) => {
    try {
        const profesionales = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM profesionales';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarProfesionales(profesionales);
        const profesiones = await prof.getProfesiones();
        const especialidades = await prof.getEspecialidades();
        res.render('profesionales/profesionalesIndex', {
            pageTitle: 'Profesionales',
            profesionales,
            profesiones,
            especialidades
        });
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
};

const ordenarProfesionales = (profesionales) => {
    profesionales.sort((a, b) => {
        if (a.nombre < b.nombre) {
            return -1;
        }
        if (a.nombre > b.nombre) {
            return 1;
        }
        return 0;
    });
}

exports.registrarProfesional = async (req, res) => {
    const {
        nombre,
        apellido,
        documento,
        profesion,
        especialidad,
        domicilio,
        matricula,
        idRefeps,
        fechaCaducidad
    } = req.body;
    try {
        await conexion.beginTransaction();

        const sqlPaciente = `INSERT INTO profesionales (nombre, apellido, documento, profesion, especialidad, domicilio, matricula, id_refeps, fecha_caducidad, estado) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)`;
        await conexion.query(sqlPaciente, [nombre, apellido, documento, profesion, especialidad, domicilio, matricula, idRefeps, fechaCaducidad, 1]);
        // Si todo está correcto, commit a la transacción
        await conexion.commit();

        // Redireccionar o enviar algún mensaje de éxito
        res.redirect('/registro');
    } catch (error) {
        // Si hay un error, rollback a la transacción
        await conexion.rollback();
        console.error('Error al registrar el profesional: ', error);
        res.status(500).send('Error al registrar el profesional');
    }
}
const obtenerProfesionalPorId = async (id) => {
    try {
        const [profesional] = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM profesionales WHERE id = ?';
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return profesional;
    } catch (error) {
        console.error('Error al obtener el profesional:', error);
        return null;
    }
}

exports.getInformacionProfesional = async (req, res) => {
    const id = req.params.id;
    try {
        const profesional = await obtenerProfesionalPorId(id);
        if (!profesional) {
            return res.status(404).send('Profesional no encontrado');
        }
        const profesiones = await prof.getProfesiones();
        const especialidades = await prof.getEspecialidades();
        res.render('profesionales/detalleProfesional', {
            pageTitle: profesional ? `${profesional.nombre} ${profesional.apellido}` : 'Profesional no encontrado',
            profesional,
            profesiones,
            especialidades
        });
    } catch (error) {
        console.error('Error al obtener el profesional:', error);
        res.status(500).send('Error al obtener el profesional');
    }
}

exports.actualizarProfesional = async (req, res) => {
    const id = req.params.id;
    const {
        nombre,
        apellido,
        documento,
        profesion,
        especialidad,
        domicilio,
        matricula,
        idRefeps,
        fechaCaducidad
    } = req.body;
    try {
        console.log(id);
        // Iniciar transacción
        await conexion.beginTransaction();
        const profesional = await obtenerProfesionalPorId(id);
        if (!profesional) {
            return res.status(404).send('Profesional no encontrado');
        }
        const estadoCheckboxPresente = "estado" in req.body;
        const estadoFinal = estadoCheckboxPresente ? 1 : 0;

        const sqlProfesional = `UPDATE profesionales SET nombre = ?, apellido = ?, documento = ?, profesion = ?, especialidad = ?, domicilio = ?, matricula = ?, id_refeps = ?, fecha_caducidad = ?, estado =? WHERE id = ?`;
        await conexion.query(sqlProfesional, [nombre, apellido, documento, profesion, especialidad, domicilio, matricula, idRefeps, fechaCaducidad, estadoFinal, id]);
        // Si todo está correcto, commit a la transacción
        await conexion.commit();

        // Redireccionar o enviar：
        res.redirect('/profesionales');
    } catch (error) {
        // Si hay un error, rollback a la transacción
        await conexion.rollback();
        console.error('Error al actualizar el profesional: ', error);
        res.status(500).send('Error al actualizar el profesional');
    }
}

exports.buscarProfesionales = async (req, res) => {
    const searchTerm = req.body.searchTerm;
    try {
        const profesionales = await new Promise((resolve, reject) => {
            const query = `
            SELECT
                p.*,
                prof.nombre AS nombre_profesion,
                esp.nombre AS nombre_especialidad
            FROM
                profesionales p
            LEFT JOIN profesiones prof ON p.profesion = prof.id
            LEFT JOIN especialidades esp ON p.especialidad = esp.id
            WHERE
                p.nombre LIKE ? OR
                p.apellido LIKE ? OR
                p.documento LIKE ? OR
                p.matricula LIKE ? OR
                p.id_refeps LIKE ? OR
                prof.nombre LIKE ? OR
                esp.nombre LIKE ? OR CONCAT(p.nombre, ' ', p.apellido) LIKE ? OR CONCAT(p.apellido, ' ', p.nombre) LIKE ?
            `;
            const searchValue = `%${searchTerm}%`;
            conexion.query(query, [searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarProfesionales(profesionales);
        res.json(profesionales); // Devuelve los pacientes en formato JSON
    } catch (err) {
        console.error('Error al buscar profesionales: ', err);
        res.status(500).json({
            error: 'Error al buscar profesionales'
        });
    }
};

exports.getProfesionalesLista = async (req, res) => {
    try {
        const profesionales = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM profesionales WHERE estado = 1';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarProfesionales(profesionales);
        return profesionales;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
};

exports.obtenerDatosProfesional = async (id) => {
    try {
        const profesional = await obtenerProfesionalPorId(id);
        if (!profesional) {
            return res.status(404).send('Profesional no encontrado');
        }
        const profesion = await prof.getProfesionPorId(profesional.profesion);
        const especialidad = await prof.getEspecialidadPorId(profesional.especialidad);
        profesional.profesion = profesion;
        profesional.especialidad = especialidad;
        return profesional;
    } catch (error) {
        console.error('Error al obtener el profesional:', error);
        throw error;
    }
}

exports.verificarDNI = async (documento, id) => {
    try {
        let query = 'SELECT COUNT(*) AS count FROM profesionales WHERE documento = ?';
        let params = [documento];
        if (id !== null && id !== undefined) { // Asegura que id no sea null ni undefined
            query += ' AND id != ?'; // Excluye el id actual para permitir actualizaciones
            params.push(id);
        }
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
        console.error('Error al verificar el documento: ', err);
        throw err;
    }
};

exports.verificarMatricula = async (matricula, id) => {
    try {
        let query = 'SELECT COUNT(*) AS count FROM profesionales WHERE matricula = ?';
        let params = [matricula];
        if (id !== null && id !== undefined) { // Asegura que id no sea null ni undefined
            query += ' AND id != ?'; // Excluye el id actual para permitir actualizaciones
            params.push(id);
        }
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
        console.error('Error al verificar la matricula: ', err);
        throw err;
    }
};

exports.verificarIdRefepsUnico = async (idRefeps, id) => {
    try {
        let query = 'SELECT COUNT(*) AS count FROM profesionales WHERE id_Refeps = ?';
        let params = [idRefeps];
        if (id !== null && id !== undefined) { // Asegura que id no sea null ni undefined
            query += ' AND id != ?'; // Excluye el id actual para permitir actualizaciones
            params.push(id);
        }
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
        console.error('Error al verificar el idRefeps: ', err);
        throw err;
    }
}

exports.validarMatricula = async (matricula) => {
    try {
        let query = 'SELECT COUNT(*) AS count FROM profesionales WHERE matricula = ?';
        const [result] = await new Promise((resolve, reject) => {
            conexion.query(query, [matricula], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result.count === 0;
    } catch (err) {
        console.error('Error al validar la matricula: ', err);
        throw err;
    }
}

exports.verificarMatriculaUsada = async (matricula) => {
    try {
        // Primero, obtenemos el id_profesional usando la matrícula
        const queryProfesional = 'SELECT id FROM profesionales WHERE matricula = ?';
        const [resultProfesional] = await new Promise((resolve, reject) => {
            conexion.query(queryProfesional, [matricula], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        const idProfesional = resultProfesional.id;
        // Luego, verificamos si ese id ya está en la tabla usuarios
        const queryUsuario = 'SELECT EXISTS(SELECT 1 FROM usuarios WHERE id_profesional = ?) AS esUnico';
        const [resultUsuario] = await new Promise((resolve, reject) => {
            conexion.query(queryUsuario, [idProfesional], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        // Devuelve true si no existe, false si ya existe
        return resultUsuario.esUnico === 0;
    } catch (error) {
        console.error('Error al verificar la matrícula:', error);
        return false;
    }
};