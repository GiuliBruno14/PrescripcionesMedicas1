$(document).ready(function () {
    $('#profesional, #paciente, #obraSocial, #medicamento, #prestacion, #medicamentoC, #medicamentoF, #medicamentoP, #prestacionI, #lado').select2({
        placeholder: "Selecciona una opción",
        allowClear: true,
    });

    $('#paciente').change(function () {
        const pacienteId = $(this).val();
        $('#plan').val('');
        if (pacienteId) {
            $.ajax({
                url: '/pacientes/datos/' + pacienteId,
                type: 'GET',
                success: function (obrasSociales) {
                    const $obraSocialSelect = $('#obraSocial');
                    $obraSocialSelect.empty();
                    $obraSocialSelect.append('<option value="">Selecciona una obra social</option>');
                    if (obrasSociales.length > 0) {
                        obrasSociales.forEach(function (obraSocial) {
                            $obraSocialSelect.append('<option value="' + obraSocial.id + '">' + obraSocial.nombre + '</option>');
                        });
                        $obraSocialSelect.prop('disabled', false);
                    } else {
                        $obraSocialSelect.prop('disabled', true);
                        $obraSocialSelect.append('<option value="sin_obra_social">Sin Obra Social</option>');
                        $obraSocialSelect.val('sin_obra_social');
                        const $planInput = $('#plan');
                        $planInput.val("No disponible");
                    }
                },
                error: function (err) {
                    console.error('Error al obtener obras sociales del paciente:', err);
                }
            });
        } else {
            $('#obraSocial').empty().append('<option value="">Selecciona una obra social</option>');
            $('#plan').val('');
        }
    });

    $('#obraSocial').change(function () {
        const pacienteId = $('#paciente').val();
        const obraSocialId = $(this).val();
        if (obraSocialId && pacienteId) {
            $.ajax({
                url: `/pacientes/datos/${pacienteId}/${obraSocialId}`,
                type: 'GET',
                success: function (planes) {
                    const $planInput = $('#plan');
                    $planInput.val('');
                    if (planes.length > 0) {
                        $planInput.val(planes[0].nombre);
                    } else {
                        alert('No hay planes disponibles para esta obra social.');
                    }
                },
                error: function (err) {
                    console.error('Error al obtener planes de la obra social:', err);
                }
            });
        } else {
            $('#plan').val('');
        }
    });
    $('#medicamento').change(function () {
        const medicamentoId = $(this).val();
        if (medicamentoId) {
            $.ajax({
                url: '/datos/medicamento/' + medicamentoId,
                type: 'GET',
                success: function (detalles) {
                    const concentraciones = detalles.concentraciones.split(', ');
                    const formasFarmaceuticas = detalles.formas_farmaceuticas.split(', ');
                    const presentaciones = detalles.presentaciones.split(', ');
                    const $concentracionSelect = $('#medicamentoC');
                    const $formaFarmaceuticaSelect = $('#medicamentoF');
                    const $presentacionSelect = $('#medicamentoP');

                    $concentracionSelect.empty();
                    $formaFarmaceuticaSelect.empty();
                    $presentacionSelect.empty();

                    $concentracionSelect.append('<option value="">Selecciona una concentración</option>');
                    $formaFarmaceuticaSelect.append('<option value="">Selecciona una forma farmacéutica</option>');
                    $presentacionSelect.append('<option value="">Selecciona una presentación</option>');

                    concentraciones.forEach(function (concentracion) {
                        const [id, text] = concentracion.split(': ');
                        $concentracionSelect.append('<option value="' + id + '">' + text + '</option>');
                    });
                    formasFarmaceuticas.forEach(function (forma) {
                        const [id, text] = forma.split(': ');
                        $formaFarmaceuticaSelect.append('<option value="' + id + '">' + text + '</option>');
                    });
                    presentaciones.forEach(function (presentacion) {
                        const [id, text] = presentacion.split(': ');
                        $presentacionSelect.append('<option value="' + id + '">' + text + '</option>');
                    });
                },
                error: function (err) {
                    console.error('Error al obtener detalles del medicamento:', err);
                }
            });
        } else {
            $('#medicamentoC').empty().append('<option value="">Selecciona una concentración</option>');
            $('#medicamentoF').empty().append('<option value="">Selecciona una forma farmacéutica</option>');
            $('#medicamentoP').empty().append('<option value="">Selecciona una presentación</option>');
        }
    });

    // Añadir medicamento
    $('#addMedicamento').click(function () {
        const medicamentoId = $('#medicamento').val();
        const medicamentoNombre = $('#medicamento option:selected').text();
        const concentracion = $('#medicamentoC').val();
        const concentracionText = $('#medicamentoC option:selected').text();
        const formaFarmaceutica = $('#medicamentoF').val();
        const formaFarmaceuticaText = $('#medicamentoF option:selected').text();
        const presentacion = $('#medicamentoP').val();
        const presentacionText = $('#medicamentoP option:selected').text();
        const dosis = $('#dosis').val();
        const intervalo = $('#intervalo').val();
        const unidad = $('#unidad').val();
        const cantidad = $('#cantidad').val();
        const tiempo = $('#tiempo').val();
        let valid = true;
        if (!medicamentoId) {
            mostrarError($('#medicamento'), 'errorMedicamento');
            valid = false;
        } else {
            ocultarErrores('errorMedicamento');
        }

        if (!concentracion) {
            mostrarError($('#medicamentoC'), 'errorConcentracion');
            valid = false;
        } else {
            ocultarErrores('errorConcentracion');
        }

        if (!formaFarmaceutica) {
            mostrarError($('#medicamentoF'), 'errorFormaFarmaceutica');
            valid = false;
        } else {
            ocultarErrores('errorFormaFarmaceutica');
        }

        if (!presentacion) {
            mostrarError($('#medicamentoP'), 'errorPresentacion');
            valid = false;
        } else {
            ocultarErrores('errorPresentacion');
        }

        if (!dosis || !intervalo || !unidad || isNaN(dosis) || isNaN(intervalo)) {
            mostrarError($('#dosis'), 'errorDosis');
            valid = false;
        } else {
            ocultarErrores('errorDosis');
        }

        if (!cantidad || !tiempo || isNaN(cantidad)) {
            mostrarError($('#duracion'), 'errorDuracion');
            valid = false;
        } else {
            ocultarErrores('errorDuracion');
        }

        if (!valid) {
            return;
        }
        let duplicado = false;
        $('#medicamentoList li').each(function () {
            const $inputs = $(this).find('input');
            const itemMedicamentoId = $inputs.filter('input[name^="medicamentos["][name$="[medicamento]"]').val();

            if (itemMedicamentoId === medicamentoId) {
                duplicado = true;
                mostrarError($('#errorMedRepetido'), 'errorMedRepetido');
                return false;
            }
        });
        if (duplicado) {
            return;
        }
        ocultarErrores('errorMedRepetido');

        const medicamentoItem = `
        <li>
            ${medicamentoNombre} - ${concentracionText} - ${formaFarmaceuticaText} - ${presentacionText} Dosis: ${dosis} cada ${intervalo} ${unidad} Duración: ${cantidad} ${tiempo}
            <input type="hidden" name="medicamentos[${medicamentoId}][medicamento]" value="${medicamentoId}">
            <input type="hidden" name="medicamentos[${medicamentoId}][concentracion]" value="${concentracion}">
            <input type="hidden" name="medicamentos[${medicamentoId}][forma_farmaceutica]" value="${formaFarmaceutica}">
            <input type="hidden" name="medicamentos[${medicamentoId}][presentacion]" value="${presentacion}">
            <input type="hidden" name="medicamentos[${medicamentoId}][dosis]" value="${dosis}">
            <input type="hidden" name="medicamentos[${medicamentoId}][intervalo]" value="${intervalo}">
            <input type="hidden" name="medicamentos[${medicamentoId}][unidad]" value="${unidad}">
            <input type="hidden" name="medicamentos[${medicamentoId}][cantidad]" value="${cantidad}">
            <input type="hidden" name="medicamentos[${medicamentoId}][tiempo]" value="${tiempo}"> 
            <button type="button" class="btn-eliminar">x</button>
        </li>
    `;
        $('#medicamentoList').append(medicamentoItem);
        // Restablecer campos
        $('#medicamento').val('').trigger('change');
        $('#medicamentoC').empty().append('<option value="">Selecciona una concentración</option>');
        $('#medicamentoF').empty().append('<option value="">Selecciona una forma farmacéutica</option>');
        $('#medicamentoP').empty().append('<option value="">Selecciona una presentación</option>');
        $('#dosis').val('');
        $('#intervalo').val('');
        $('#unidad').val('');
        $('#cantidad').val('');
        $('#tiempo').val('');
    });
    // Eliminar medicamento
    $(document).on('click', '.btn-eliminar', function () {
        $(this).closest('li').remove();
    });
    // Selección de prestación
    $('#prestacion').change(function () {
        const prestacionId = $(this).val();
        if (prestacionId) {
            $.ajax({
                url: '/datos/prestacion/' + prestacionId,
                type: 'GET',
                success: function (detalles) {
                    const indicaciones = detalles.indicaciones ? detalles.indicaciones.split(', ') : [];
                    const $indicacionSelect = $('#prestacionI');
                    $indicacionSelect.empty();
                    $indicacionSelect.append('<option value="">Selecciona una indicación</option>');
                    indicaciones.forEach(function (indicacion) {
                        const [id, nombre] = indicacion.split('-');
                        $indicacionSelect.append('<option value="' + id + '">' + nombre + '</option>');
                    });
                },
                error: function (err) {
                    console.error('Error al obtener detalles de la prestación:', err);
                }
            });
        } else {
            $('#prestacionI').empty().append('<option value="">Selecciona una indicación</option>');
        }
    });

    // Añadir prestación
    $('#addPrestacion').click(function () {
        const prestacion = $('#prestacion');
        const prestacionI = $('#prestacionI');
        const justificacion = $('#justificacion');

        const prestacionId = prestacion.val();
        const prestacionNombre = prestacion.find('option:selected').text();
        const indicacion = prestacionI.val();
        const indicacionText = prestacionI.find('option:selected').text();
        const lado = $('#lado').val();
        const ladoText = $('#lado option:selected').text();
        const justificacionVal = justificacion.val();

        let valid = true;
        if (!prestacionId) {
            mostrarError($('#prestacion'), 'errorPrestacion');
            valid = false;
        } else {
            ocultarErrores('errorPrestacion');
        }

        if (!indicacion) {
            mostrarError($('#prestacionI'), 'errorIndicacion');
            valid = false;
        } else {
            ocultarErrores('errorIndicacion');
        }

        if (!justificacionVal || justificacionVal.trim() === '' || justificacionVal.trim().length < 3 || justificacionVal.trim().length > 100) {
            mostrarError($('#justificacion'), 'errorJustificacion');
            valid = false;
        } else {
            ocultarErrores('errorJustificacion');
        }

        if (!valid) {
            return;
        }
        let duplicado = false;
        $('#prestacionList li').each(function () {
            const $inputs = $(this).find('input');
            const itemPrestacionId = $inputs.filter('input[name^="prestaciones["][name$="[prestacion]"]').val();

            if (itemPrestacionId === prestacionId) {
                duplicado = true;
                mostrarError($('#errorPresRepetida'), 'errorPresRepetida');
                return false;
            }
        });
        if (duplicado) {
            return;
        }
        ocultarErrores('errorPresRepetida');
       


        const prestacionItem = `
            <li>
                ${prestacionNombre} - ${indicacionText} ${lado ? '- Lado: ' + ladoText : ''} Justificación: ${justificacionVal}
                <input type="hidden" name="prestaciones[${prestacionId}][prestacion]" value="${prestacionId}">
                <input type="hidden" name="prestaciones[${prestacionId}][indicacion]" value="${indicacion}">
                <input type="hidden" name="prestaciones[${prestacionId}][lado]" value="${lado}">
                <input type="hidden" name="prestaciones[${prestacionId}][justificacion]" value="${justificacionVal}">
                <button type="button" class="btn-eliminar">x</button>
            </li>
        `;
        $('#prestacionList').append(prestacionItem);

        // Restablecer campos
        prestacion.val('').trigger('change');
        prestacionI.empty().append('<option value="">Selecciona una indicación</option>');
        $('#lado').val('').trigger('change');
        justificacion.val('');
    });

    // Eliminar prestación
    $(document).on('click', '.btn-eliminar', function () {
        $(this).closest('li').remove();
    });

    function mostrarError(elemento, idError) {
        const errorElement = document.getElementById(idError);
        if (errorElement) {
            errorElement.style.display = 'inline';
        } else {
            console.error("El elemento de error no fue encontrado:", idError);
        }
        elemento.addClass('campoerror');
        elemento.focus();
    }

    function ocultarErrores(idError) {
        const elemento = document.querySelector(`#${idError}`);
        if (elemento) {
            elemento.style.display = 'none';
            elemento.classList.remove('campoerror');
        } else {
            console.error("Elemento no encontrado para ocultar errores.");
        }
    }
});