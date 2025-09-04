document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.form-container');
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita que el formulario se envíe por defecto
        if (await validarCampos()) {
            form.submit(); // Si la validación es correcta, envía el formulario
        } else {
            console.log('Campos inválidos');
        }
    });
});

const validarCampos = async () => {
    const id = document.querySelector('[name="pacienteId"]').value;
    const nombre = document.querySelector('#nombre');
    const apellido = document.querySelector('#apellido');
    const documento = document.querySelector('#documento');
    const fechaNacimiento = document.querySelector('#fechaNacimiento');
    const genero = document.querySelector('#genero');
    const obraSocial = document.querySelector('#obrasocial');
    const planContainers = document.querySelectorAll('.plan-container-item');
    const hoy = new Date();
    const minFecha = new Date('1900-01-01');
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

    if (isNaN(documento.value)) { // Si no es un número       
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

    if (new Date(fechaNacimiento.value) < minFecha || new Date(fechaNacimiento.value) > hoy || fechaNacimiento.value === "") {
        mostrarError(fechaNacimiento, 'errorFechaN');
        return false;
    } else {
        ocultarErrores(fechaNacimiento, ['errorFechaN']);
    }

    if (genero.value === "") {
        mostrarError(genero, 'errorGenero');
        return false;
    } else {
        ocultarErrores(genero, ['errorGenero']);
    }

    if (obraSocial.selectedOptions.length === 0) {
        mostrarError(obraSocial, 'errorObraS');
        return false;
    } else {
        ocultarErrores(obraSocial, ['errorObraS']);
    }

    for (const planContainer of planContainers) {
        const planSelect = planContainer.querySelector('.plan-select');
        if (planSelect.value === "") {
            mostrarError(planSelect, 'errorPlan');
            return false;
        } else {
            ocultarErrores(planSelect, ['errorPlan']);
        }
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
        const response = await fetch('/pacientes/verificarDNI', {
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
