const conexion = require('../../db/conexion.js');

exports.getIndicaciones = async (req, res) => {
    try {
        const indicaciones = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM indicacion';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return indicaciones;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos');
    }
}

exports.getIndicacionesPorId = async (id) => {
    try {
        const sql = 'SELECT * FROM prestacion_indicacion WHERE id_prestacion = ?';
        const result = await new Promise((resolve, reject) => {
            const query = sql;
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
        console.log('Error al obtener los datos de indicaciones', err);
        throw err;
    }
}

exports.getIndicacionPorId  = async (id) => {
    try {
        const sql = 'SELECT * FROM indicacion WHERE id = ?';
        const result = await new Promise((resolve, reject) => {
            const query = sql;
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result[0].indicacion;
    } catch (err) {
        console.log('Error al obtener los datos de indicaciones', err);
        throw err;
    }
}