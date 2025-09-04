const conexion = require('../../db/conexion.js');

exports.getMedicamentosConcentraciones = async () => {
    try {
        const sql = 'SELECT id_medicamento, id_concentracion FROM medicamentos_concentraciones';
        const result = await new Promise((resolve, reject) => {
            const query = sql;
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result;
    } catch (err) {
        console.log('Error al obtener los datos MC', err);
        throw err;
    }
}

exports.getMedicamentosFormasF = async () => {
    try {
        const sql = 'SELECT id_medicamento, id_formasf FROM medicamentos_formasf';
        const result = await new Promise((resolve, reject) => {
            const query = sql;
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result;
    } catch (err) {
        console.log('Error al obtener los datos MFF', err);
        throw err;
    }
}

exports.getMedicamentosPresentaciones = async () => {
    try {
        const sql = 'SELECT id_medicamento, id_presentacion FROM medicamentos_presentaciones';
        const result = await new Promise((resolve, reject) => {
            const query = sql;
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result;
    } catch (err) {
        console.log('Error al obtener los datos MP', err);
        throw err;
    }
}

exports.getMedicamentosConcentracionesPorID = async (id) => {
    try {
        const sql = 'SELECT id_medicamento, id_concentracion FROM medicamentos_concentraciones WHERE id_medicamento = ?';
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
        console.log('Error al obtener los datos MC', err);
        throw err;
    }
}

exports.getMedicamentosFormasFPorID = async (id) => {
    try {
        const sql = 'SELECT id_medicamento, id_formasf FROM medicamentos_formasf WHERE id_medicamento = ?';
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
        console.log('Error al obtener los datos MFF', err);
        throw err;
    }
}

exports.getMedicamentosPresentacionesPorID = async (id) => {
    try {
        const sql = 'SELECT id_medicamento, id_presentacion FROM medicamentos_presentaciones WHERE id_medicamento = ?';
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
        console.log('Error al obtener los datos MP', err);
        throw err;
    }
}