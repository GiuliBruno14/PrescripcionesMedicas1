const conexion = require('../../db/conexion.js');
const prof = require('../profesionales/controladorProfesionales.js');
const pac = require('../pacientes/controladorPacientes.js');
const med = require('../medicamentos/controladorMedicamentos.js');
const pres = require('../prestaciones/controladorPrestaciones.js');

exports.getPrescripciones = async (req, res) => {
    try {
        const profesionales = await prof.getProfesionalesLista();
        const pacientes = await pac.getPacientesLista();
        const medicamentos = await med.getMedicamentosLista();
        const prestaciones = await pres.getPrestacionesLista();

        const prescripciones = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM prescripciones';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.render('prescripciones/prescripcionesIndex', {
            pageTitle: 'Prescripcion',
            prescripciones,
            profesionales,
            pacientes,
            medicamentos,
            prestaciones
        });
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
};

exports.registrarPrescripciones = async (req, res) => {
    const {
        paciente,
        obraSocial,
        diagnostico,
        fechaPrescripcion,
        vigencia,
        medicamentos,
        prestaciones
    } = req.body;

    try {
        await conexion.beginTransaction();
        let idProfesional = req.session.user.profesional;
        paciente_datos = await pac.obtenerObraSocialElegida(paciente, obraSocial);
        const sqlPrescripcion = `INSERT INTO prescripciones(id_profesional, paciente_datos, diagnostico, fechaPrescripcion, vigencia) VALUES (?, ?, ?, ?, ?)`
        await conexion.query(sqlPrescripcion, [idProfesional, paciente_datos, diagnostico, fechaPrescripcion, vigencia]);

        //obtener el ID de la prescripcion
        const idPrescripcion = await new Promise((resolve, reject) => {
            const query = 'SELECT id FROM prescripciones ORDER BY id DESC LIMIT 1';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].id);
                }
            });
        });

        // Insertar en la tabla Prescripciones-Medicamentos
        if (!medicamentos) {
            console.log("No hay medicamentos");
        } else {
            const sqlMedicamento = `INSERT INTO prescripcion_medicamento(id_prescripcion, id_medicamento, id_concentracion,id_formaf, id_presentacion, cantidad, intervalo,duracion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            for (let i = 0; i < medicamentos.length; i++) {
                const med = medicamentos[i];
                await conexion.query(sqlMedicamento, [idPrescripcion, med.medicamento, med.concentracion, med.forma_farmaceutica, med.presentacion, med.dosis, [med.intervalo + ' ' + med.unidad],
                    [med.cantidad + ' ' + med.tiempo]
                ]);
            }
        }

        // Insertar en la tabla Prescripciones-Prestaciones
        if (!prestaciones) {
            console.log("No hay prestaciones");
        } else {
            const sqlPrestacion = `INSERT INTO prescripcion_prestacion(id_prescripcion, id_datosprestacion, lado, justificacion) VALUES (?, ?, ?, ?)`;
            for (let i = 0; i < prestaciones.length; i++) {
                const pres = prestaciones[i];
                //Obtener el id de la relacion prestacion indicacion
                const idPrestacionIndicacion = await new Promise((resolve, reject) => {
                    const query = 'SELECT id FROM prestacion_indicacion WHERE id_prestacion = ? AND id_indicacion = ?';
                    conexion.query(query, [pres.prestacion, pres.indicacion], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result[0].id);
                        }
                    });
                });
                await conexion.query(sqlPrestacion, [idPrescripcion, idPrestacionIndicacion, pres.lado, pres.justificacion])
            }
        }

        await conexion.commit();

        res.redirect('/prescripciones/detalle/' + idPrescripcion);
    } catch (err) {
        await conexion.rollback();
        console.log('Error al registrar la prescripción', err);
        res.status(500).send('Error al registrar la prescripción');
        throw err;
    }
};

exports.obtenerTodasPrescripciones = async (req, res) => {
    try {
        const idProfesional = req.session.user.profesional;
        const prescripciones = await new Promise((resolve, reject) => {
            const query = `
            SELECT 
                p.id AS prescripcion_id,
                p.fechaPrescripcion,
                p.diagnostico,
                CONCAT(prof.nombre, ' ', prof.apellido, ' - Matricula: ', prof.matricula) AS profesional,
                CONCAT(pac.nombre, ' ', pac.apellido, ' - DNI: ', pac.documento) AS paciente,
                pac.estado AS estadoPaciente,
                GROUP_CONCAT(DISTINCT CONCAT(m.nombre_generico, ' - ', c.concentracion, ' ', c.unidad) SEPARATOR '; ') AS medicamentos,
                GROUP_CONCAT(DISTINCT CONCAT(pr.nombre, ' - ', pp.justificacion) SEPARATOR '; ') AS prestaciones
            FROM 
                prescripciones p
            JOIN 
                profesionales prof ON p.id_profesional = prof.id
            JOIN 
                paciente_obrasocial pos ON p.paciente_datos = pos.id
            JOIN 
                pacientes pac ON pos.id_paciente = pac.id
            LEFT JOIN 
                prescripcion_medicamento pm ON p.id = pm.id_prescripcion
            LEFT JOIN 
                medicamentos m ON pm.id_medicamento = m.id
            LEFT JOIN 
                concentracion c ON pm.id_concentracion = c.id
            LEFT JOIN 
                prescripcion_prestacion pp ON p.id = pp.id_prescripcion
            LEFT JOIN 
                prestacion_indicacion pi ON pp.id_datosprestacion = pi.id
            LEFT JOIN 
                prestaciones pr ON pi.id_prestacion = pr.id
            WHERE 
                p.id_profesional = ?
            GROUP BY 
                p.id, p.fechaPrescripcion, p.diagnostico, prof.nombre, pac.nombre
            ORDER BY 
                p.id DESC;
            `;
            conexion.query(query, [idProfesional], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.render('prescripciones/prescripcionesTabla', {
            pageTitle: 'Prescripcion',
            prescripciones
        });
    } catch (err) {
        console.log('Error al obtener las prescripciones', err);
        res.status(500).send('Error al obtener las prescripciones');
    }
};

exports.getInformacionPrescripcion = async (req, res) => {
    const id = req.params.id;
    try {
        const profesionales = await prof.getProfesionalesLista();
        const pacientes = await pac.getPacientesLista();
        const medicamentos = await med.getMedicamentosLista();
        const prestaciones = await pres.getPrestacionesLista();
        const prescripcion = await new Promise((resolve, reject) => {
            const query = `
            SELECT 
                p.id AS prescripcion_id,
                p.fechaPrescripcion,
                p.vigencia,
                p.diagnostico,
                p.observaciones,
                p.id_profesional,
                pac.id AS paciente_id,
                pos.id_obrasocial AS obra_social_id,
                pos.plan AS plan_id,
                pl.nombre AS plan_nombre,
                GROUP_CONCAT(
                    DISTINCT m.id,
                    '_',
                    m.nombre_generico, 
                    '_', 
                    c.id,
                    '_',
                    c.concentracion, 
                    ' ',
                    c.unidad,
                    '_',
                    ff.id,
                    '_',
                    ff.forma_farmaceutica, 
                    '_',
                    pre.id, 
                    '_',
                    pre.presentacion, 
                    '_', 
                    pm.cantidad, 
                    '_', 
                    SUBSTRING_INDEX(pm.intervalo, ' ', 1), 
                    '_', 
                    SUBSTRING_INDEX(pm.intervalo, ' ', -1), 
                    '_', 
                    SUBSTRING_INDEX(pm.duracion, ' ', 1), 
                    '_', 
                    SUBSTRING_INDEX(pm.duracion, ' ', -1)
                SEPARATOR '; '
                ) AS medicamentos,
                GROUP_CONCAT(
                    DISTINCT pr.id,
                    '_',
                    pr.nombre, 
                    '_',
                    pi.id_indicacion, 
                    '_',
                    i.indicacion,
                    '_', 
                    pp.lado, 
                    '_', 
                    pp.justificacion
                SEPARATOR '; '
                ) AS prestaciones
            FROM 
                prescripciones p
            JOIN 
                profesionales prof ON p.id_profesional = prof.id
            JOIN 
                paciente_obrasocial pos ON p.paciente_datos = pos.id
            JOIN 
                pacientes pac ON pos.id_paciente = pac.id
            LEFT JOIN 
                plan pl ON pos.plan = pl.id
            LEFT JOIN 
                prescripcion_medicamento pm ON p.id = pm.id_prescripcion
            LEFT JOIN 
                medicamentos m ON pm.id_medicamento = m.id
            LEFT JOIN 
                concentracion c ON pm.id_concentracion = c.id
            LEFT JOIN 
                formas_farmaceuticas ff ON pm.id_formaf = ff.id
            LEFT JOIN 
                presentaciones pre ON pm.id_presentacion = pre.id
            LEFT JOIN 
                prescripcion_prestacion pp ON p.id = pp.id_prescripcion
            LEFT JOIN
                prestacion_indicacion pi ON pp.id_datosprestacion = pi.id
            LEFT JOIN 
                prestaciones pr ON pi.id_prestacion = pr.id
            LEFT JOIN 
                indicacion i ON pi.id_indicacion = i.id
            WHERE
                p.id = ? AND pac.estado = 1
            GROUP BY 
                p.id, p.fechaPrescripcion, p.vigencia, p.diagnostico, p.id_profesional, pac.id, pos.id_obrasocial, pos.plan, pl.nombre;`;

            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]); // Devolver el primer resultado
                }
            });
        });
        res.render('prescripciones/prescripcionDetalle', {
            pageTitle: 'Prescripcion ID: ' + id,
            prescripcion,
            profesionales,
            pacientes,
            medicamentos,
            prestaciones
        });
    } catch (err) {
        console.log('Error al obtener la información de la prescripción:', err);
        res.status(500).send('Error al obtener la información de la prescripción');
    }
};

exports.actualizarPrescripcion = async (req, res) => {
    const id = req.params.id;
    let idProfesional = req.session.user.profesional;
    const {
        paciente,
        obraSocial,
        diagnostico,
        fechaPrescripcion,
        vigencia,
        medicamentos,
        prestaciones,
        observaciones
    } = req.body;
    try {
        await conexion.beginTransaction();
        const paciente_datos = await pac.obtenerObraSocialElegida(paciente, obraSocial);
        const queryPrescripcion = `UPDATE prescripciones SET id_profesional = ?, paciente_datos = ?, diagnostico = ?, fechaPrescripcion = ?, vigencia = ?, observaciones = ? WHERE id = ?`;
        await conexion.query(queryPrescripcion, [idProfesional, paciente_datos, diagnostico, fechaPrescripcion, vigencia,observaciones, id]);

        // Eliminar todos los registros de la tabla prescripcion_medicamento
        if (medicamentos && medicamentos.length > 0) {
            const queryDeleteMedicamentos = 'DELETE FROM prescripcion_medicamento WHERE id_prescripcion = ?';
            await conexion.query(queryDeleteMedicamentos, [id]);
            // Insertar nuevos registros en la tabla prescripcion_medicamento
            const sqlMedicamento = `INSERT INTO prescripcion_medicamento(id_prescripcion, id_medicamento, id_concentracion,id_formaf, id_presentacion, cantidad, intervalo,duracion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            for (let i = 0; i < medicamentos.length; i++) {
                const med = medicamentos[i];
                await conexion.query(sqlMedicamento, [id, med.medicamento, med.concentracion, med.forma_farmaceutica, med.presentacion, med.dosis, [med.intervalo + ' ' + med.unidad],
                    [med.cantidad + ' ' + med.tiempo]
                ]);
            }
        } else {
            const queryDeleteMedicamentos = 'DELETE FROM prescripcion_medicamento WHERE id_prescripcion = ?';
            await conexion.query(queryDeleteMedicamentos, [id]);
        }

        // Eliminar todos los registros de la tabla prescripcion_prestacion
        if (prestaciones && prestaciones.length > 0) {
            const queryDeletePrestaciones = 'DELETE FROM prescripcion_prestacion WHERE id_prescripcion = ?';
            await conexion.query(queryDeletePrestaciones, [id]);
            const sqlPrestacion = `INSERT INTO prescripcion_prestacion(id_prescripcion, id_datosprestacion, lado, justificacion) VALUES (?, ?, ?, ?)`;
            for (let i = 0; i < prestaciones.length; i++) {
                const pres = prestaciones[i];
                // Obtener el id de la relacion prestacion indicacion
                const idPrestacionIndicacion = await new Promise((resolve, reject) => {
                    const query = 'SELECT id FROM prestacion_indicacion WHERE id_prestacion = ? AND id_indicacion = ?';
                    conexion.query(query, [pres.prestacion, pres.indicacion], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result[0].id);
                        }
                    });
                });
                await conexion.query(sqlPrestacion, [id, idPrestacionIndicacion, pres.lado, pres.justificacion]);
            }
        } else {
            const queryDeletePrestaciones = 'DELETE FROM prescripcion_prestacion WHERE id_prescripcion = ?';
            await conexion.query(queryDeletePrestaciones, [id]);
        }
        await conexion.commit();
        res.redirect('/prescripciones/verprescripciones');
    } catch (err) {
        await conexion.rollback();
        console.log('Error al actualizar la prescripción:', err);
        res.status(500).send('Error al actualizar la prescripción');
    }
};

const obtenerPrescripcionId = async (id) => {
    const query = 'SELECT * FROM prescripciones WHERE id = ?';
    return await new Promise((resolve, reject) => {
        conexion.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
}
exports.datosCompletos = async (req, res) => {
    const id = req.params.id;
    try {
        const prescripcion = await obtenerPrescripcionId(id);
        //Obtener profesional
        const profesional = await prof.obtenerDatosProfesional(prescripcion.id_profesional);
        const paciente = await pac.obtenerDatosPaciente(prescripcion.paciente_datos);
        const medicamentos = await med.obtenerDatosMedicamento(id);
        const prestaciones = await pres.obtenerDatosPrestacion(id);
        paciente.fecha_nacimiento = formatDate(paciente.fecha_nacimiento);
        prescripcion.fechaPrescripcion = formatDate(prescripcion.fechaPrescripcion);
        if (prescripcion.vigencia === '0000-00-00') {
            prescripcion.vigencia = null;
        } else {
            prescripcion.vigencia = formatDate(prescripcion.vigencia);
        }
        if (paciente.sexo === 'M') {
            paciente.sexo = 'Masculino';
        } else if (paciente.sexo === 'F') {
            paciente.sexo = 'Femenino';
        } else if (paciente.sexo === 'D') {
            paciente.sexo = 'Desconocido';
        } else if (paciente.sexo === 'O') {
            paciente.sexo = 'Otro';
        }
        res.render('prescripciones/prescripcionDatos', {
            prescripcion,
            profesional,
            paciente,
            medicamentos,
            prestaciones
        });
    } catch (error) {
        console.error('Error al obtener los datos completos:', error);
        res.status(500).send('Error al obtener los datos completos');
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', options);
}