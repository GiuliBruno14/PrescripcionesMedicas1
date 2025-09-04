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
    const id = document.querySelector('[name="medicamentoId"]').value;
    const nombreGenerico = document.querySelector('#nombreGenerico');
    const categoria = document.querySelector('#categoria');
    const familia = document.querySelector('#familia');
    const concentracion = document.querySelector('#concentracion');
    const formaFarmaceutica = document.querySelector('#formaFarmaceutica');
    const presentacion = document.querySelector('#presentacion');

    if (nombreGenerico.value.trim().length < 3 || nombreGenerico.value.trim().length > 30) {
        mostrarError(nombreGenerico, 'errorNombreG');
        return false;
    } else {
        if (!isNaN(nombreGenerico.value)) {
            mostrarError(nombreGenerico, 'errorNombreGNum');
            return false;
        } else {
            const nombreUnico = await verificarNombreGenericoUnico(nombreGenerico.value.trim(),id);
            if (!nombreUnico) {
                mostrarError(nombreGenerico, 'errorNombreGRepetido');
                return false;
            } else {
                ocultarErrores(nombreGenerico, ['errorNombreG', 'errorNombreGNum', 'errorNombreGRepetido']);
            };
        };
    };

    if (concentracion.selectedOptions.length === 0) {
        mostrarError(concentracion, 'errorConcentracion');
        return false;
    } else {
        ocultarErrores(concentracion, ['errorConcentracion']);
    }

    if (formaFarmaceutica.selectedOptions.length === 0) {
        mostrarError(formaFarmaceutica, 'errorFormaFarmaceutica');
        return false;
    } else {
        ocultarErrores(formaFarmaceutica, ['errorFormaFarmaceutica']);
    }

    if (presentacion.selectedOptions.length === 0) {
        mostrarError(presentacion, 'errorPresentacion');
        return false;
    } else {
        ocultarErrores(presentacion, ['errorPresentacion']);
    }

    if (categoria.selectedOptions.length === 0) {
        mostrarError(categoria, 'errorCategoria');
        return false;
    } else {
        ocultarErrores(categoria, ['errorCategoria']);
    }

    if (familia.selectedOptions.length === 0) {
        mostrarError(familia, 'errorFamilia');
        return false;
    } else {
        ocultarErrores(familia, ['errorFamilia']);
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

const verificarNombreGenericoUnico = async (nombreGenerico,id) => {
    try {
        const response = await fetch('/medicamentos/verificarNombreGenerico', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreGenerico,id })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.esUnico;
    } catch (error) {
        console.error('Error al verificar el nombre genérico:', error);
        return false;
    }
};

