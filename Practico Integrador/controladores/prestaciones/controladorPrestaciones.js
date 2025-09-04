const conexion = require('../../db/conexion.js');
const indic = require('../prestaciones/controladorIndicaciones.js');

exports.getPrestaciones = async (req, res) => {
    try {
        const prestaciones = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM prestaciones';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        const indicaciones = await indic.getIndicaciones();
        ordenarPrestaciones(prestaciones);
        res.render('prestaciones/prestacionesIndex', {
            pageTitle: 'Prestaciones',
            prestaciones,
            indicaciones
        });
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
}

exports.registrarPrestacion = async (req, res) => {
    const {
        nombre,
        indicacion,
    } = req.body;
    try {
        // Iniciar transacción
        await conexion.beginTransaction();

        // Insertar en la tabla medicamentos
        const sqlPrestacion = `INSERT INTO prestaciones(nombre) VALUES (?)`;
        await conexion.query(sqlPrestacion, [nombre]);

        // Obtener el ID del medicamento insertado
        const prestacionId = await new Promise((resolve, reject) => {
            const sql = 'SELECT id FROM prestaciones ORDER BY id DESC LIMIT 1';
            conexion.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].id);
                }
            });
        })
        // Insertar en la tabla prestaciones-indicaciones
        if (indicacion && indicacion.length > 0) {
            const sql = `INSERT INTO prestacion_indicacion(id_prestacion, id_indicacion) VALUES ?`;
            const indiValues = indicacion.map(indi => [prestacionId, indi]);
            await conexion.query(sql, [indiValues]);
        }

        // Si todo está correcto, commit a la transacción
        await conexion.commit();

        // Redireccionar o enviar algún mensaje de éxito
        res.redirect('/prestaciones');
    } catch (error) {
        // Si hay error, rollback a la transacción
        console.error('Error al registrar el medicamento: ', error);
        await conexion.rollback();
        res.status(500).send('Error al registrar el medicamento');
    }
};

const obtenerPrestacionPorId = async (prestacionId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM prestaciones WHERE id = ?';
        conexion.query(sql, [prestacionId], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(null);
                return;
            }
            const prestacion = result[0];
            resolve(prestacion);
        })
    })
}

exports.getInformacionPrestacion = async (req, res) => {
    try {
        const prestacionId = req.params.id;
        const prestacion = await obtenerPrestacionPorId(prestacionId);

        if (!prestacion) {
            return res.status(404).send('Prestacion no encontrado');
        }

        // Obtener los IDs de indicaciones relacionadas con el medicamento
        const indicacionesRelation = await indic.getIndicacionesPorId(prestacionId);
        const indicacionesId = indicacionesRelation.map(rel => rel.id_indicacion);
        const indicaciones = await indic.getIndicaciones();

        res.render('prestaciones/detallesPrestacion', {
            pageTitle: 'Detalles Prestacion',
            prestacion,
            indicacionesId,
            indicaciones
        });

    } catch (error) {
        console.error('Error al obtener la prestacion:', error);
        res.status(500).send('Error al obtener la prestacion');
    }
}

exports.actualizarPrestacion = async (req, res) => {
    const prestacionId = req.params.id;
    const {
        nombre,
        indicacion,
    } = req.body;
    try {
        // Iniciar transacción
        await conexion.beginTransaction();

        const prestacion = await obtenerPrestacionPorId(prestacionId);
        if (!prestacion) {
            return res.status(404).send('Prestacion no encontrada');
        }

        const sqlPrestacion = `UPDATE prestaciones SET nombre = ? WHERE id = ?`;
        await conexion.query(sqlPrestacion, [nombre, prestacionId]);

        // Insertar nuevas asociaciones solo si hay Indicaciones seleccionadas
        if (indicacion && indicacion.length > 0 && indicacion[0] !== 'null') {
            const sql = `INSERT INTO prestacion_indicacion(id_prestacion, id_indicacion) VALUES ?`;
            const indiValues = indicacion.map(indi => [prestacionId, indi]);
            await conexion.query(sql, [indiValues]);
        }

        // Si todo está correcto, commit a la transacción
        await conexion.commit();

        // Redireccionar o enviar algún mensaje de éxito
        res.redirect('/prestaciones');
    } catch (error) {
        // Si hay error, rollback a la transacción
        console.error('Error al actualizar la prestacion: ', error);
        await conexion.rollback();
        res.status(500).send('Error al actualizar la prestacion');
    }
}

exports.buscarPrestaciones = async (req, res) => {
    const searchTerm = req.body.searchTerm || req.query.searchTerm || '';
    try {
        const prestaciones = await new Promise((resolve, reject) => {
            const query = `
                SELECT
                    p.nombre,
                    GROUP_CONCAT(DISTINCT i.indicacion ORDER BY i.indicacion SEPARATOR ', ') AS indicaciones
                FROM
                    prestaciones p
                LEFT JOIN
                    prestacion_indicacion pi ON p.id = pi.id_prestacion
                LEFT JOIN
                    indicacion i ON pi.id_indicacion = i.id
                WHERE
                    p.nombre LIKE ?
                    OR i.indicacion LIKE ?
                GROUP BY
                    p.nombre;
            `;
            const searchValue = `%${searchTerm}%`;
            const values = [searchValue, searchValue];

            conexion.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarPrestaciones(prestaciones);
        res.json(prestaciones);
    } catch (err) {
        console.error('Error al buscar prestaciones: ', err);
        res.status(500).json({
            error: 'Error al buscar prestaciones'
        });
    }
}

const ordenarPrestaciones = (prestaciones) => {
    prestaciones.sort((a, b) => {
        if (a.nombre < b.nombre) {
            return -1;
        }
        if (a.nombre > b.nombre) {
            return 1;
        }
        return 0;
    });
}

exports.getPrestacionesLista = async () => {
    try {
        const prestaciones = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM prestaciones;';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarPrestaciones(prestaciones);
        return prestaciones;
    } catch (err) {
        console.error('Error al obtener las prestaciones: ', err);
        return [];
    }
}

exports.getDetallesPorPrestacion = async (req, res) => {
    const prestacionId = req.params.id;
    try {
        const detalles = await new Promise((resolve, reject) => {
            const query = `
                SELECT
                GROUP_CONCAT(DISTINCT CONCAT(i.id, '-', i.indicacion) ORDER BY i.indicacion SEPARATOR ', ') AS indicaciones
            FROM
                prestaciones p
            LEFT JOIN
                prestacion_indicacion pi ON p.id = pi.id_prestacion
            LEFT JOIN
                indicacion i ON pi.id_indicacion = i.id
            WHERE
                p.id = ?;
            `;

            conexion.query(query, [prestacionId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]);
            });
        });

        if (!detalles) {
            return res.status(404).json({
                message: 'Detalles de la prestación no encontrados',
                indicaciones: ''
            });
        }

        res.json({
            indicaciones: detalles.indicaciones || ''
        });
    } catch (err) {
        console.error('Error al obtener los detalles de la prestación', err);
        res.status(500).send({
            message: 'Error al obtener los detalles de la prestación',
            indicaciones: ''
        });
    }
};

exports.obtenerDatosPrestacion = async (idPrescripcion) => {
    try {
        // Consulta SQL para obtener los IDs de los datos de las prestaciones asociadas a la prescripción
        const query = 'SELECT id_datosprestacion, lado, justificacion FROM prescripcion_prestacion WHERE id_prescripcion = ?';
        
        // Ejecutar la consulta SQL con el ID de la prescripción
        const datos = await new Promise((resolve, reject) => {
            conexion.query(query, [idPrescripcion], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        const prestaciones = [];
        for (let dato of datos) {
            // Obtener los IDs de las prestaciones usando el ID de los datos de prestación
            const prestacionesindicaciones = await new Promise((resolve, reject) => {
                const queryPrestacion = 'SELECT id_prestacion, id_indicacion FROM prestacion_indicacion WHERE id = ?';
                conexion.query(queryPrestacion, [dato.id_datosprestacion], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                });
            });
            const indicacion = await indic.getIndicacionPorId(prestacionesindicaciones.id_indicacion);
            const prestacion = await obtenerPrestacionPorId(prestacionesindicaciones.id_prestacion);
            prestacion.indicacion = indicacion;
            prestacion.lado = dato.lado;
            prestacion.justificacion = dato.justificacion;
            prestaciones.push(prestacion);
        }
        return prestaciones;
    } catch (err) {
        console.log('Error al obtener los IDs de las prestaciones', err);
        throw err;
    }
}

exports.verificarNombreUnico = async (nombre, id) => {
    try {
        let query = 'SELECT COUNT(*) AS count FROM prestaciones WHERE nombre = ?';
        let params = [nombre];
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
        console.error('Error al verificar el nombre: ', err);
        throw err;
    }
}