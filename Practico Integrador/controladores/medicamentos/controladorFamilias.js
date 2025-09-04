const conexion = require('../../db/conexion.js');

exports.getFamilias = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id,familia FROM familias';
        conexion.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.obtenerFamiliasID = (familia) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM familias WHERE familia = ?';
        conexion.query(sql, [familia], (err, result) => {
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

exports.buscarFamiliasPorId = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT familia FROM familias WHERE id = ?';
        conexion.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(null);
                return;
            }
            const familia = result[0].familia;
            resolve(familia);
        });
    });
};