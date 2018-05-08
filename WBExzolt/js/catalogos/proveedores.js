$(function () {
    llenaComboEstado();
    initEventos();
    initDataTable();
    llenaComboTipoProveedor();
    llenaComboTipoPersona();
    //$('#estado').select2();
    //$('#estado + span').css("width", "100%");
    //$('#cp').select2();
    //$('#cp + span').css("width", "100%");
    $('#fechaAlta').datetimepicker({
        format: 'DD/MM/YYYY'
    });
    $('#fechaBaja').datetimepicker({
        format: 'DD/MM/YYYY'
    });

});

function initEventos() {
    $('#btnPlus').click(function () {
        var row = $("#detalleProveedor").DataTable().row('.selected').data();
        if (row) {
            $('#detalleProveedor').DataTable().$('tr.selected').removeClass('selected');
        }
        limpiaDivs();
        validateForm();
        validaFechaBaja();
        document.getElementById("FormProveedor").reset();
        $("#tipo").val(0).trigger('change');
        $("#tipoPer").val(0).trigger('change');
          $("#cp").val(0).trigger('change')
        $('#FormProveedor').data('bootstrapValidator').resetForm();
        //$('#tipo').find("option[value='0']").attr("selected", true);
        //$('#tipoPer').find("option[value='0']").attr("selected", true);
        $("#divFechaBaja").hide();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $("#tituloOperacion").html('Crear Proveedor');
    });

    $('#btnAtras').click(function () {
        $('#FormProveedor').data('bootstrapValidator').resetForm();
        document.getElementById("FormProveedor").reset();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    $('#btnguardar').click(function () {
        var row = $("#detalleProveedor").DataTable().row('.selected').data();
        var provedor = $('#proveedor').val();
        console.log(provedor);
        if (row) {
            editProveedor();
        } else {
            var valido = validateForm();
            if (valido) {
                console.log(JSON.stringify($('#FormProveedor').serializeArray()));
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'WSLinPro.asmx/insertaProveedorWs',
                    data: $('#FormProveedor').serializeArray(),
                    //   data: "{'proveedor':'" + provedor + "','tipo':'" + $('#tipo').val() + "','rfc':'" + $('#rfc').val() + "','razon':'" + $('#razon').val() + "','idEstado':'" + $('#idEstado').val() + "','cp':'" + $('#cp').val() + "','calle':'" + $('#calle').val() + "','ext':'" + $('#ext').val() + "','interior':'" + $('#interior').val() + "','tipoPer':'" + $('#tipoPer').val() + "','fechaAlta':'" + $('#fechaAlta').val() + "'}",
                    //dataType: 'json',
                    success: function () {
                        $.smallBox({
                            title: "Éxito!",
                            content: "Proveedor <b>" + $('#proveedor').val() + "</b> agregado",
                            color: "#739e73",
                            timeout: 2000,
                            icon: "fa fa-thumbs-up swing animated"
                        });
                        llenaDataTable();
                    }
                });
                $('#FormProveedor').data('bootstrapValidator').resetForm();
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
        $('#FormProveedor').data('bootstrapValidator').resetForm();
        var row = $("#detalleProveedor").DataTable().row('.selected').data();
        if (row) {
            setObject(row);
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
            $("#tituloOperacion").html('Editar Proveedor');
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar un elemento</i>');
        }
    });

    $("#btnDelete").click(function () {
        var row = $('#detalleProveedor').DataTable().row('.selected').data();
        if (row) {
            var idProveedor = row[0];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el proveedor <b>" + row[2] + "</b>?",
                content: "Una vez eliminada la Transacción no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/eliminarProveedorWs',
                        data: JSON.stringify({ idProveedor: idProveedor }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (output) {
                            $.each(output, function (j, cam) {
                                showOkMessage('Transacción Eliminada', 'Se ha Eliminado la Transacción <b>' + row[4] + '<b>');
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

function initDataTable() {
    $.fn.dataTable.ext.errMode = 'none';
    var responsiveHelper_datatable_fixed_column = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480,
        desktop: 1500
    };
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaProveedor',
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
                $.each(index.listaProveedores, function (r, arr) {
                    datos.push([arr.idProveedor, arr.tipoProveedor.idTipoProveedor, arr.datosFiscales.IdDatosFiscales, arr.fechaAlta, arr.nombre, arr.tipoProveedor.descripcion, arr.datosFiscales.RFC, arr.datosFiscales.RazonSocial, arr.datosFiscales.C_CP, arr.datosFiscales.Calle, arr.estado.idEstado, arr.estado.descripcion, arr.tipoPersona.IdTipoPersona, arr.datosFiscales.NumeroExterior, arr.datosFiscales.NumeroInterior, arr.tipoPersona.TipoPersona]);
                });
            });
        }
    });
    var otable = $('#detalleProveedor').DataTable({
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
        //"preDrawCallback": function () {
        //    if (!responsiveHelper_datatable_fixed_column) {
        //        responsiveHelper_datatable_fixed_column = new ResponsiveDatatablesHelper(
        //            $('#detalleProveedor'), breakpointDefinition);
        //    }
        //},
        //"rowCallback": function (nRow) {
        //    responsiveHelper_datatable_fixed_column
        //        .createExpandIcon(nRow);
        //},
        //"drawCallback": function (oSettings) {
        //    responsiveHelper_datatable_fixed_column.respond();
        //},
        data: datos,
        columns: [{
            title: "id",
            visible: false
        }, {
            title: "idDatosFiscales",
            visible: false
        },
        {
            title: "idTipoProveedor",
            visible: false
        },
        {
            title: "fecha Alta",
            "render": function (data, type, row) {
                var fechaAlta = datetimeToDateFormat(data);
                return fechaAlta;
            }
        },
        {
            title: "Nombre"
        },
        {
            title: "Tipo Proveedor"
        },
        {
            title: "RFC"
        },
        {
            title: "Razón Social"
        },
        {
            title: "Código postal"
        },
        {
            title: "Calle"
        },
        {
            title: "idEstado",
            visible: false
        },
        {
            title: "Estado"
        },
        {
            title: "idTipoPersona",
            visible: false
        },
        {
            title: "No# Exterior"
        },
        {
            title: "No# Interior"
        },
        {
            title: "Tipo Persona"
        },
        {
            title: "fechaBaja",
            visible: false
        }
        ]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#detalleProveedor thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#detalleProveedor tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#detalleProveedor').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });
    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#detalleProveedor tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        $("#divFechaBaja").show();
        var row = $("#detalleProveedor").DataTable().row('.selected').data();
        setObject(row);
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $("#tituloOperacion").html('Editar Modelo');
    });
}

function setObject(row) {
    console.log(row);
    console.log(row[12]);

    var fechaAlta = datetimeToDateFormat(row[3]);
    var fechaBaja = datetimeToFechaBaja(new Date());

    $("#idProveedor").val(row[0]);
    $("#idDatos").val(row[2]);
    $("#tipo").val(row[1]).trigger('change');
    //$('#tipo').find("option[value='" + row[1] + "']").attr("selected", true);
    $("#fechaAlta").val(fechaAlta);
    $("#fechaBaja").val(fechaBaja);
    $("#proveedor").val(row[4]);
    $("#rfc").val(row[6]);
    $("#razon").val(row[7]);
    //$("#cp").find("option[value='" + row[9] + "']").attr("selected", true);  
    $("#cp").val(row[8]).trigger('change');
    $("#calle").val(row[9]);
    $("#ComboEstado").val(row[10]).trigger('change');
    //$("#ComboEstado").val(row[11]).trigger('change');
    $("#tipoPer").val(row[12]).trigger('change');
    //$('#tipoPer').find("option[value='" + row[12] + "']").attr("selected", true);
    $("#ext").val(row[13]);
    $("#interior").val(row[14]);
}

function llenaDataTable() {
    var otable = $('#detalleProveedor').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaProveedor',
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
                $.each(index.listaProveedores, function (index, item) {
                    datos.push([item.idProveedor, item.tipoProveedor.idTipoProveedor, item.datosFiscales.IdDatosFiscales, item.fechaAlta, item.nombre, item.tipoProveedor.descripcion, item.datosFiscales.RFC, item.datosFiscales.RazonSocial, item.datosFiscales.C_CP, item.datosFiscales.Calle, item.estado.idEstado, item.estado.descripcion, item.tipoPersona.IdTipoPersona, item.datosFiscales.NumeroExterior, item.datosFiscales.NumeroInterior, item.tipoPersona.TipoPersona]);
                });
            });
        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}

function llenaComboTipoProveedor() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboTipoProveedor',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (dataList) {
            html = '<option value="0">Selecciona un tipo proveedor</option>';
            $.each(dataList, function (index, list) {
                $.each(list.listaRegTipoProveedor, function (index, item) {
                    html += '<option value="' + item.idTipoProveedor + '">' + item.descripcion + '</option>';
                });
                $("#tipo").html(html);
            });
        }
    });
}

function llenaComboTipoPersona() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboTipoPersona',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (dataList) {
            html = '<option value="0">Selecciona un tipo persona</option>';
            $.each(dataList, function (index, list) {
                $.each(list.ListaRegTipoPersona, function (index, item) {
                    html += '<option value="' + item.IdTipoPersona + '">' + item.TipoPersona + '</option>';
                });
                $("#tipoPer").html(html);
            });
        }
    });
}

function llenaComboCP() {
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboCodigoPostal',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (dataList) {
            html = '<option value="0">Selecciona un código Postal</option>';
            $.each(dataList, function (index, list) {
                $.each(list.ListaRegistroCP, function (index, item) {
                    html += '<option value="' + item.c_CP + '">' + item.c_CP + '</option>';
                });
                $("#cp").html(html);
            });
        }
    });
}

function getEstadoByCP() {
    var cp = $('#cp').val();
    console.log("llena estados " + cp);
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaEstadoByCP',
        data: JSON.stringify({ cp: cp }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (dataList) {
            html = '<option value="0">Selecciona un código Postal</option>';
            $.each(dataList, function (index, list) {
                $.each(list.ListaRegistrosEstado, function (index, item) {
                    $("#idEstado").val(item.idEstado);
                    $("#estado").val(item.descripcion);
                });

            });
        }
    });
}

function editProveedor() {
    var valido = validateForm();
    if (valido) {
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/ActualisarProveedorWs',
            data: {
                idProveedor: $("#idProveedor").val(),
                idDatos: $("#idDatos").val(),
                ComboEstado: $("#ComboEstado").val(),
                proveedor: $("#proveedor").val(),
                tipo: $('#tipo').val(),
                rfc: $("#rfc").val(),
                razon: $("#razon").val(),
                cp: $("#cp").val(),
                calle: $("#calle").val(),
                ext: $("#ext").val(),
                interior: $("#interior").val(),
                tipoPer: $('#tipoPer').val(),
                fechaAlta: $("#fechaAlta").val(),
                fechaBaja: $("#fechaBaja").val()
            },
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Proveedor <b>" + $("#proveedor").val() + "</b> Editado",
                    color: "#739e73",
                    timeout: 2000,
                    icon: "fa fa-thumbs-up swing animated"
                });
                llenaDataTable();
            }
        });
        $('#FormProveedor').data('bootstrapValidator').resetForm();
        $("#divFechaBaja").hide();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    } else {
        $("#divFechaBaja").show();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    }
}

function validateForm() {
    $("#FormProveedor").find('#fechaAlta').focus(function (e) {
        $('#FormProveedor').bootstrapValidator('revalidateField', 'fechaAlta');
    }).end().
        bootstrapValidator({
            excluded: [':disabled'],
            live: 'enabled',
            submitButtons: 'button[id="btnguardar"]',
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            fields: {
                proveedor: {
                    selector: '#proveedor',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El proveedor es obligatorio'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                tipoProveedor: {
                    selector: '#tipo',
                    group: '.form-group',
                    validators: {
                        callback: {
                            message: 'Selecciona un tipo de proveedor',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                rfc: {
                    selector: '#rfc',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El RFC es obligatorio'
                        },
                        regexp: {
                            regexp: /^([aA-zZñÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[aA-zZñÑ|\&\d]{3})$/,
                            message: 'El RFC no tiene el formato adecuado debe contener 13 caracteres'
                        }
                    }
                },
                RazonSocial: {
                    selector: '#razon',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'La razón social es obligatoria'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                codigoPostal: {
                    selector: '#cp',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El código Postal es obligatorio'
                        },
                        callback: {
                            message: 'Selecciona un código Postal',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                calle: {
                    selector: '#calle',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'La calle es obligatoria'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                noExterior: {
                    selector: '#ext',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El número exterior es obligatorio'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                tipoPersona: {
                    selector: '#tipoPer',
                    group: '.form-group',
                    validators: {
                        callback: {
                            message: 'Selecciona un tipo de persona',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                fechaAlta: {
                    selector: '#fechaAlta',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'La fecha de Alta es obligatoria'
                        },
                    }
                },
            }
        });

    $('#FormProveedor').data('bootstrapValidator').validate();
    var valido = $('#FormProveedor').data('bootstrapValidator').isValid();
    return valido;
}

function validaFechaBaja() {
    if ($("#fechaBaja").length < 1) {
        $("#fechaBaja").parent().addClass("has-error");
        $("#fechaBaja + small").text('Solo caracteres alfanúmericos');

    }
}

function limpiaDivs() {
    $(".form-group > small").css("display", "none");
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-success');
}

function actualizaCP() {
    var idEstado = $('select[id=ComboEstado]').val();
    //alert(JSON.stringify($('#FormAltaPersonal').serializeArray()))
    var html = "";
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboCP',
        data: JSON.stringify({ idEstado: idEstado }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegistroCP, function (index1, item1) {
                    html += '<option value="' + item1.c_CP + '">' + item1.c_CP + '</option>';
                });
            });
            $("#cp").html(html);
        }
    });

}

function llenaComboEstado() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboEstado',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegistrosEstado, function (index1, item1) {

                    html += '<option value="' + item1.idEstado + '">' + item1.descripcion + '</option>';
                });
            });
            $("#ComboEstado").html(html);
        }
    });

}