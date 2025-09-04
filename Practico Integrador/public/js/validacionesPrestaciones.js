document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form-container');
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        if (await validarCampos()) {
            form.submit(); 
        } else {
            console.log('Campos inválidos');
        }
    });
});

const validarCampos =  async () => {
    const id = document.querySelector('[name="prestacionId"]').value;
    const nombre = document.querySelector('#nombre');
    const indicacion = document.querySelector('#indicacion');

    if (nombre.value.trim().length < 3 || nombre.value.trim().length > 50) {
        mostrarError(nombre, 'errorNombre');
        return false;
    } else {
        if (!isNaN(nombre.value)) {
            mostrarError(nombre, 'errorNombreNum');
            return false;
        } else {
            const nombreUnico = await verificarNombreUnico(nombre.value.trim(),id);
            if (!nombreUnico) {
                mostrarError(nombre, 'errorNombreRepetido');
                return false;
            } else {
                ocultarErrores(nombre, ['errorNombre', 'errorNombreNum', 'errorNombreRepetido']);
            };
        };
    };

    if (indicacion.selectedOptions.length === 0) {
        mostrarError(indicacion, 'errorIndicacion');
        return false;
    } else {
        ocultarErrores(indicacion, ['errorIndicacion']);
    };
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

const verificarNombreUnico = async (nombre,id) => {
    try {
        const response = await fetch('/prestaciones/verificarNombre', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre,id })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.esUnico;
    } catch (error) {
        console.error('Error al verificar el nombre:', error);
        return false;
    }
};