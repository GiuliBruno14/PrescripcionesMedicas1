const conexion = require('../../db/conexion.js');
const detalle = require('../medicamentos/controladorDetalles.js');
const conc = require('../medicamentos/controladorConcentraciones.js');
const formaf = require('../medicamentos/controladorFormasFarmaceuticas.js');
const present = require('../medicamentos/controladorPresentaciones.js');
const familia = require('../medicamentos/controladorFamilias.js');
const cat = require('../medicamentos/controladorCategorias.js');


exports.getMedicamentos = async (req, res) => {
    try {
        const formasFarmaceuticas = await formaf.getFormasFarmaceuticas();
        const concentraciones = await conc.getConcentraciones();
        const presentaciones = await present.getPresentaciones();
        const familias = await familia.getFamilias();
        const categorias = await cat.getCategorias();

        const medicamentos = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM medicamentos';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarMedicamentos(medicamentos);

        res.render('medicamentos/medicamentosIndex', {
            pageTitle: 'Medicamentos',
            medicamentos,
            concentraciones,
            formasFarmaceuticas,
            presentaciones,
            familias,
            categorias
        });
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
};

exports.registrarMedicamento = async (req, res) => {
    const {
        nombreGenerico,
        familia,
        categoria,
        nombreComercial,
        concentracion,
        formaFarmaceutica,
        presentacion
    } = req.body;
    try {
        // Iniciar transacción
        await conexion.beginTransaction();
        // Insertar en la tabla medicamentos
        const sqlMedicamento = `INSERT INTO medicamentos (nombre_generico, nombre_comercial, categoria, familia, estado) VALUES (?, ?, ?, ?, ?)`;
        await conexion.query(sqlMedicamento, [nombreGenerico, nombreComercial, categoria, familia, 1]);

        // Obtener el ID del medicamento insertado
        const medicamentoId = await new Promise((resolve, reject) => {
            const sql = 'SELECT id FROM medicamentos ORDER BY id DESC LIMIT 1';
            conexion.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].id);
                }
            });
        })
        // Insertar en la tabla medicamento_concnetranciones
        if (concentracion && concentracion.length) {
            const sqlCon = 'INSERT INTO medicamentos_concentraciones (id_concentracion, id_medicamento) VALUES ?';
            const conValues = concentracion.map(con => [con, medicamentoId]);
            await conexion.query(sqlCon, [conValues]);
        }

        // Insertar múltiples formas farmacéuticas
        if (formaFarmaceutica && formaFarmaceutica.length) {
            const sqlForma = 'INSERT INTO medicamentos_formasf (id_formasf, id_medicamento) VALUES ?';
            const formaValues = formaFarmaceutica.map(forma => [forma, medicamentoId]);
            await conexion.query(sqlForma, [formaValues]);
        }

        // Insertar múltiples presentaciones
        if (presentacion && presentacion.length) {
            const sqlPres = 'INSERT INTO medicamentos_presentaciones (id_presentacion, id_medicamento) VALUES ?';
            const presValues = presentacion.map(pres => [pres, medicamentoId]);
            await conexion.query(sqlPres, [presValues]);
        }

        // Si todo está correcto, commit a la transacción
        await conexion.commit();

        // Redireccionar o enviar algún mensaje de éxito
        res.redirect('/medicamentos');
    } catch (error) {
        // Si hay error, rollback a la transacción
        console.error('Error al registrar el medicamento: ', error);
        await conexion.rollback();
        res.status(500).send('Error al registrar el medicamento');
    }
};

const obtenerMedicamentoPorId = async (medicamentoId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM medicamentos WHERE id = ?';
        conexion.query(sql, [medicamentoId], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(null);
                return;
            }
            const medicamento = result[0];
            resolve(medicamento);
        })
    })
}

exports.getInformacionMedicamento = async (req, res) => {
    try {
        const medicamentoId = req.params.id;
        const medicamento = await obtenerMedicamentoPorId(medicamentoId);

        if (!medicamento) {
            return res.status(404).send('Medicamento no encontrado');
        }

        // Obtener los IDs de concentraciones, formas farmacéuticas y presentaciones
        const [formasFarmaceuticasRelation, concentracionesRelation, presentacionesRelation] = await Promise.all([
            detalle.getMedicamentosFormasFPorID(medicamentoId),
            detalle.getMedicamentosConcentracionesPorID(medicamentoId),
            detalle.getMedicamentosPresentacionesPorID(medicamentoId)
        ]);
        const formasFarmaceuticasId = formasFarmaceuticasRelation.map(rel => rel.id_formasf);
        const concentracionesId = concentracionesRelation.map(rel => rel.id_concentracion);
        const presentacionesId = presentacionesRelation.map(rel => rel.id_presentacion);

        const familias = await familia.getFamilias();
        const categorias = await cat.getCategorias();
        const formasFarmaceuticas = await formaf.getFormasFarmaceuticas();
        const concentraciones = await conc.getConcentraciones();
        const presentaciones = await present.getPresentaciones();

        res.render('medicamentos/detallesMedicamento', {
            pageTitle: 'Detalles Medicamento',
            medicamento,
            formasFarmaceuticasId,
            concentracionesId,
            presentacionesId,
            familias,
            categorias,
            formasFarmaceuticas,
            concentraciones,
            presentaciones
        });

    } catch (error) {
        console.error('Error al obtener el medicamento:', error);
        res.status(500).send('Error al obtener el medicamento');
    }
};

exports.actualizarMedicamento = async (req, res) => {
    const medicamentoId = req.params.id;
    const {
        nombreGenerico,
        concentracion,
        formaFarmaceutica,
        presentacion,
        familia,
        categoria,
        nombreComercial,
        estado
    } = req.body;
    try {
        // Iniciar transacción
        await conexion.beginTransaction();
        const estadoCheckboxPresente = "estado" in req.body;
        const estado = estadoCheckboxPresente ? 1 : 0;
        const medicamento = await obtenerMedicamentoPorId(medicamentoId);
        if (!medicamento) {
            return res.status(404).send('Medicamento no encontrado');
        }

        // Insertar en la tabla medicamentos
        const sqlMedicamento = `UPDATE medicamentos
        SET nombre_generico = ?, nombre_comercial = ?, categoria = ?, familia = ?, estado = ? WHERE id = ?`;
        await conexion.query(sqlMedicamento, [nombreGenerico, nombreComercial, categoria, familia, estado, medicamentoId]);

        // Primero eliminamos las asociaciones existentes para este medicamento
        const sqlDeleteMedicamentoConcentracion = `DELETE FROM medicamentos_concentraciones WHERE id_medicamento = ?`;
        await conexion.query(sqlDeleteMedicamentoConcentracion, [medicamentoId]);
        const sqlDeleteMedicamentoForma = `DELETE FROM medicamentos_formasf WHERE id_medicamento = ?`;
        await conexion.query(sqlDeleteMedicamentoForma, [medicamentoId]);
        const sqlDeleteMedicamentoPresentacion = `DELETE FROM medicamentos_presentaciones WHERE id_medicamento = ?`;
        await conexion.query(sqlDeleteMedicamentoPresentacion, [medicamentoId]);

        // Insertar nuevas asociaciones solo si hay Concentraciones seleccionadas
        if (concentracion && concentracion.length > 0 && concentracion[0] !== 'null') {
            const sqlInsertMedicamentoConcentracion = `INSERT INTO medicamentos_concentraciones (id_medicamento, id_concentracion) VALUES (?, ?)`;
            for (let i = 0; i < concentracion.length; i++) {
                await conexion.query(sqlInsertMedicamentoConcentracion, [medicamentoId, concentracion[i]]);
            }
        }
        // Insertar nuevas asociaciones solo si hay Formas Farmacéuticas seleccionadas
        if (formaFarmaceutica && formaFarmaceutica.length > 0 && formaFarmaceutica[0] !== 'null') {
            const sqlInsertMedicamentoForma = `INSERT INTO medicamentos_formasf (id_medicamento, id_formasf) VALUES (?, ?)`;
            for (let i = 0; i < formaFarmaceutica.length; i++) {
                await conexion.query(sqlInsertMedicamentoForma, [medicamentoId, formaFarmaceutica[i]]);
            }
        }
        // Insertar nuevas asociaciones solo si hay Presentaciones seleccionadas
        if (presentacion && presentacion.length > 0 && presentacion[0] !== 'null') {
            const sqlInsertMedicamentoPresentacion = `INSERT INTO medicamentos_presentaciones (id_medicamento, id_presentacion) VALUES (?, ?)`;
            for (let i = 0; i < presentacion.length; i++) {
                await conexion.query(sqlInsertMedicamentoPresentacion, [medicamentoId, presentacion[i]]);
            }
        }

        // Si todo está correcto, commit a la transacción
        await conexion.commit();

        // Redireccionar o enviar algún mensaje de éxito
        res.redirect('/medicamentos');
    } catch (error) {
        // Si hay error, rollback a la transacción
        console.error('Error al actualzar el medicamento: ', error);
        await conexion.rollback();
        res.status(500).send('Error al actualizar el medicamento');
    }
};

const ordenarMedicamentos = (medicamentos) => {
    medicamentos.sort((a, b) => {
        if (a.nombre_generico < b.nombre_generico) {
            return -1;
        }
        if (a.nombre_generico > b.nombre_generico) {
            return 1;
        }
        return 0;
    });
}
exports.buscarMedicamentos = async (req, res) => {
    const searchTerm = req.body.searchTerm || req.query.searchTerm || '';
    try {
        const medicamentos = await new Promise((resolve, reject) => {
            const query = `
                    SELECT
                    m.id,
                    m.nombre_generico,
                    m.nombre_comercial,
                    c.categoria,
                    f.familia,
                    GROUP_CONCAT(DISTINCT con.concentracion ORDER BY con.concentracion SEPARATOR ', ') AS concentraciones,
                    GROUP_CONCAT(DISTINCT ff.forma_farmaceutica ORDER BY ff.forma_farmaceutica SEPARATOR ', ') AS formas_farmaceuticas,
                    GROUP_CONCAT(DISTINCT p.presentacion ORDER BY p.presentacion SEPARATOR ', ') AS presentaciones
                FROM
                    medicamentos m
                LEFT JOIN
                    categorias c ON m.categoria = c.id
                LEFT JOIN
                    familias f ON m.familia = f.id
                LEFT JOIN
                    medicamentos_concentraciones mc ON m.id = mc.id_medicamento
                LEFT JOIN
                    concentracion con ON mc.id_concentracion = con.id
                LEFT JOIN
                    medicamentos_formasf mf ON m.id = mf.id_medicamento
                LEFT JOIN
                    formas_farmaceuticas ff ON mf.id_formasf = ff.id
                LEFT JOIN
                    medicamentos_presentaciones mp ON m.id = mp.id_medicamento
                LEFT JOIN
                    presentaciones p ON mp.id_presentacion = p.id
                WHERE
                    m.nombre_generico LIKE ?
                    OR m.nombre_comercial LIKE ?
                    OR c.categoria LIKE ?
                    OR f.familia LIKE ?
                    OR con.concentracion LIKE ?
                    OR ff.forma_farmaceutica LIKE ?
                    OR p.presentacion LIKE ?
                GROUP BY
                    m.id, m.nombre_generico, m.nombre_comercial, c.categoria, f.familia;
            `;
            const searchValue = `%${searchTerm}%`;
            const values = [searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue];

            conexion.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarMedicamentos(medicamentos);
        res.json(medicamentos);
    } catch (err) {
        console.error('Error al buscar medicamentos: ', err);
        res.status(500).json({
            error: 'Error al buscar medicamentos'
        });
    }
}

exports.verificarNombreGenericoUnico = async (nombreGenerico, id) => {
    try {
        let query = 'SELECT COUNT(*) AS count FROM medicamentos WHERE nombre_generico = ?';
        let params = [nombreGenerico];
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
        console.error('Error al verificar el nombre genérico: ', err);
        throw err;
    }
}

exports.getMedicamentosLista = async (req, res) => {
    try {
        const medicamentos = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM medicamentos WHERE estado = 1';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ordenarMedicamentos(medicamentos);
        return medicamentos;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
};

exports.getDetallesPorMedicamento = async (req, res) => {
    const medicamentoId = req.params.id;
    try {
        const detalles = await new Promise((resolve, reject) => {
            const query = `SELECT
                GROUP_CONCAT(DISTINCT CONCAT(c.id, ': ', c.concentracion, ' ', c.unidad) ORDER BY c.concentracion SEPARATOR ', ') AS concentraciones,
                GROUP_CONCAT(DISTINCT CONCAT(ff.id, ': ', ff.forma_farmaceutica) ORDER BY ff.forma_farmaceutica SEPARATOR ', ') AS formas_farmaceuticas,
                GROUP_CONCAT(DISTINCT CONCAT(p.id, ': ', p.presentacion) ORDER BY p.presentacion SEPARATOR ', ') AS presentaciones
            FROM
                medicamentos m
            LEFT JOIN
                medicamentos_concentraciones mc ON m.id = mc.id_medicamento
            LEFT JOIN
                concentracion c ON mc.id_concentracion = c.id
            LEFT JOIN
                medicamentos_formasf mf ON m.id = mf.id_medicamento
            LEFT JOIN
                formas_farmaceuticas ff ON mf.id_formasf = ff.id
            LEFT JOIN
                medicamentos_presentaciones mp ON m.id = mp.id_medicamento
            LEFT JOIN
                presentaciones p ON mp.id_presentacion = p.id
            WHERE
                m.id = ?;
            `;
            conexion.query(query, [medicamentoId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
        res.json(detalles);
    } catch (err) {
        console.log('Error al obtener los detalles del medicamento', err);
        res.status(500).send('Error al obtener los detalles del medicamento');
    }
};

exports.obtenerDatosMedicamento = async (idPrescripcion) => {
    try {
        // Consulta SQL para obtener los datos de los medicamentos asociados a la prescripción
        const query = 'SELECT id_medicamento, id_concentracion, id_formaf, id_presentacion, cantidad, intervalo, duracion FROM prescripcion_medicamento WHERE id_prescripcion = ?';
        
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
        
        // Inicializar un array para almacenar los medicamentos
        const medicamentos = [];
        
        // Iterar sobre los resultados de la consulta y obtener detalles adicionales de cada medicamento
        for (let dato of datos) {
            const concentracion = await conc.buscarConcentracionesPorId(dato.id_concentracion);
            const formaFarmaceutica = await formaf.buscarFormasFarmaceuticasPorId(dato.id_formaf);
            const presentacion = await present.buscarPresentacionesPorId(dato.id_presentacion);
            const medicamento = await obtenerMedicamentoPorId(dato.id_medicamento);

            // Agregar detalles adicionales al medicamento
            medicamento.concentracion = concentracion.concentracion;
            medicamento.unidad = concentracion.unidad;
            medicamento.formaFarmaceutica = formaFarmaceutica;
            medicamento.presentacion = presentacion;
            medicamento.cantidad = dato.cantidad;
            medicamento.intervalo = dato.intervalo;
            medicamento.duracion = dato.duracion; 
            // Agregar el medicamento al array
            medicamentos.push(medicamento);
        }

        return medicamentos;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        throw err;
    }
}