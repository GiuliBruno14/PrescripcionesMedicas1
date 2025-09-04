document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#formRegistro');
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
    const username = document.querySelector('#username');
    const password = document.querySelector('#password');
    const rol = document.querySelector('#rol');
    const matricula = document.querySelector('#matricula');
    let validar = false;

    if (username.value.trim().length < 8) {
        mostrarError(username, 'errorUsername');
        return false;
    } else {
        validar = await validarUsername(username.value);
        if (!validar) {
            mostrarError(username, 'errorUsernameExistente');
            return false;
        } else {
            ocultarErrores(username, ['errorUsername', 'errorUsernameExistente']);
        }
    }

    if (password.value.trim().length < 8) {
        mostrarError(password, 'errorPassword');
        return false;
    } else {
        ocultarErrores(password, ['errorPassword']);
    }

    if (rol.value.trim().length < 1) {
        mostrarError(rol, 'errorRol');
        return false;
    } else {
        ocultarErrores(rol, ['errorRol']);
    }

    if (rol.value === 'profesional') {
        if (matricula.value.trim().length < 5) {
            mostrarError(matricula, 'errorMatricula');
            return false;
        } else {
            validar = await validarMatricula(matricula.value);
            if (validar) {
                mostrarError(matricula, 'errorMatriculaNoExistente');
                return false;
            } else {
                validar = await verificarMatriculaUsada(matricula.value);
                if (!validar) {
                    mostrarError(matricula, 'errorMatriculaExistente');
                    return false;
                } else {
                    ocultarErrores(matricula, ['errorMatricula', 'errorMatriculaNoExistente', 'errorMatriculaExistente']);
                }
            }
        }
    }
    return true;
};

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

async function validarUsername(username) {
    try {
        const response = await fetch('/registro/verificarUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        });
        const data = await response.json();
        return data.esUnico;
    } catch (error) {
        console.error('Error al validar el username:', error);
        return false;
    }
}

async function validarMatricula(matricula) {
    try {
        const response = await fetch('/profesionales/validarMatricula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matricula: matricula })
        });
        const data = await response.json();
        return data.esValida;
    } catch (error) {
        console.error('Error al validar la matricula:', error);
        return false;
    }
}

async function verificarMatriculaUsada (matricula) {
    try {
        const response = await fetch('/profesionales/verificarMatriculaUsada', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matricula: matricula })
        });
        const data = await response.json();
        return data.esUsada;
    } catch (error) {
        console.error('Error al verificar la matricula:', error);
        return false;
    }
}