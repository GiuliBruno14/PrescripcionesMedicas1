const conexion = require('../../db/conexion.js');

exports.getObrasSociales = async (req, res) => {
    try {
        const obrasSociales = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM obra_social';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return obrasSociales;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
}
exports.getPlanes = async (req, res) => {
    try {
        const planes = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM plan';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return planes;
    } catch (err) {
        console.log('Error al obtener los datos', err);
    }
}

exports.getPlanesdeObraSocial = async (req, res) => {
    try {
        const id = req.params.id;
        const planes = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM plan WHERE id_obrasocial = ?';
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Envía los datos de los planes como respuesta al cliente
        res.json(planes);
    } catch (err) {
        // Si hay un error, envía una respuesta de error al cliente
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos de los planes de la obra social.');
    }
}

exports.getPacienteObraSocial = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            const query = 'SELECT id_obrasocial FROM paciente_obrasocial WHERE id_paciente = ? AND estado = 1';
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        return null;
    }
}

exports.getPacientePlan = async (id, os) => {
    try {
        const result = await new Promise((resolve, reject) => {
            const query = 'SELECT plan FROM paciente_obrasocial WHERE id_paciente = ? AND id_obrasocial = ? AND estado = 1';
            conexion.query(query, [id, os], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        return null;
    }
}

exports.getObraSocialPorId = async (id) => {
    try {
        const obraSocial = await new Promise((resolve, reject) => {
            const query = 'SELECT nombre FROM obra_social WHERE id = ?';
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return obraSocial[0].nombre;
    } catch (err) {
        console.log('Error al obtener los datos', err);
    }
}

exports.getPlanPorId = async (id) => {
    try {
        const plan = await new Promise((resolve, reject) => {
            const query = 'SELECT nombre FROM plan WHERE id = ?';
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return plan[0].nombre;
    } catch (err) {
        console.log('Error al obtener los datos', err);
    }
}

exports.getObraSocialPorPlan = async (plan) => {
     try {
        const obraSocial = await new Promise((resolve, reject) => {
            const query = 'SELECT id_obrasocial FROM plan WHERE id = ?';
            conexion.query(query, [plan], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return obraSocial[0].id_obrasocial;
     } catch (err) {
        console.log('Error al obtener los datos', err);
    }
}