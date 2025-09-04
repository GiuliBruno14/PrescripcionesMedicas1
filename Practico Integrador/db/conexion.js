const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prescripcionesmedicas',
})

conexion.connect((err) => {
    if (err) {
        console.log('Error al conectar MySQL', err);
        return;
    } else {
        console.log('Conectado a la base de datos');
    }
});

module.exports = conexion;