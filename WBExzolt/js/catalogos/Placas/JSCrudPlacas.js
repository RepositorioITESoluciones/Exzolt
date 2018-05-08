var otable;
var url;
var edit = 0;
var rows;
var data;
var cadenaComboModeloPlacas = "";
$(function () {
    initEventos();
    initDataTable();
});

function initEventos() {

    //Funcion para validar direccion MAC al salir del input
    //$("#direccionMAC").blur(function () {
    //    validarMAC($('#direccionMAC').val());
    //});

     //Funcion para validar direccion ip al salir del input
    //$("#direccionIP").blur(function () {
    //    verifyIP($('#direccionIP').val());
    //});

    $('#fechaBaja').datetimepicker({
        format: 'DD/MM/YYYY'
    });

    $('#fechaBaja').on('dp.change', function (e) {
        if ($('#fechaBaja').val() != null || $('#fechaBaja').val() != '') {
            $('.valido').removeClass("has-error");
            $('.valido').addClass("has-success");
        } else {
            $('.valido').removeClass("has-success");
            $('.valido').addClass("has-error");
        }
    })

    //Metodo usado para llenar el combo de modelo de placas
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboModeloPlacaDatos',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $.each(response, function (row, index) {
                cadenaComboModeloPlacas += '<option value="' + 0 + '"> Seleccione una opción </option>'
                $.each(index.ListaRegistros, function (r, arr) {                  
                    cadenaComboModeloPlacas += '<option value="' + arr.idModeloCircuito + '">' + arr.nombreModeloCircuito + '</option>'
                    $("#modeloCircuito").html(cadenaComboModeloPlacas);
                });
            });
        }
    });

    $('#btnPlus').click(function () {
        bootsVal();
        var f = new Date();
        $("#fechaAlta").val(f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear());
        $('#fechaAlta').prop('readonly', true);
        $('#divPlacas').hide();
        $('#FormularioPlacas').show();
        $('#btnguardar2').hide();
        $('#btnguardar').show();
    });

    $('#btnAtras').click(function () {
        $('#divPlacas').show();
        $('#FormularioPlacas').hide();
        $('#FormPlacas')[0].reset();
        $('#FormPlacas').bootstrapValidator('destroy');
    });

    $('#btnguardar').click(function () {
        bootsVal();
        $('#FormPlacas').data('bootstrapValidator').validate();
        var n = $('#FormPlacas').data('bootstrapValidator').isValid();
        if (n) {
            $('#divPlacas').show();
            $('#FormularioPlacas').hide();      
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/InsertaWsPlacas',
                data: {
                    direccionMAC: $("#direccionMAC").val(),
                    fechaAlta: $("#fechaAlta").val(),
                    fechaBaja: $("#fechaBaja").val(),
                    descripcion: $("#descripcion").val(),
                    direccionIp: $("#direccionIP").val(),
                    modeloCircuito: $("#modeloCircuito").val(),
                    noSerie: $("#numSerie").val()
                },
                success: function (data) {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Placa <b>" + $("#direccionMAC").val() + "</b> agregada",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormPlacas')[0].reset();
                    $('#FormPlacas').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar').prop("disabled", false);
            bootsVal();
        }
    });

    $('#btnguardar2').click(function () {
        bootsVal();
        $('#FormPlacas').data('bootstrapValidator').validate();
        var n = $('#FormPlacas').data('bootstrapValidator').isValid();
        if (n) {
            $('#divPlacas').show();
            $('#FormularioPlacas').hide();    
            var idPlaca = rows[0];
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/ActualizarWsPlacas',
                data: {
                    idPlaca: idPlaca,
                    direccionMAC: $("#direccionMAC").val(),
                    fechaAlta: $("#fechaAlta").val(),
                    fechaBaja: $("#fechaBaja").val(),
                    descripcion: $("#descripcion").val(),
                    direccionIp: $("#direccionIP").val(),
                    modeloCircuito: $("#modeloCircuito").val(),
                    noSerie: $("#numSerie").val()
                },
                success: function () {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Placa <b>" + rows[1] + "</b> Editada",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });               
                    cargarTabla();
                    $('#FormPlacas')[0].reset();
                    $('#FormPlacas').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar2').prop("disabled", false);
            bootsVal();
        }
    });


    $("#btnDelete").click(function () {
        var row = $('#TablaPlacas').DataTable().row('.selected').data();
        if (row) {
            var idPlaca = row[0];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> la placa <b>" + row[1] + "</b>?",
                content: "Una vez eliminado la placa no podras volver acceder a el.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'WSLinPro.asmx/EliminarWsPlacas',
                        data: {
                            idPlaca: idPlaca
                        },
                        success: function (data) {
                            $.smallBox({
                                title: "Éxito!",
                                content: "Placa <b></b> eliminada",
                                color: "#739e73",
                                timeout: 2000,
                                icon: "fa fa-thumbs-up swing animated"
                            });
                            cargarTabla();
                            $('#FormPlacas')[0].reset();
                            $('#FormPlacas').bootstrapValidator('destroy');
                        }
                    })
                } else {
                    $('#bot1-Msg1').prop('disabled', true);
                }
            });
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    })

    $("#btnEdit").click(function () {
        bootsVal();
        editPlacas();
        $('#btnguardar2').show();
        $('#btnguardar').hide();
        edit = 1;
    })
    var cadena = "";
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
        url: 'WSLinPro.asmx/LlenaTablaPlacas',
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
                $.each(index.ListaRegistros, function (r, arr) {
                    datos.push([arr.idPlaca, arr.direccionMACEquipo, arr.fechaAlta.substring(0, 9), arr.fechaBaja.substring(0, 9), arr.descripcion, arr.direccionIp, arr.idModeloCircuito, arr.numeroSerie, arr.nombreModeloCircuito]);
                });
            });
        }
    });
    otable = $('#TablaPlacas')
        .DataTable({

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
                        $('#TablaPlacas'), breakpointDefinition);
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
                title: "Id",
                visible: false
            }, {
                title: "Dirección MAC"
            }, {
                title: "Fecha De Alta"
            }, {
                title: "Fecha De Baja"
            }, {
                title: "Descripción"
            }, {
                title: "Dirección IP"
            }, {
                title: "Id Modelo De Circuito",
                visible: false
            }, {
                title: "No. De Serie"
            }, {
                title: "Modelo De Circuito"
            }]
        });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#TablaPlacas thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila

    $('#TablaPlacas tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#TablaPlacas').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });


    // Evento creado para abrir la ventana de editar al dar doble click sobre un
    // registro
    $('#TablaPlacas tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        bootsVal();
        editPlacas();
        edit = 1;

    });
}

function editPlacas() {

    row = $("#TablaPlacas").DataTable().row('.selected').data();
    rows = $("#TablaPlacas").DataTable().row('.selected').data();
    if (row) {
        $('#fechaAlta').datetimepicker({
            format: 'DD/MM/YYYY'
        });

        $("#direccionMAC").val(row[1]);

        $("#fechaAlta").val(row[2]);
        $("#fechaAlta").trigger('change');

        $("#fechaBaja").val(row[3]);
        $("#fechaBaja").trigger('change');

        $("#descripcion").val(row[4]);
        $("#direccionIP").val(row[5]);

        $("#modeloCircuito").val(row[6]);
        $("#modeloCircuito").trigger('change');

        $("#numSerie").val(row[7]);

        $('#divPlacas').hide();
        $('#FormularioPlacas').show();

        $('#btnguardar2').show();
        $('#btnguardar').hide();

    } else {
        showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
    }

}


//Funcion creada para validar campos vacios en formulario
function bootsVal() {
    $('#FormPlacas').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        message: 'Valor invalido',
        fields: {
            fechaBaja: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'La fecha de baja es obligatoria'
                    },
                }
            },
            descripcion: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'La descripción es obligatoria'
                    },
                    stringLength: {
                        max: 50,
                        message: 'La descripción no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            numSerie: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'El número de serie es obligatorio'
                    },
                    stringLength: {
                        max: 50,
                        message: 'Número de serie no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            direccionMAC: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'La dirección MAC es obligatoria'
                    },
                regexp: {
                    regexp: /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/,
                    message: 'La dirección MAC no tiene el formato adecuado. Ejemplo: AA:AA:BB:CC:DD:EE',
                }
                }
            },       
            direccionIP: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'La dirección IP es obligatoria'
                    },
                    regexp: {
                        regexp: /^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$/,
                        message: 'La dirección IP no tiene el formato adecuado. Ejmplo: 12.127.3.88',
                    }
                }
            },
            modeloCircuito: {
                group: '.col-6',
                validators: {
                    callback: {
                        message: 'Seleccione un modelo de circuito',
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
}

//Funcion encargada de refrescar la tabla despues de haber creado, editado o eliminado un registro
function cargarTabla() {
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaPlacas',
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
                $.each(index.ListaRegistros, function (r, arr) {
                    datos.push([arr.idPlaca, arr.direccionMACEquipo, arr.fechaAlta, arr.fechaBaja, arr.descripcion, arr.direccionIp, arr.idModeloCircuito, arr.numeroSerie, arr.nombreModeloCircuito]);
                });
            });

        }

    });
    otable.clear();
    otable.rows.add(datos);
    otable.draw();
}

//Funcion encargada de validar la direccion IP
function verifyIP(IPvalue) {
    errorString = "";
    theName = "IPaddress";

    var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var ipArray = IPvalue.match(ipPattern);

    if (IPvalue == "0.0.0.0")
        errorString = errorString + theName + ': ' + IPvalue + ' es una direccion de ip especialy no puede ser utilizada aqui.';
    else if (IPvalue == "255.255.255.255")
        errorString = errorString + theName + ': ' + IPvalue + ' es una direccion de ip especialy no puede ser utilizada aqui.';
    if (ipArray == null)
        errorString = errorString + theName + ': ' + IPvalue + ' no es una direccion de IP valida.';
    else {
        for (i = 0; i < 4; i++) {
            thisSegment = ipArray[i];
            if (thisSegment > 255) {
                errorString = errorString + theName + ': ' + IPvalue + ' no es una direccion de IP valida.';
                i = 4;
            }
            if ((i == 0) && (thisSegment > 255)) {
                errorString = errorString + theName + ': ' + IPvalue + ' es una direccion de ip especialy no puede ser utilizada aqui.';
                i = 4;
            }
        }
    }
    extensionLength = 3;
    if (errorString == "") {
        $(".ip").removeClass('has-error');
        $(".ip").addClass('has-success');
    } else {
        $(".ip").removeClass('has-success');
        $(".ip").addClass('has-error');
    }
}

//Funcion encargada de validar la direccion MAC
function validarMAC(mac) {
    var regexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
    var mac_address = mac;
    if (regexp.test(mac_address)) {

        $(".MAC").removeClass('has-error');
        $(".MAC").addClass('has-success');
    } else {

        $(".MAC").removeClass('has-success');
        $(".MAC").addClass('has-error');
    }

}