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
    const profesional = document.querySelector('#profesional');
    const paciente = document.querySelector('#paciente');
    const obrasocial = document.querySelector('#obraSocial');
    const diagnostico = document.querySelector('#diagnostico');
    const vigencia = document.querySelector('#vigencia');
    const medicamentos = document.querySelectorAll('#medicamentoList li');
    const prestaciones = document.querySelectorAll('#prestacionList li');
    const observaciones = document.querySelector('#observaciones');

    if (profesional.value === "") {
        mostrarError(profesional, 'errorProfesional');
        return false;
    } else {
        ocultarErrores(profesional, ['errorProfesional']);
    }

    if (paciente.value === "") {
        mostrarError(paciente, 'errorPaciente');
        return false;
    } else {
        ocultarErrores(paciente, ['errorPaciente']);
    }

    if (obrasocial.value === "") {
        mostrarError(obrasocial, 'errorObraSocial');
        return false;
    } else {
        ocultarErrores(obrasocial, ['errorObraSocial']);
    }

    if (diagnostico.value.trim() === "") {
        mostrarError(diagnostico, 'errorDiagnostico');
        return false;
    } else {
        ocultarErrores(diagnostico, ['errorDiagnostico']);
    }
    if (medicamentos.length === 0 && prestaciones.length === 0) {
        mostrarError(document.querySelector('.medicamento-list'), 'errorDatos');
        return false;
    } else {
        ocultarErrores(document.querySelector('.medicamento-list'), ['errorDatos']);
    }


    if (observaciones) {
        if (observaciones.value.trim() > 300) {
            mostrarError(observaciones, 'errorObservaciones');
            return false;
        } else {
            ocultarErrores(observaciones, ['errorObservaciones']);
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