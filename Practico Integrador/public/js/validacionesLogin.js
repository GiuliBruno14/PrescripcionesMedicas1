document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#formLogin');
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

    if (username.value.trim().length < 1) {
        mostrarError(username, 'errorUsername');
        return false;
    } else {
        ocultarErrores(username, ['errorUsername']);
    }

    if (password.value.trim().length < 1) {
        mostrarError(password, 'errorPassword');
        return false;
    } else {
        ocultarErrores(password, ['errorPassword']);
    }

    let esValido = await validarCredenciales(username.value, password.value);
    if (!esValido) {
        mostrarError(username, 'errorCredenciales');
        return false;
    } else {
        ocultarErrores(username, ['errorCredenciales']);
    }
    //Si es profesional verificar el estado
    let estado = await validarEstado(username.value);
    if (!estado) {
        mostrarError(username, 'errorEstado');
        return false;
    } else {
        ocultarErrores(username, ['errorEstado']);
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

async function validarCredenciales(username, password) {
    try {
        const response = await fetch('/verificarCredenciales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();
        return data.esValido;
    } catch (error) {
        console.error('Error al validar las credenciales:', error);
        return false;
    }
}

async function validarEstado(username) {
    try {
        const response = await fetch('/verificarEstado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username
            })
        });
        const data = await response.json();
        return data.esValido;
    } catch (error) {
        console.error('Error al validar el estado:', error);
        return false;
    }
}