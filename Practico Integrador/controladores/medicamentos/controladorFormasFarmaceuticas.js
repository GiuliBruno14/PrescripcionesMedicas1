const conexion = require('../../db/conexion.js');

exports.getFormasFarmaceuticas = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, forma_farmaceutica FROM formas_farmaceuticas';
        conexion.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.obtenerFormaFID = (formaFarmaceutica) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM formas_farmaceuticas WHERE forma_farmaceutica = ?';
        conexion.query(sql, [formaFarmaceutica], (err, result) => {
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

exports.buscarFormasFarmaceuticasPorId = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, forma_farmaceutica FROM formas_farmaceuticas WHERE id = ?';
        conexion.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(null);
                return;
            }
            const formaFarmaceutica = result[0].forma_farmaceutica;
            resolve(formaFarmaceutica);
        })
    })
}