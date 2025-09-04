const conexion = require('../../db/conexion.js');
const obras = require('../pacientes/controladorObraSocial.js');

exports.getPacientes = async (req, res) => {
    try {
        const pacientes = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM pacientes';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarPacientes(pacientes);
        const obrasSociales = await obras.getObrasSociales();
        const planes = await obras.getPlanes();
        res.render('pacientes/pacientesIndex', {
            pageTitle: 'Pacientes',
            pacientes,
            obrasSociales,
            planes
        });
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
};

exports.registrarPaciente = async (req, res) => {
    const {
        nombre,
        apellido,
        documento,
        fechaNacimiento,
        genero,
        obrasocial,
        plan
    } = req.body;
    try {
        await conexion.beginTransaction();

        // Insertar en la tabla Pacientes
        const sqlPaciente = `INSERT INTO pacientes (nombre, apellido, documento, fecha_nacimiento, sexo, estado) VALUES (?, ?, ?, ?, ?, ?)`;
        await conexion.query(sqlPaciente, [nombre, apellido, documento, fechaNacimiento, genero, 1]);

        // Obtener el ID del paciente recién insertado
        const idPaciente = await new Promise((resolve, reject) => {
            const query = 'SELECT id FROM pacientes ORDER BY id DESC LIMIT 1';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].id);
                }
            });
        });

        // Insertar en la tabla Pacientes-Obrasocial si se seleccionó alguna obra social
        if (obrasocial && Array.isArray(obrasocial) && obrasocial.length > 0 && obrasocial[0] !== 'null') {
            const sqlPacienteObraSocial = `INSERT INTO paciente_obrasocial (id_paciente, id_obrasocial, plan, estado) VALUES (?, ?, ?, ?)`;

            for (let i = 0; i < obrasocial.length; i++) {
                const idObraSocial = obrasocial[i];
                const planSeleccionado = plan[i]; // Obtener el plan correspondiente al índice actual

                await conexion.query(sqlPacienteObraSocial, [idPaciente, idObraSocial, planSeleccionado, 1]);
            }
        }

        // Si todo está correcto, commit a la transacción
        await conexion.commit();

        // Redireccionar o enviar algún mensaje de éxito
        res.redirect('/pacientes');
    } catch (error) {
        // Si hay un error, rollback a la transacción
        await conexion.rollback();
        console.error('Error al registrar el paciente: ', error);
        res.status(500).send('Error al registrar el paciente');
    }
};

exports.actualizarPaciente = async (req, res) => {
    const id = req.params.id;
    const {
        nombre,
        apellido,
        documento,
        fechaNacimiento,
        genero,
        obrasocial,
        plan
    } = req.body;

    try {
        console.log('ID del paciente:', id);
        console.log('Datos recibidos:', {
            nombre,
            apellido,
            documento,
            fechaNacimiento,
            genero,
            obrasocial,
            plan
        });

        // Iniciar transacción
        await conexion.beginTransaction();

        const paciente = await obtenerPacientePorId(id);
        if (!paciente) {
            await conexion.rollback();
            return res.status(404).send('Paciente no encontrado');
        }

        const estadoCheckboxPresente = "estado" in req.body;
        const estadoFinal = estadoCheckboxPresente ? 1 : 0;

        // Actualizar la tabla Pacientes
        const sqlPaciente = `UPDATE pacientes SET nombre = ?, apellido = ?, documento = ?, fecha_nacimiento = ?, sexo = ?, estado = ? WHERE id = ?`;
        await conexion.query(sqlPaciente, [nombre, apellido, documento, fechaNacimiento, genero, estadoFinal, paciente.id]);
        console.log('Paciente actualizado:', {
            id: paciente.id,
            nombre,
            apellido,
            documento,
            fechaNacimiento,
            genero,
            estadoFinal
        });

        // Primero desactivamos las asociaciones existentes para este paciente
        const sqlDeletePacienteObraSocial = `UPDATE paciente_obrasocial SET estado = 0 WHERE id_paciente = ?`;
        await conexion.query(sqlDeletePacienteObraSocial, [paciente.id]);
    
        if (obrasocial && obrasocial.length > 0 && obrasocial[0] !== 'null') {
            const sqlConsultaAsociacion = `SELECT COUNT(*) AS count FROM paciente_obrasocial WHERE id_paciente = ? AND id_obrasocial = ?`;
            const sqlInsert = `INSERT INTO paciente_obrasocial (id_paciente, id_obrasocial, plan, estado) VALUES (?, ?, ?, 1)`;
            const sqlUpdate = `UPDATE paciente_obrasocial SET plan = ?, estado = 1 WHERE id_paciente = ? AND id_obrasocial = ?`;

            for (let i = 0; i < obrasocial.length; i++) {
                const planObraSocial = plan[i];
                const idObraSocial = await obras.getObraSocialPorPlan(planObraSocial);
                let params = [paciente.id, idObraSocial];

                const [result] = await new Promise((resolve, reject) => {
                    conexion.query(sqlConsultaAsociacion, params, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
                const count = result.count; // Ajuste para obtener el conteo correctamente

                if (count === 0) {
                    // No existe la asociación, insertar nueva fila
                    await conexion.query(sqlInsert, [paciente.id, idObraSocial, planObraSocial]);
                } else {
                    // Existe la asociación, activarla nuevamente
                    await conexion.query(sqlUpdate, [planObraSocial, paciente.id, idObraSocial]);
                }
            }
        }

        // Si todo está correcto, commit a la transacción
        await conexion.commit();

        // Redireccionar o enviar respuesta
        res.redirect('/pacientes');
    } catch (error) {
        // Si hay un error, rollback a la transacción
        await conexion.rollback();
        console.error('Error al actualizar el paciente: ', error);
        res.status(500).send('Error al actualizar el paciente');
    }
}
const obtenerPacientePorId = async (pacienteId) => {
    try {
        const [paciente] = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM pacientes WHERE id = ?';
            conexion.query(query, [pacienteId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return paciente;
    } catch (error) {
        console.error('Error al obtener el paciente:', error);
        return null;
    }
}

exports.getInformacionPaciente = async (req, res) => {
    const id = req.params.id;
    try {
        const paciente = await obtenerPacientePorId(id);
        if (!paciente) {
            return res.status(404).send('Paciente no encontrado');
        }
        const pacienteObraS = await obras.getPacienteObraSocial(id); // Obtener las obras sociales del paciente activas
        const pacientePid = []; // Array para almacenar los planes del paciente

        if (pacienteObraS.length > 0) {
            for (let i = 0; i < pacienteObraS.length; i++) {
                const pacientePlan = await obras.getPacientePlan(id, pacienteObraS[i].id_obrasocial);
                pacientePid.push(...pacientePlan.map(rel => rel.plan));
            }
        }

        const pacienteOSid = pacienteObraS.map(rel => rel.id_obrasocial); // Obtener los IDs de las obras sociales del paciente
        const obrasSociales = await obras.getObrasSociales();
        const planes = await obras.getPlanes();

        res.render('pacientes/detallePaciente', {
            pageTitle: paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente no encontrado',
            paciente,
            pacienteOSid,
            pacientePid,
            obrasSociales,
            planes
        });
    } catch (error) {
        console.error('Error al obtener el paciente:', error);
        res.status(500).send('Error al obtener el paciente');
    }
};

const ordenarPacientes = (pacientes) => {
    pacientes.sort((a, b) => {
        if (a.nombre < b.nombre) {
            return -1;
        }
        if (a.nombre > b.nombre) {
            return 1;
        }
        return 0;
    });
}

exports.buscarPacientes = async (req, res) => {
    const searchTerm = req.body.searchTerm;
    try {
        const pacientes = await new Promise((resolve, reject) => {
            const query = `
            SELECT
                p.id,
                p.nombre,
                p.apellido,
                p.documento,
                p.fecha_nacimiento,
                p.sexo,
                p.estado,
                GROUP_CONCAT(os.nombre SEPARATOR ', ') AS obras_sociales
            FROM
                pacientes p
            LEFT JOIN paciente_obrasocial pos ON
                p.id = pos.id_paciente
            LEFT JOIN obra_social os ON
                pos.id_obrasocial = os.id
            WHERE
                p.apellido LIKE ? OR p.documento LIKE ? OR p.nombre LIKE ? OR os.nombre LIKE ? OR CONCAT(p.nombre, ' ', p.apellido) LIKE ? OR CONCAT(p.apellido, ' ', p.nombre) LIKE ?
            GROUP BY
                p.id, p.nombre, p.apellido, p.documento, p.fecha_nacimiento, p.sexo, p.estado
            `;
            const searchValue = `%${searchTerm}%`;
            conexion.query(query, [searchValue, searchValue, searchValue, searchValue, searchValue, searchValue], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarPacientes(pacientes);
        res.json(pacientes); // Devuelve los pacientes en formato JSON
    } catch (err) {
        console.error('Error al buscar pacientes: ', err);
        res.status(500).json({
            error: 'Error al buscar pacientes'
        });
    }
};

exports.verificarDNI = async (documento, id) => {
    try {
        let query = 'SELECT COUNT(*) AS count FROM pacientes WHERE documento = ?';
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

exports.getPacientesLista = async (req, res) => {
    try {
        const pacientes = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM pacientes WHERE estado = 1';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarPacientes(pacientes);
        return pacientes;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
};

exports.getDetallesPorPaciente = async (req, res) => {
    const pacienteId = req.params.id;
    try {
        const obrasSociales = await new Promise((resolve, reject) => {
            const query = `SELECT 
            os.id AS id, 
            os.nombre AS nombre
        FROM 
            paciente_obrasocial pos
        JOIN 
            obra_social os ON pos.id_obrasocial = os.id
        WHERE 
            pos.id_paciente = ? AND pos.estado = 1;
        `;
            const params = [pacienteId];
            conexion.query(query, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.json(obrasSociales);
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
}

exports.getPlanPaciente = async (req, res) => {
    const pacienteId = req.params.pacienteId;
    const obraSocialId = req.params.obraSocialId;
    console.log(pacienteId, obraSocialId);
    try {
        const planes = await new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    p.id AS id, 
                    p.nombre AS nombre
                FROM 
                    paciente_obrasocial pos
                JOIN 
                    plan p ON pos.plan = p.id
                WHERE 
                    pos.id_paciente = ? AND pos.id_obrasocial = ?;
            `;
            const params = [pacienteId, obraSocialId];
            conexion.query(query, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.json(planes);
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
        throw err;
    }
}

exports.obtenerObraSocialElegida = async (idPaciente, IdObraSocial) => {
    try {
        const result = await new Promise((resolve, reject) => {
            const query = 'SELECT id FROM paciente_obrasocial WHERE id_paciente = ? AND id_obrasocial = ?';
            const params = [idPaciente, IdObraSocial];
            conexion.query(query, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        console.log("result: ", result[0].id);
        return result[0].id;
    } catch (err) {
        console.error('Error al obtener los datos: ', err);
        throw err; // Lanza el error para que se maneje en el controlador
    }
}

exports.obtenerDatosPaciente = async (id) => {
    try {
        const datos = 'SELECT id_paciente, id_obrasocial, plan FROM paciente_obrasocial WHERE id = ?';
        const resultadoConsulta = await new Promise((resolve, reject) => {
            conexion.query(datos, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        if (resultadoConsulta.length === 0) {
            throw new Error('No se encontraron datos para el paciente con el ID proporcionado');
        }
        const pacienteId = resultadoConsulta[0].id_paciente;
        const obraSocialId = resultadoConsulta[0].id_obrasocial;
        const planId = resultadoConsulta[0].plan;

        const paciente = await obtenerPacientePorId(pacienteId);
        const obraSocial = await obras.getObraSocialPorId(obraSocialId);
        const plan = await obras.getPlanPorId(planId);
        paciente.obraSocial = obraSocial;
        paciente.plan = plan;
        return paciente;
    } catch (error) {
        console.error('Error al obtener los datos del paciente: ', error);
        throw error;
    }
}