const conexion = require('../../db/conexion.js');

exports.getConcentraciones = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT id,concentracion, unidad FROM concentracion';
        conexion.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.obtenerConcentracionesID = (concentracion) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM concentracion WHERE concentracion = ?';
        conexion.query(sql, [concentracion], (err, result) => {
            if (err) {
                reject(err);
            } else {
                // Si hay resultados, devolver el ID del primer resultado
                if (result.length > 0) {
                    resolve(result[0].id);
                } else {
                    // Si no hay resultados, devolver null o algún valor indicativo de que no se encontraron resultados
                    resolve(null);
                }
            }
        });
    });
}

exports.buscarConcentracionesPorId = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, concentracion, unidad FROM concentracion WHERE id = ?';
        conexion.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(null);
                return;
            }
            const concentracion = {
                concentracion: result[0].concentracion,
                unidad: result[0].unidad
            };
            resolve(concentracion);
        });
    });
};