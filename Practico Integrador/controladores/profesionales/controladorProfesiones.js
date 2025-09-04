const conexion = require('../../db/conexion.js');

exports.getProfesiones = async (req, res) => {
    try {
        const profesiones = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM profesiones';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return profesiones;
    } catch (err) {
        console.log('Error al obtener los  datos de las profesiones', err);
        res.status(500).send('Error al obtener los datos');
    }
}

exports.getEspecialidades = async (req, res) => {
    try {
        const especialidades = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM especialidades';
            conexion.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return especialidades;
    } catch (err) {
        console.log('Error al obtener los datos de las especialidades', err);
    }
}

exports.getEspecialidadProfesion = async (req, res) => {
    try {
        const id = req.params.id;
        const especialidades = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM especialidades WHERE id_profesion = ?';
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.json(especialidades);
    } catch (err) {
        // Si hay un error, envía una respuesta de error al cliente
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos de las especialidades de la profesión');
    }
}

exports.getProfesionPorId = async (id) => {
    try{ 
        const profesion = await new Promise((resolve, reject) => {
            const query = 'SELECT nombre FROM profesiones WHERE id = ?';
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return profesion[0].nombre;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos de las especialidades de la profesión');
    }
}

exports.getEspecialidadPorId = async (id) => {
    try{ 
        const especialidad = await new Promise((resolve, reject) => {
            const query = 'SELECT nombre FROM especialidades WHERE id = ?';
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return especialidad[0].nombre;
    } catch (err) {
        console.log('Error al obtener los datos', err);
        res.status(500).send('Error al obtener los datos de las especialidades de la profesión');
    }
}

