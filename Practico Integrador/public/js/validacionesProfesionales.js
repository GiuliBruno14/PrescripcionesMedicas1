document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.form-container');
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); 
        if (await validarCampos()) {
            form.submit(); 
        } else {
            console.log('Campos inválidos');
        }
    });
});

const validarCampos = async () => {
    const id = document.querySelector('[name="profesionalId"]').value;
    const nombre = document.querySelector('#nombre');
    const apellido = document.querySelector('#apellido');
    const documento = document.querySelector('#documento');
    const profesion = document.querySelector('#profesion');
    const especialidad = document.querySelector('#especialidad');
    const domicilio = document.querySelector('#domicilio');
    const matricula = document.querySelector('#matricula');
    const idRefeps = document.querySelector('#idRefeps');
    const fechaCaducidad = document.querySelector('#fechaCaducidad');

    const hoy = new Date();
    let validar = false;

    if (nombre.value.trim().length < 3 || nombre.value.trim().length > 30) {
        mostrarError(nombre, 'errorNombre');
        return false;
    } else {
        if (!isNaN(nombre.value)) {
            mostrarError(nombre, 'errorNombreNum');
            return false;
        } else {
            ocultarErrores(nombre, ['errorNombre', 'errorNombreNum']);
        }
    }

    if (apellido.value.trim().length < 3 || apellido.value.trim().length > 30) {
        mostrarError(apellido, 'errorApellido');
        return false;
    } else {
        if (!isNaN(apellido.value)) {
            mostrarError(apellido, 'errorApellidoNum');
            return false;
        } else {
            ocultarErrores(apellido, ['errorApellido', 'errorApellidoNum']);
        }
    }

    if (isNaN(documento.value)) {    
        mostrarError(documento, 'errorDocumento');
        return false;
    } else {
        if (documento.value.trim().length < 7 || documento.value.trim().length > 8) {
            mostrarError(documento, 'errorDocumentoL');
            return false;
        } else {
            validar = await comprobarDNI(documento.value.trim(), id);
            if (!validar) {
                mostrarError(documento, 'errorDocumentoExistente');
                return false;
            } else {
                ocultarErrores(documento, ['errorDocumento', 'errorDocumentoL', 'errorDocumentoExistente']);
            }
            ocultarErrores(documento, ['errorDocumento', 'errorDocumentoL']);
        }
    }

    if (profesion.value === "") {
        mostrarError(profesion, 'errorProfesion');
        return false;
    } else {
        ocultarErrores(profesion, ['errorProfesion']);
    }

    if (especialidad.value === "") {
        mostrarError(especialidad, 'errorEspecialidad');
        return false;
    } else {
        ocultarErrores(especialidad, ['errorEspecialidad']);
    }

    if (domicilio.value.trim().length < 3 || domicilio.value.trim().length > 100) {
        mostrarError(domicilio, 'errorDomicilio');
        return false;
    } else {
        if (!isNaN(domicilio.value)) {
            mostrarError(domicilio, 'errorDomicilioNum');
            return false;
        } else {
            ocultarErrores(domicilio, ['errorDomicilio', 'errorDomicilioNum']);
        }
    }

    if (isNaN(matricula.value)) { 
        mostrarError(matricula, 'errorMatricula');
        return false;
    } else {
        if (matricula.value.trim().length < 3 || matricula.value.trim().length > 30) {
            mostrarError(matricula, 'errorMatriculaL');
            return false;
        } else {
            validar = await comprobarMatricula(matricula.value.trim(), id);
            if (!validar) {
                mostrarError(matricula, 'errorMatriculaExistente');
                return false;
            } else {
                ocultarErrores(matricula, ['errorMatricula', 'errorMatriculaL', 'errorMatriculaExistente']);
            }
        }
    }

    validar = await comprobarIdRefeps(idRefeps.value.trim());
    if (!validar) {
        mostrarError(idRefeps, 'errorIdRefeps');
        return false;
    } else {
         validar = await comprobarIdRefepsUnico(idRefeps.value.trim(), id);
        if (!validar) {
            mostrarError(idRefeps, 'errorIdRefepsExistente');
            return false;
        } else {
            ocultarErrores(idRefeps, ['errorIdRefeps', 'errorIdRefepsExistente']);
        }
    }

    if (new Date(fechaCaducidad.value) < hoy || fechaCaducidad.value === "") {
        mostrarError(fechaCaducidad, 'errorFechaCaducidad');
        return false;
    } else {
        ocultarErrores(fechaCaducidad, ['errorFechaCaducidad']);
    }
    return true;
}

function mostrarError(elemento, idError) {
    document.querySelector(`#${idError}`).style.display = 'inline';
    elemento.classList.add('campoerror');
    elemento.focus();
};

function ocultarErrores(elemento, idsErrores) {
    idsErrores.forEach(id => {
        document.querySelector(`#${id}`).style.display = 'none';
    });
    elemento.classList.remove('campoerror');
};

async function comprobarDNI(dni, id) {
    try {
        const response = await fetch('/profesionales/verificarDNI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documento: dni,
                id: id
            })
        });
        const data = await response.json();
        return data.esUnico;
    } catch (error) {
        console.error('Error al comprobar el DNI:', error);
        return false;
    }
}

async function comprobarMatricula(matricula, id) {
    try { 
        const response = await fetch('/profesionales/verificarMatricula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matricula: matricula,
                id: id
            })
        });
        const data = await response.json();
        return data.esUnica;
    } catch (error) {
        console.error('Error al comprobar la Matricula:', error);
        return false;
    }
}

async function comprobarIdRefeps(idRefeps) {
    try {
        const response = await fetch('/profesionales/verificarIdRefeps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idRefeps: idRefeps })
        });
        const data = await response.json();
        return data.esValido;
    } catch (error) {
        console.error('Error al comprobar el ID Refeps:', error);
        return false;
    }
}

async function comprobarIdRefepsUnico(idRefeps, id) {
    try {
        const response = await fetch('/profesionales/verificarIdRefepsUnico', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idRefeps: idRefeps, id: id })
        });
        const data = await response.json();
        return data.esUnico;
    } catch (error) {
        console.error('Error al comprobar el ID Refeps:', error);
        return false;
    }
}