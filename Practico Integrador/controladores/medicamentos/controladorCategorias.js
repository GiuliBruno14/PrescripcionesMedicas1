const conexion = require('../../db/conexion.js');

exports.getCategorias = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id,categoria FROM categorias';
        conexion.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.obtenerCategoriasID = (categoria) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM categorias WHERE categoria = ?';
        conexion.query(sql, [categoria], (err, result) => {
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

exports.buscarCategoriasPorId = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT categoria FROM categorias WHERE id = ?';
        conexion.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(null);
                return;
            }
            const categoria= result[0].categoria;
            resolve(categoria);
        });
    });
};