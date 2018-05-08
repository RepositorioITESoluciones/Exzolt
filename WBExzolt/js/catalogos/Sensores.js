$(function () {

    initEventos(); 
    initDataTable();
    LlenaComboModelosSen();
    LlenaComboPlacasSen();
    llenaComboUnidadMedida();
    llenaComboTipoMedidor();
    llenaComboTipoSensor();
    LlenaComboAgentesMed();
    $('#FechaAlta').datetimepicker({
        format: 'DD/MM/YYYY hh:mm:ss'
    });
    $('#FechaIns').datetimepicker({
        format: 'DD/MM/YYYY hh:mm:ss'
    });
}); 

function initEventos() {
    //boton plus 
    $('#btnPlus').click(function () {
        var row = $("#detalleSensores").DataTable().row('.selected').data();
        if (row) {
            $('#detalleSensores').DataTable().$('tr.selected').removeClass('selected');
        }
        limpiaDivs();
        validateForm();
       $('#FormSensores').data('bootstrapValidator').resetForm();
        document.getElementById("FormSensores").reset();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $('#btnguardar').show();
    });

    //boton atras
    $('#btnAtras').click(function () {
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    //  boton editar
    $("#btnEdit").click(function () {
        limpiaDivs();
        document.getElementById("FechaAlta").onfocus;
        document.getElementById("FechaIns").onfocus;
        var row = $("#detalleSensores").DataTable().row('.selected').data();
                console.log(row);
                LlenaComboModelosSen();
                LlenaComboPlacasSen();
                llenaComboUnidadMedida();
                llenaComboTipoMedidor();
                llenaComboTipoSensor();
                LlenaComboAgentesMed();
        if (row) {
            $("#IdSensor").val(row[0]);
            $("#ComboTSensor").val(row[1]).trigger('change');
            $("#ComboTMedidor").val(row[3]).trigger('change');
            $("#NSerie").val(row[5]);
            $('#ComboUMedida').val(row[6]).trigger('change');
            $('#ComboAMedido').val(row[8]).trigger('change');
            $("#FechaAlta").val(row[10]);
            $("#Descripcion").val(row[11]);
            $("#FechaIns").val(row[12]);
            $("#ComboPlaca").val(row[13]).trigger('change');
            $("#ComboModSen").val(row[15]).trigger('change');
            $("#IntervaloLec").val(row[17]);
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    });

    //boton guardar y editar
    $('#btnguardar').click(function () {
        var row = $("#detalleSensores").DataTable().row('.selected').data();
        if (row) {
            editSensor();
        } else {
            var valido;
            valido = validateForm();
            console.log(valido);
            if (valido) {
                console.log(JSON.stringify($('#FormSensores').serializeArray()));
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'WSLinPro.asmx/InsertaSensor',
                    data: $('#FormSensores').serializeArray(),
                    success: function (response) {
                        $.smallBox({
                            title: "Éxito!",
                            content: "Sensor <b>" + $('#Descripcion').val() + "</b> agregado",
                            color: "#739e73",
                            timeout: 2000,
                            icon: "fa fa-thumbs-up swing animated"
                        });
                        llenaDataTable();
                    }
                });
                $('#FormSensores').data('bootstrapValidator').resetForm();
                $('#divTiposTransaccion').show();
                $('#FormularioAlta').hide();
                llenaDataTable();
            }
            else {
                $('#divTiposTransaccion').hide();
                $('#FormularioAlta').show();
            }
        }
    });

    //boton borrado
    $("#btnDelete").click(function () {
        var row = $('#detalleSensores').DataTable().row('.selected').data();
        if (row) {
            var IdSensor = row[0];
            console.log(IdSensor);
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el sensor <b>" + row[11] + "</b>?",
                content: "Una vez eliminada la Transaccion no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/EliminarSensor',
                        data: JSON.stringify({ IdSensor: IdSensor }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (output) {
                            $.each(output, function (j, cam) {
                                showOkMessage('Transaccion Eliminada', 'Se ha Eliminado la Transaccion <b>' + row[1] + '<b>');
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

function initDataTable() {
   
    $.fn.dataTable.ext.errMode = 'none';
    var responsiveHelper_datatable_fixed_column = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480,
        desktop: 1260
    };
    var datos = [];
    console.log(datos);
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaSensores',
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
                $.each(index.ListaRegSensores, function (r, arr) {
                    datos.push([arr.IdSensor, arr.TipoSensor.IdTipoSensor, arr.TipoSensor.Nombre, arr.TipoMedidor.IdTipoMedidor, arr.TipoMedidor.Descripcion,
                        arr.NoSerie, arr.UnidadesMedida.IdUnidadMedida, arr.UnidadesMedida.Nombre, arr.AgentesMedidos.IdAgenteMedido, arr.AgentesMedidos.Nombre,
                        arr.FechaALtaS, arr.Descripcion, arr.FechaInstalacionS, arr.PlacasSensores.IdPlaca, arr.PlacasSensores.Descripcion, arr.ModeloSensores.IdModeloSensor,
                        arr.ModeloSensores.Nombre, arr.IntervaloLectura
                    ]);
                });
            });
        }
    });
    var otable = $('#detalleSensores').DataTable({
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
                    $('#detalleSensores'), breakpointDefinition);
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
            title: "IdSensor",
            visible: false
        },
        {
            title: "IdTipoSensor",
            visible: false
        },
        {
            title: "Tipo Sensor"
        },
        {
            title: "IdTipoMedidor",
            visible: false
        },
        {
            title: "Tipo Medidor"
        },
        {
            title: "Número Serie"
        },
        {
            title: "IdUnidadMedida",
            visible: false
        },
        {
            title: "Unidad Medida"
        },
        {
            title: "IdAgenteMedido",
            visible: false
        },
        {
            title: "Agente Medido"
        },
        {
            title: "Fecha Alta"
        },
        {
            title: "Descripción",
            visible: false
        },
        {
            title: "Fecha Instalación"
        },
        {
            title: "IdPlaca",
            visible: false
        },
        {
            title: "Placa",
            visible: false
        },
        {
            title: "IdModeloSensor",
            visible: false
        },
        {
            title: "Modelo Sensor",
            visible: false
        },
        {
            title: "Intervalo Lectura",
            visible: false
        }
        ]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#detalleSensores thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#detalleSensores tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#detalleMaquina').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });

    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#detalleSensores tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        var row = $("#detalleSensores").DataTable().row('.selected').data();
        $("#IdSensor").val(row[0]);
        $("#ComboTSensor").val(row[1]).trigger('change');
        $("#ComboTMedidor").val(row[3]).trigger('change');
        $("#NSerie").val(row[5]);
        $('#ComboUMedida').val(row[6]).trigger('change');
        $('#ComboAMedido').val(row[8]).trigger('change');
        $("#FechaAlta").val(row[10]);
        $("#Descripcion").val(row[11]);
        $("#FechaIns").val(row[12]);
        $("#ComboPlaca").val(row[13]).trigger('change');
        $("#ComboModSen").val(row[15]).trigger('change');
        $("#IntervaloLec").val(row[17]);
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    });
}

function llenaDataTable() {
    var otable = $('#detalleSensores').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaSensores',
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
             
            });
            $.each(response, function (row, index) {
                $.each(index.ListaRegSensores, function (r, arr) {
                    datos.push([arr.IdSensor, arr.TipoSensor.IdTipoSensor, arr.TipoSensor.Nombre, arr.TipoMedidor.IdTipoMedidor, arr.TipoMedidor.Descripcion,
                    arr.NoSerie, arr.UnidadesMedida.IdUnidadMedida, arr.UnidadesMedida.Nombre, arr.AgentesMedidos.IdAgenteMedido, arr.AgentesMedidos.Nombre,
                    arr.FechaALtaS, arr.Descripcion, arr.FechaInstalacionS, arr.PlacasSensores.IdPlaca, arr.PlacasSensores.Descripcion, arr.ModeloSensores.IdModeloSensor,
                    arr.ModeloSensores.Nombre, arr.IntervaloLectura]);
                });
            });
        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}

function editSensor() {
    var valido;
    valido = validateForm();
    if (valido) {
        var row = $("#detalleSensores").DataTable().row('.selected').data();
        console.log(row);
       // document.getElementById("FechaAlta").onfocus;
    //    document.getElementById("FechaIns").onfocus;
       
        document.getElementById("FechaIns").onclick;
        document.getElementById("FechaAlta").onclick;
      //  alert(document.getElementById("FechaAlta").value);
        //   alert(document.getElementById("FechaIns").value);
        document.getElementById("NSerie").onfocus;
        //var fechaAlta = datetimeToDateFormat($("#FechaAlta").val());
        //console.log(fechaAlta);
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/ActualizarSensor',
            data: {
                ComboTSensor: $("#ComboTSensor").val(),
                ComboTMedidor: $("#ComboTMedidor").val(),
                NSerie: $("#NSerie").val(),
                ComboUMedida: $("#ComboUMedida").val(),
                ComboAMedido: $("#ComboAMedido").val(),
                FechaAlta: $("#FechaAlta").val(),

                Descripcion: $("#Descripcion").val(),
                FechaIns: $("#FechaIns").val(),
                ComboPlaca: $("#ComboPlaca").val(),
                ComboModSen: $("#ComboModSen").val(),
                IntervaloLec: $("#IntervaloLec").val(),
                IdSensor: row[0]
            },
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Sensor <b>" + $("#Descripcion").val() + "</b> Editado",
                    color: "#739e73",
                    timeout: 2000,
                    icon: "fa fa-thumbs-up swing animated"
                });
                //   llenaDataTable();
                llenaDataTable();
            }
        });
    } else {
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    }
}

function validateForm() {
    $("#FormSensores").bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            descripcion: {
                selector: '#Descripcion',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'La descripción es requerida'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 100,
                        message: 'La descripción del Sensor no puede tener más de 100 caracteres'
                    }
                }
            },
            NumSerie: {
                selector: '#NSerie',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El Número de Serie es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 20,
                        message: 'El número de serie del sensor no puede tener más de 20 caracteres'
                    }
                }
            },
            FechaAlta: {
                selector: '#FechaAlta',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'Debe ingresar una fecha de Alta'
                    }
                }
            },
            FechaInstalación: {
                selector: '#FechaIns',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'Debe ingresar una fecha de instalación'
                    }
                }
            },
            IntervaloLec: {
                selector: '#IntervaloLec',
                group: '.form-group',
                validators: {
                    between: {
                        min: 1,
                        max: 2100,
                        message: 'Intervali entre 1 y 1000'
                    },
                    notEmpty: {
                        message: 'Favor de ingresar un número entero'
                    }
                }
            },
            idTipoSensor: {
                selector: '#ComboTSensor',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una Tipo de Sensor',
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
            idTipoMedidor: {
                selector: '#ComboTMedidor',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un tipo de medidor',
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
            idUnidadMedida: {
                selector: '#ComboUMedida',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una unidad de medida',
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
            idAgenteMedido: {
                selector: '#ComboAMedido',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un agente de medición',
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
            idPlacaSensor: {
                selector: '#ComboPlaca',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una placa',
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
            idModeloSensor: {
                selector: '#ComboModSen',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un modelo',
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

    $('#FormSensores').data('bootstrapValidator').validate();
    var valido = $('#FormSensores').data('bootstrapValidator').isValid();
    return valido;
}

function validarCaracteresN(e) {
    tecla = (e.keyCode ? e.keyCode : e.which);
    if (tecla == 8) return true;
    patron = /[0-9\s\t\.]/;
    te = String.fromCharCode(tecla);
    return patron.test(te);
}

function llenaComboTipoSensor() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboTipoSensore',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegTiposSen, function (index1, item1) {

                    html += '<option value="' + item1.IdTipoSensor + '">' + item1.Nombre + '</option>';
                });
            });
            $("#ComboTSensor").html(html);
        }
    });

}

function llenaComboTipoMedidor() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboTipoMedidores',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegTiposMed, function (index1, item1) {

                    html += '<option value="' + item1.IdTipoMedidor + '">' + item1.Nombre + '</option>';
                });
            });
            $("#ComboTMedidor").html(html);
        }
    });

}

function llenaComboUnidadMedida() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboUnidadMedida',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegUnidadesM, function (index1, item1) {

                    html += '<option value="' + item1.IdUnidadMedida + '">' + item1.Nombre + '</option>';
                });
            });
            $("#ComboUMedida").html(html);
        }
    });

}

function LlenaComboAgentesMed() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboAgentesMed',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegAgentesM, function (index1, item1) {

                    html += '<option value="' + item1.IdAgenteMedido + '">' + item1.Nombre + '</option>';
                });
            });
            $("#ComboAMedido").html(html);
        }
    });

}

function LlenaComboPlacasSen() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboPlacasSen',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegPlacasSen, function (index1, item1) {

                    html += '<option value="' + item1.IdPlaca + '">' + item1.Descripcion + '</option>';
                });
            });
            $("#ComboPlaca").html(html);
        }
    });

}

function LlenaComboModelosSen() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboModelosSen',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegModelosSen, function (index1, item1) {

                    html += '<option value="' + item1.IdModeloSensor + '">' + item1.Nombre + '</option>';
                });
            });
            $("#ComboModSen").html(html);
        }
    });

}

