var otable;
var url;
var rows;
var data;
$(function () {
    initEventos();
    //initDataTable();
});
function initEventos() {
   
    $("#divAlias").hide();
    bootsVal();
    $('#radioSi').change(function () {
        if ($('input#radioSi').is(':checked')) {
            $('#nombre').val('');
            $("#divAlias").show();
            $("#divNombre").hide();
            $('#formularioRegistro').bootstrapValidator('destroy');
            bootsVal();
        }
    })
    $('#radioNo').change(function () {
        if ($('input#radioNo').is(':checked')) {
            $('#alias').val('');
            $("#divAlias").hide();
            $("#divNombre").show();
            $('#formularioRegistro').bootstrapValidator('destroy');
            bootsVal();
        }
    })
 

    $('#botonReg').click(function () {
        bootsVal();
        $('#formularioRegistro').data('bootstrapValidator').validate();
        var n = $('#formularioRegistro').data('bootstrapValidator').isValid();
        if (n) {
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSExzolt.asmx/ActualizarDatosEmpresariales',
                data: {
                    idEmpresa: rows[12],
                    nombre: $('#nombre').val(),
                    fechaRegistro: $('#fecha').val(),
                    idGiro: $('#giro').val(),
                    ComboTPer: $('#tipoPer').val(),
                    RazonSocial: $('#razonSocial').val(),
                    RFC: rfc,
                    ComboEstado: $('#ComboEstado').val(),
                    ComboCP: $('#ComboCP').val(),
                    Calle: $('#calle').val(),
                    NumExt: $('#numExt').val(),
                    NumInt: $('#numInt').val()
                },
                success: function (data) {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Empresa <b>" + rows[0] + "</b> editada",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                }
            });
        } else {
            $('#botonReg').prop("disabled", false);
            bootsVal();
        }
    });

    $('#btnguardar2').click(function () {
        var rfc = "";
        if (banderaRFC == "Fisico") {
            rfc = $("#rfcFisico").val();
        } else {
            rfc = $("#rfcMoral").val();
        }
        rfc = rfc.toUpperCase();
        bootsVal();
        $('#FormEmpresa').data('bootstrapValidator').validate();
        var n = $('#FormEmpresa').data('bootstrapValidator').isValid();
        if (n) {
            $('#divDatosEmpresariales').show();
            $('#FormularioDatosEmpresariales').hide();

            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/ActualizarDatosEmpresariales',
                data: {
                    idEmpresa: rows[12],
                    nombre: $('#nombre').val(),
                    fechaRegistro: $('#fecha').val(),
                    idGiro: $('#giro').val(),
                    ComboTPer: $('#tipoPer').val(),
                    RazonSocial: $('#razonSocial').val(),
                    RFC: rfc,
                    ComboEstado: $('#ComboEstado').val(),
                    ComboCP: $('#ComboCP').val(),
                    Calle: $('#calle').val(),
                    NumExt: $('#numExt').val(),
                    NumInt: $('#numInt').val()
                },
                success: function (data) {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Empresa <b>" + rows[0] + "</b> editada",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                }
            });
            cargarTabla();
            $('#FormEmpresa')[0].reset();
            $('#FormEmpresa').bootstrapValidator('destroy');
        } else {
            $('#btnguardar2').prop("disabled", false);
            bootsVal();
        }
    });

   

    
}

//function initDataTable() {
//    $.fn.dataTable.ext.errMode = 'none';
//    var responsiveHelper_datatable_fixed_column = undefined;
//    var breakpointDefinition = {
//        tablet: 1024,
//        phone: 480,
//        desktop: 1260
//    };
//    var datos = [];
//    $.ajax({
//        async: false,
//        type: 'POST',
//        url: 'WSLinPro.asmx/LlenaTablaDE',
//        dataType: 'json',
//        contentType: 'application/json; charset=utf-8',
//        beforeSend: function () {
//            $('#loadingMod').modal({
//                backdrop: 'static',
//                keyboard: false
//            });
//        },
//        success: function (response) {
//            $('#loadingMod').modal('hide');
//            $.each(response, function (row, index) {
//                $.each(index.ListaRegistros, function (r, arr) {
//                    var d = new Date(arr.fechaRegistro).forma;
//                    datos.push([arr.nombre, arr.fechaRegistro.substring(0, 10), arr.DatosFiscales.RFC, arr.DatosFiscales.RazonSocial, arr.DatosFiscales.TipoPersona.TipoPersona, arr.idGiro, arr.DatosFiscales.TipoPersona.IdTipoPersona, arr.DatosFiscales.Estado.idEstado, arr.DatosFiscales.C_CP, arr.DatosFiscales.Calle, arr.DatosFiscales.NumeroExterior, arr.DatosFiscales.NumeroInterior, arr.idEmpresa]);
//                });
//            });
//        }

//    });

//    otable = $('#TablaDatosEmpresariales')
//        .DataTable({

//            "aLengthMenu": [
//                [5, 10, 25, 50],
//                [5, 10, 25, 50]
//            ],
//            "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6 hidden-xs'l><'col-sm-6 col-xs-12 hidden-xs'<'toolbar'>>r>" +
//            "t" +
//            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
//            "oLanguage": {
//                "sUrl": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
//            },

//            "autoWidth": true,
//            "preDrawCallback": function () {
//                if (!responsiveHelper_datatable_fixed_column) {
//                    responsiveHelper_datatable_fixed_column = new ResponsiveDatatablesHelper(
//                        $('#TablaDatosEmpresariales'), breakpointDefinition);
//                }
//            },
//            "rowCallback": function (nRow) {
//                responsiveHelper_datatable_fixed_column
//                    .createExpandIcon(nRow);
//            },
//            "drawCallback": function (oSettings) {
//                responsiveHelper_datatable_fixed_column.respond();
//            },
//            data: datos,
//            columns: [{
//                title: "Nombre"
//            },
//            {
//                title: "Fecha De Registro"
//            },
//            {
//                title: "RFC"
//            },
//            {
//                title: "Razón Social"
//            },
//            {
//                title: "Tipo De Persona"
//            },
//            {
//                title: "idGiro",
//                visible: false
//            },
//            {
//                title: "Id tipo persona",
//                visible: false
//            },
//            {
//                title: "idEstado",
//                visible: false
//            },
//            {
//                title: "cp",
//                visible: false
//            },
//            {
//                title: "calle",
//                visible: false
//            },
//            {
//                title: "numExt",
//                visible: false
//            },
//            {
//                title: "numInt",
//                visible: false
//            }

//            ]
//        });

//    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
//    $("#TablaDatosEmpresariales thead th input[type=text]").on(
//        'keyup',
//        function (e) {
//            otable.column($(this).parent().index() + ':visible').search(
//                this.value).draw();
//        });

//    // Método creado para agregar el evento de selección de una fila
//    $('#TablaDatosEmpresariales tbody').on(
//        'click',
//        'tr',
//        function () {
//            if ($(this).hasClass('selected')) {
//                $(this).removeClass('selected');
//            } else {
//                $('#TablaDatosEmpresariales').DataTable().$('tr.selected').removeClass(
//                    'selected');
//                $(this).addClass('selected');
//            }
//        });
//    // Evento creado para abrir la ventana de editar al dar doble click sobre un
//    // registro
//    $('#TablaDatosEmpresariales tbody').on('dblclick', 'tr', function () {
//        $(this).addClass('selected');
//        $("#ComboEstado").val(0);
//        $("#ComboEstado").trigger("change");
//        $(".estado").removeClass("has-error");

//        $("#ComboCP").val(0);
//        $("#ComboCP").trigger("change");
//        $(".codigo").removeClass("has-error");

//        $("#errorCp").hide();
//        $("#errorEstado").hide();
//        bootsVal();
//        editUsuario();
//        edit = 1;

//    });
//}



//Funcion creada para validar campos vacios en formulario
function bootsVal() {

    $('#formularioRegistro').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="botonReg"]',
        message: 'Valor invalido',
        fields: {
            nombre: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'El nombre es obligatorio'
                    },
                }
            },
            alias: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'El alias es obligatorio'
                    },
                }
            }
        }
    });
}


//function bootsValAlias() {

//    $('#formularioRegistro').bootstrapValidator({
//        live: 'enabled',
//        submitButtons: 'button[id="botonReg"]',
//        message: 'Valor invalido',
//        fields: {
//            alias: {
//                group: '.col-6',
//                validators: {
//                    callback: {
//                        message: 'El alias es obligatorio',
//                        callback: function (value, validator, $field) {
//                            //if ($('input#radioSi').is(':checked')) {
//                                if (value === '0') {
//                                    return false
//                                } else {
//                                    return true
//                                }
//                            //}
//                        }
//                    }
//                }
//            }
//        }
//    });
//}


////Funcion encargada de refrescar la tabla despues de haber creado, editado o eliminado un registro
//function cargarTabla() {
//    var datos = [];
//    $.ajax({
//        async: false,
//        type: 'POST',
//        url: 'WSLinPro.asmx/LlenaTablaDE',
//        dataType: 'json',
//        contentType: 'application/json; charset=utf-8',
//        beforeSend: function () {
//            $('#loadingMod').modal({
//                backdrop: 'static',
//                keyboard: false
//            });
//        },
//        success: function (response) {
//            $('#loadingMod').modal('hide');
//            $.each(response, function (row, index) {

//                $.each(index.ListaRegistros, function (r, arr) {
//                    datos.push([arr.nombre, arr.fechaRegistro.substring(0, 10), arr.DatosFiscales.RFC, arr.DatosFiscales.RazonSocial, arr.DatosFiscales.TipoPersona.TipoPersona, arr.idGiro, arr.DatosFiscales.TipoPersona.IdTipoPersona, arr.DatosFiscales.Estado.idEstado, arr.DatosFiscales.C_CP, arr.DatosFiscales.Calle, arr.DatosFiscales.NumeroExterior, arr.DatosFiscales.NumeroInterior, arr.idEmpresa]);
//                });
//            });
//        }
//    });
//    otable.clear();
//    otable.rows.add(datos);
//    otable.draw();
//}
