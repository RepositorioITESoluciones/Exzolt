$(function () {
    initEventos();
    initDataTable();
    llenaComboMarca();
    $('#anio').datetimepicker({
        viewMode: 'years',
        format: 'YYYY'
    });
});

function initEventos() {
    $('#btnPlus').click(function () {
        var row = $("#detalleModelo").DataTable().row('.selected').data();
        if (row) {
            $('#detalleModelo').DataTable().$('tr.selected').removeClass('selected');
        }
        limpiaDivs();
        validateForm();
        document.getElementById("FormModelo").reset();
        $("#marca").val(0).trigger('change');
        $('#FormModelo').data('bootstrapValidator').resetForm();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $("#tituloOperacion").html('Crear Módelo');
    });

    $('#btnAtras').click(function () {
        limpiaDivs();
        $('#FormModelo').data('bootstrapValidator').resetForm();
        document.getElementById("FormModelo").reset();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    $('#btnguardar').click(function () {
        var row = $("#detalleModelo").DataTable().row('.selected').data();
        if (row) {
            editModelo();
        } else {
            var valido = validateForm();
            if (valido) {
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'WSLinPro.asmx/insertaModeloMaquinaWs',
                    data: $('#FormModelo').serializeArray(),
                    success: function () {
                        $.smallBox({
                            title: "Éxito!",
                            content: "Módelo <b>" + $('#modelo').val() + "</b> agregado",
                            color: "#739e73",
                            timeout: 2000,
                            icon: "fa fa-thumbs-up swing animated"
                        });
                        llenaDataTable();
                    }
                });
                $('#FormModelo').data('bootstrapValidator').resetForm();
                $('#divTiposTransaccion').show();
                $('#FormularioAlta').hide();
            } else {
                $('#divTiposTransaccion').hide();
                $('#FormularioAlta').show();
            }
        }
    });

    $("#btnEdit").click(function () {
        limpiaDivs();
        var row = $("#detalleModelo").DataTable().row('.selected').data();
        if (row) {
            setObject(row);
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
            $("#tituloOperacion").html('Editar Módelo');
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar un elemento</i>');
        }
    });

    $("#btnDelete").click(function () {
        var row = $('#detalleModelo').DataTable().row('.selected').data();
        if (row) {
            var idModeloMaquina = row[0];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el módelo <b>" + row[1] + "</b>?",
                content: "Una vez eliminada la Transacción no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/eliminarModeloMaquinaWs',
                        data: JSON.stringify({ idModeloMaquina: idModeloMaquina }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (output) {
                            $.each(output, function (j, cam) {
                                showOkMessage('Transacción Eliminada', 'Se ha Eliminado la Transacción <b>' + row[1] + '<b>');
                                llenaDataTable();
                            });
                        },
                        error: function (e) {
                            console.log("error");
                        }
                    });
                } else {
                    $('#bot1-Msg1').prop('disabled', true);
                }
            });
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar un elemento</i>');
        }
    });
}

function setObject(row) {
    $("#idModelo").val(row[0]);
    $("#modelo").val(row[1]);
    $("#descripcion").val(row[2]);
    $("#anio").val(row[3]);
    $("#marca").val(row[4]).trigger('change');
}

function initDataTable() {
    $.fn.dataTable.ext.errMode = 'none';
    var responsiveHelper_datatable_fixed_column = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480,
        desktop: 1260
    };
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaModelosMAquina',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#loadingMod').modal({
                backdrop: 'static',
                keyboard: false
            });
        },
        success: function (response) {
            $('#loadingMod').modal('hide');
            $.each(response, function (row, index) {
                $.each(index.listaModelos, function (r, arr) {
                    datos.push([arr.idModeloMaquina, arr.nombre, arr.descripcion, arr.anio, arr.marca.idMarca, arr.marca.descripcion]);
                });
            });
        }
    });
    var otable = $('#detalleModelo').DataTable({
        "aLengthMenu": [
            [5, 10, 25, 50],
            [5, 10, 25, 50]
        ],
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6 hidden-xs'l><'col-sm-6 col-xs-12 hidden-xs'<'toolbar'>>r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
        "oLanguage": {
            "sUrl": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "autoWidth": true,
        "preDrawCallback": function () {
            if (!responsiveHelper_datatable_fixed_column) {
                responsiveHelper_datatable_fixed_column = new ResponsiveDatatablesHelper(
                    $('#detalleModelo'), breakpointDefinition);
            }
        },
        "rowCallback": function (nRow) {
            responsiveHelper_datatable_fixed_column
                .createExpandIcon(nRow);
        },
        "drawCallback": function (oSettings) {
            responsiveHelper_datatable_fixed_column.respond();
        },
        data: datos,
        columns: [{
            title: "id",
            visible: false
        },
        {
            title: "Módelo"
        },
        {
            title: "Descripción"
        },
        {
            title: "Año"
        },
        {
            title: "idMarca",
            visible: false
        },
        {
            title: "Marca"
        }
        ]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#detalleModelo thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#detalleModelo tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#detalleModelo').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });
    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#detalleModelo tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        var row = $("#detalleModelo").DataTable().row('.selected').data();
        setObject(row);
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $("#tituloOperacion").html('Editar Módelo');
    });
}

function llenaDataTable() {
    var otable = $('#detalleModelo').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaModelosMAquina',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#loadingMod').modal({
                backdrop: 'static',
                keyboard: false
            });
        },
        success: function (response) {
            $('#loadingMod').modal('hide');
            $.each(response, function (row, index) {
                $.each(index.listaModelos, function (index, item) {
                    datos.push([item.idModeloMaquina, item.nombre, item.descripcion, item.anio, item.marca.idMarca, item.marca.descripcion]);
                });
            });
        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}

function llenaComboMarca() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboMarcaWS',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (dataList) {
            html = '<option value="0">Selecciona una marca</option>';
            $.each(dataList, function (index, list) {
                $.each(list.listaMarca, function (index, item) {
                    html += '<option value="' + item.idMarca + '">' + item.descripcion + '</option>';
                });
                $("#marca").html(html);
            });
        }
    });
}

function editModelo() {
    var valido;
    valido = validateForm();
    if (valido) {
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/actualisarModeloMaquinaWs',
            data: {
                nombre: $("#modelo").val(),
                descripcion: $("#descripcion").val(),
                anio: $("#anio").val(),
                idMarca: $("#marca").val(),
                idModeloMaquina: $("#idModelo").val()
            },
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Módelo <b>" + $("#modelo").val() + "</b> Editado",
                    color: "#739e73",
                    timeout: 2000,
                    icon: "fa fa-thumbs-up swing animated"
                });
                llenaDataTable();
            }
        });
        $('#FormModelo').data('bootstrapValidator').resetForm();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    } else {
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    }
}

function validateForm() {
    $("#FormModelo").find('#anio').focus(function (e) {
        $('#FormModelo').bootstrapValidator('revalidateField', 'anio');
    }).end().
        bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            modelo: {
                selector: '#modelo',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El nombre del módelo es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            descripcion: {
                selector: '#descripcion', 
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'La descripción del módelo es requerida'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            anio: {
                selector: '#anio',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El año del módelo es requerido'
                    },
                }
            },
            marca: {
                selector: '#marca',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una marca',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false
                            } else {
                                return true
                            }
                        }
                    }
                }
            }
        }
    });

    $('#FormModelo').data('bootstrapValidator').validate();
    var valido = $('#FormModelo').data('bootstrapValidator').isValid();
    return valido;
}

function limpiaDivs() {
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-success');
}