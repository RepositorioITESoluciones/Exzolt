$(function () {
    initEventos();
    initDataTable();
});

function initEventos() {
    $('#btnPlus').click(function () {
        limpiaDivs();
        validateForm();
        $('#FormPerfil').data('bootstrapValidator').resetForm();
        document.getElementById("FormPerfil").reset();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $("#tituloOperacion").html('Crear Perfil');
    });

    $('#btnAtras').click(function () {
        $('#FormPerfil').data('bootstrapValidator').resetForm();
        document.getElementById("FormPerfil").reset();
        limpiaDivs();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    $('#btnguardar').click(function () {
        var row = $("#detallePerfil").DataTable().row('.selected').data();
        if (row) {
            editPerfil();
        } else {
            var valido;
            valido = validateForm();
            if (valido) {
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'WSLinPro.asmx/insertaPerfilWs',
                    data: $('#FormPerfil').serializeArray(),
                    success: function () {
                        $.smallBox({
                            title: "Éxito!",
                            content: "Rol <b>" + $('#descripcion').val() + "</b> agregado",
                            color: "#739e73",
                            timeout: 2000,
                            icon: "fa fa-thumbs-up swing animated"
                        });
                        llenaDataTable();
                    }
                });
                $('#FormPerfil').data('bootstrapValidator').resetForm();
                $('#divTiposTransaccion').show();
                $('#FormularioAlta').hide();
            } else {
                $('#divTiposTransaccion').hide();
                $('#FormularioAlta').show();
            }
        }
    });

    $("#btnEdit").click(function () {
        var row = $("#detallePerfil").DataTable().row('.selected').data();
        if (row) {
            setObject(row);
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
            $("#tituloOperacion").html('Editar Perfil');
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    })

    $("#btnDelete").click(function () {
        var row = $('#detallePerfil').DataTable().row('.selected').data();
        if (row) {
            var idPerfil = row[0];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el rol <b>" + row[1] + "</b>?",
                content: "Una vez eliminada la Transacción no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/eliminarPerfilWs',
                        data: JSON.stringify({ idPerfil: idPerfil }),
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
    })
}

function setObject(row) {
    $("#idPerfil").val(row[0]);
    $("#nombre").val(row[1]);
    $("#descripcion").val(row[2]);
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
        url: 'WSLinPro.asmx/LlenaTablaPerfiles',
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
                $.each(index.listaPerfiles, function (r, arr) {
                    datos.push([arr.idPerfil, arr.nombre, arr.descripcion]);
                });
            });
        }
    });
    var otable = $('#detallePerfil').DataTable({
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
        "columnDefs": [
            { "width": "20%", "targets": 0 }
        ],
        "preDrawCallback": function () {
            if (!responsiveHelper_datatable_fixed_column) {
                responsiveHelper_datatable_fixed_column = new ResponsiveDatatablesHelper(
                    $('#detallePerfil'), breakpointDefinition);
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
            title: "Rol"
        },
        {
            title: "Descripción"
        }
        ]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#detallePerfil thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#detallePerfil tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#detallePerfil').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });
    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#detallePerfil tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        var row = $("#detallePerfil").DataTable().row('.selected').data();
        setObject(row);
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $("#tituloOperacion").html('Editar Perfil');
    });
}

function llenaDataTable() {
    var otable = $('#detallePerfil').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaPerfiles',
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
                $.each(index.listaPerfiles, function (index, item) {
                    datos.push([item.idPerfil, item.nombre, item.descripcion]);
                });
            });
        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}


function editPerfil() {
    var valido;
    valido = validateForm();
    if (valido) {
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/actualisarPerfilWs',
            data: {
                nombre: $("#nombre").val(),
                descripcion: $("#descripcion").val(),
                idPerfil: $("#idPerfil").val()
            },
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Rol <b>" + $("#descripcion").val() + "</b> Editado",
                    color: "#739e73",
                    timeout: 2000,
                    icon: "fa fa-thumbs-up swing animated"
                });
                llenaDataTable();
            }
        });
        $('#FormPerfil').data('bootstrapValidator').resetForm();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    }
}

function validateForm() {
    $("#FormPerfil").bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            nombre: {
                selector: '#nombre',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El nombre del rol es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            desc: {
                selector: '#descripcion',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'La descripción del rol es requerida'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            }
            //
        }
    });
    $('#FormPerfil').data('bootstrapValidator').validate();
    var valido = $('#FormPerfil').data('bootstrapValidator').isValid();
    return valido;
}

function limpiaDivs() {
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-success');
}