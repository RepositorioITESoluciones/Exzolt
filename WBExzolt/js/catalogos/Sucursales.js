$(function () {

    initEventos();
    initDataTable();
    llenaComboEmpresa();
    llenaComboEstado();
    llenaComboTP();
});

function initEventos() {
    //boton plus 
    $('#btnPlus').click(function () {
        var row = $("#detalleSucursal").DataTable().row('.selected').data();
        if (row) {
            $('#detalleSucursal').DataTable().$('tr.selected').removeClass('selected');
        }
        limpiaDivs();
        validateForm();
        $('#FormSucursal').data('bootstrapValidator').resetForm();
        document.getElementById("FormSucursal").reset();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $('#btnguardar').show();
    });

    //boton atras
    $('#btnAtras').click(function () {
        $('#FormSucursal').bootstrapValidator('destroy');
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    //boton editar
    $("#btnEdit").click(function () {
        limpiaDivs();
        actualizaCP();
        var row = $("#detalleSucursal").DataTable().row('.selected').data();
        llenaComboEstado();
        llenaComboEmpresa();
        if (row) {
            $("#idSucursal").val(row[0]);
            $("#Nombre").val(row[1]);
            $("#ComboEmpresa").val(row[3]).trigger('change');
            $("#RFC").val(row[5]);
            $("#ComboTPer").val(row[12]).trigger('change');
            $("#Razón Social").val(row[6]);
            $("#Calle").val(row[7]);
            $("#NumExt").val(row[8]);
            $("#NumInt").val(row[9]);
            $("#ComboEstado").val(row[10]).trigger('change');
            $("#ComboCP").val(row[11]).trigger('change');
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    });

    //boton guardar y editar
    $('#btnguardar').click(function () {
        var row = $("#detalleSucursal").DataTable().row('.selected').data();
        if (row) {
            editSucursal();
        } else {
            var valido;
            var duplicado = 0;
            valido = validateForm();
            if (valido) {
                //     console.log(JSON.stringify($('#FormSucursal').serializeArray()));
                $.ajax({
                    async: false,
                    type: 'POST',
                    dataType: "text",
                    url: 'WSLinPro.asmx/InsertarSucursal',
                    data: $('#FormSucursal').serializeArray(),
                    success: function (response) {
                        //console.log(response);
                        var resultadoXML = response.substring(77, response.indexOf('</boolean>'));
                        console.log(resultadoXML);
                        if (resultadoXML == "true") {
                            $.smallBox({
                                title: "Éxito!",
                                content: "Sucursal <b>" + $('#Nombre').val() + "</b> agregado",
                                color: "#739e73",
                                timeout: 2000,
                                icon: "fa fa-thumbs-up swing animated"
                            });
                        } else {
                            duplicado = 1;
                            $.smallBox({
                                title: "Error!",
                                content: "<i>La Sucursal no se agrego (No pueden existir rfc o razon social repetidas)</i>",
                                color: "#C46A69",
                                timeout: 3000,
                                icon: "fa fa-warning shake animated"
                            });
                        }
                        //console.log(response);
                        //initDataTable();
                        llenaDataTable();
                    }
                });
                console.log(duplicado);
                if (duplicado == 0) {
                    $('#FormSucursal').data('bootstrapValidator').resetForm();
                    $('#divTiposTransaccion').show();
                    $('#FormularioAlta').hide();
                } else {
                    $('#divTiposTransaccion').hide();
                    $('#FormularioAlta').show();
                }

            } else {
                $('#divTiposTransaccion').hide();
                $('#FormularioAlta').show();
            }
        }
    });

    //boton borrado
    $("#btnDelete").click(function () {
        var row = $('#detalleSucursal').DataTable().row('.selected').data();
        if (row) {
            var idSucursal = row[0];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> la sucursal <b>" + row[1] + "</b>?",
                content: "Una vez eliminada la Transaccion no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/EliminarSucursal',
                        data: JSON.stringify({ idSucursal: idSucursal }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (output) {
                            $.each(output, function (j, cam) {
                                showOkMessage('Transaccion Eliminada', 'Se ha Eliminado la Transaccion <b>' + row[1] + '<b>');
                                //initDataTable();
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

function limpiaDivs() {
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-success');
}

//Editar Sucursal
function editSucursal() {
    var valido;
    valido = validateForm();
    if (valido) {
        var row = $("#detalleSucursal").DataTable().row('.selected').data();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/ActualizarSucursal',
            data: {
                nombre: $("#Nombre").val(),
                idEmpresa: $("#ComboEmpresa").val(),
                RS: $("#RS").val(),
                TipoPer: $("#ComboTPer").val(),
                RFC: $("#RFC").val(),
                Calle: $("#Calle").val(),
                NumExt: $("#NumExt").val(),
                NumInt: $("#NumInt").val(),
                ComboEstado: $("#ComboEstado").val(),
                ComboCP: $("#ComboCP").val(),
                idSucursal: row[0]
            },
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Sucursal <b>" + $("#Nombre").val() + "</b> Editado",
                    color: "#739e73",
                    timeout: 2000,
                    icon: "fa fa-thumbs-up swing animated"
                });
                llenaDataTable();
                //initDataTable();
            }
        });
        $('#FormSucursal').bootstrapValidator('destroy');
    } else {
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    }
}

//Validaciones
function validaTamanio() {
    document.getElementById("RFC").disabled = false;
    var tipo = $("#ComboTPer").val();
    //alert(tipo);
    if (tipo == 1) {
        document.getElementById("Tamanio").value = 13;
    } else if (tipo == 2) {
        document.getElementById("Tamanio").value = 12;
    } else {
        document.getElementById("Tamanio").value = null;
        document.getElementById("RFC").value = null;
        document.getElementById("RFC").disabled = true;
    }
    validateForm();
}

function validateForm() {
    $('#FormSucursal').bootstrapValidator('destroy');
    var tamanio = $("#Tamanio").val();
    console.log('tamanio: ' + tamanio);

    $("#FormSucursal").bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            descripcion: {
                selector: '#Nombre',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El nombre de la Sucursal es requerido'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El nombre de la Sucursal no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            RFC: {
                selector: '#RFC',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El RFC de la Persona es requerido'
                    },
                    stringLength: {
                        min: tamanio,
                        max: tamanio,
                        message: 'El RFC debe tener ' + tamanio + ' caracteres'
                    },
                    regexp: {
                        regexp: /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))((-)?([A-Z\d]{3}))?$/,
                        message: 'El RFC no es valido'
                    }
                }
            },
            RazonSocial: {
                selector: '#RS',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'La razón Social es requerida'
                    },
                    stringLength: {
                        max: 100,
                        message: 'El razón Social no puede tener mas de 100 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            Calle: {
                selector: '#Calle',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'Calle es requerida'
                    },
                    stringLength: {
                        max: 300,
                        message: 'La Calle no puede tener mas de 300 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            NumExt: {
                selector: '#NumExt',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'Número exterior es requerido'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El Número exterior no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            NumInt: {
                selector: '#NumInt',
                group: '.form-group',
                validators: {
                    stringLength: {
                        max: 50,
                        message: 'El Número interior no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            idTipoPer: {
                selector: '#ComboTPer',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un Tipo de Persona',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            idEstado: {
                selector: '#ComboEstado',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un Estado',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            idCP: {
                selector: '#ComboCP',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un Codigo Postal',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            idEmpresa: {
                selector: '#ComboEmpresa',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una Empresa',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    });

    $('#FormSucursal').data('bootstrapValidator').validate();
    var valido = $('#FormSucursal').data('bootstrapValidator').isValid();
    console.log("llega " + valido);
    return valido;
}

//Iniciar la tabla
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
        url: 'WSLinPro.asmx/LlenaTablaSucursales',
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
                $.each(index.ListaRegistrosSucursal, function (r, arr) {
                    datos.push([arr.idSucursal, arr.nombre, arr.empresa, arr.idEmpresa, arr.idDatosFiscales, arr.DatosFiscales.RFC, arr.DatosFiscales.RazonSocial, arr.DatosFiscales.Calle, arr.DatosFiscales.NumeroExterior, arr.DatosFiscales.NumeroInterior, arr.DatosFiscales.Estado.idEstado, arr.DatosFiscales.C_CP, arr.DatosFiscales.TipoPersona.IdTipoPersona]);
                });
            });
        }
    });
    var otable = $('#detalleSucursal').DataTable({
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
                    $('#detalleSucursal'), breakpointDefinition);
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
            title: "idSucursal",
            visible: false
        },
        {
            title: "Sucursal"
        },
        {
            title: "Empresa"
        },
        {
            title: "idEmpresa",
            visible: false
        },
        {
            title: "idDatosFiscales",
            visible: false
        },
        {
            title: "RFC"
        },
        {
            title: "Razón Social"
        },
        {
            title: "Calle"
        },
        {
            title: "Número Exterior"
        },
        {
            title: "Número Interior"
        },
        {
            title: "idEstado",
            visible: false
        },
        {
            title: "CP"
        },
        {
            title: "idTipoPersona",
            visible: false
        }
        ]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#detalleSucursal thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#detalleSucursal tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#detalleSucursal').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });

    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#detalleSucursal tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        actualizaCP();
        var row = $("#detalleSucursal").DataTable().row('.selected').data();
        //  console.log(row);
        $("#idSucursal").val(row[0]);
        $("#Nombre").val(row[1]);
        $("#ComboEmpresa").val(row[3]).trigger('change');
        $("#RFC").val(row[5]);
        $("#ComboTPer").val(row[12]).trigger('change');
        $("#Razón Social").val(row[6]);
        $("#Calle").val(row[7]);
        $("#NumExt").val(row[8]);
        $("#NumInt").val(row[9]);
        $("#ComboEstado").val(row[10]).trigger('change');
        $("#ComboCP").val(row[11]).trigger('change');
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    });
}

//Refresh de campos al invocar la tabla
function llenaDataTable() {
    var otable = $('#detalleSucursal').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaSucursales',
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
                $.each(index.ListaRegistrosSucursal, function (r, arr) {
                    datos.push([arr.idSucursal, arr.nombre, arr.empresa, arr.idEmpresa, arr.idDatosFiscales, arr.DatosFiscales.RFC, arr.DatosFiscales.RazonSocial, arr.DatosFiscales.Calle, arr.DatosFiscales.NumeroExterior, arr.DatosFiscales.NumeroInterior, arr.DatosFiscales.Estado.idEstado, arr.DatosFiscales.C_CP, arr.DatosFiscales.TipoPersona.IdTipoPersona]);
                });
            });
        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}

//Llena comboBox
function llenaComboEmpresa() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboEmpresa',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegistrosSucursal, function (index1, item1) {

                    html += '<option value="' + item1.idEmpresa + '">' + item1.empresa + '</option>';
                });
            });
            $("#ComboEmpresa").html(html);
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

function llenaComboTP() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboTipoPersona',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegTipoPersona, function (index1, item1) {

                    html += '<option value="' + item1.IdTipoPersona + '">' + item1.TipoPersona + '</option>';
                });
            });
            $("#ComboTPer").html(html);
        }
    });

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
            $("#ComboCP").html(html);
        }
    });

}