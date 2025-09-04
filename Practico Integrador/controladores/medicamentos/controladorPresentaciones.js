const conexion = require('../../db/conexion.js');

exports.getPresentaciones = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT id, presentacion FROM presentaciones';
        conexion.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

exports.obtenerPresentacionID = (presentacion) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM presentaciones WHERE presentacion = ?';
        conexion.query(sql, [presentacion], (err, result) => {
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

exports.buscarPresentacionesPorId = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id,presentacion FROM presentaciones WHERE id = ?';
        conexion.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(null);
                return;
            }
            const presentacion = result[0].presentacion;
            resolve(presentacion);
        })
    })
}