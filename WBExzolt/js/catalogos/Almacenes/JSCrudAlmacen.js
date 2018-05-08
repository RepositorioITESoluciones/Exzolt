var otable;
var url;
var edit = 0;
var rows;
var data;
var cadena = "";
var cadenaComboTipoAlmacen = "";
$(function () {
    initEventos();
    initDataTable();
});

function initEventos() {

    //Metodo usado para llenar el combo de sucursales
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboSucursales',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $.each(response, function (row, index) {
                cadena += '<option value="' + 0 + '"> Seleccione una opción </option>'
                $.each(index.ListaRegistros, function (r, arr) {
                    cadena += '<option value="' + arr.idSucursal + '">' + arr.nombreSucursal + '</option>'
                });
            });
            $("#sucursal").html(cadena);
        }
    });

    //Metodo usado para llenar el combo de tipos de almacen
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboTipoAlmacen',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $.each(response, function (row, index) {
                cadenaComboTipoAlmacen += '<option value="' + 0 + '"> Seleccione una opción </option>'
                $.each(index.ListaRegistros, function (r, arr) {
                    console.log("ARR: " + JSON.stringify(arr));
                    cadenaComboTipoAlmacen += '<option value="' + arr.idTipoAlmacen + '">' + arr.nombreTipoAlmacen + '</option>'
                    $(".tipoAlmacen").html(cadenaComboTipoAlmacen);
                });
            });
        }
    });


    $('#btnPlus').click(function () {
        bootsVal();
        $('#divAlmacen').hide();
        $('#FormularioAlmacen').show();
        $('#btnguardar2').hide();
        $('#btnguardar').show();
        url = 'WSLinPro.asmx/insertaWsTipoAlmacen';

    });
    $('#btnAtras').click(function () {
        $('#divAlmacen').show();
        $('#FormularioAlmacen').hide();
        $('#FormAlmacen')[0].reset();
        $('#FormAlmacen').bootstrapValidator('destroy');
    });


    $('#btnguardar').click(function () {
        bootsVal();
        $('#FormAlmacen').data('bootstrapValidator').validate();
        var n = $('#FormAlmacen').data('bootstrapValidator').isValid();
        if (n) {
            $('#divAlmacen').show();
            $('#FormularioAlmacen').hide();

            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/insertaWsInsertarAlmacen',
                data: {
                    descripcion: $("#descripcion").val(),
                    idSucursal: $("#sucursal").val(),
                    idTipoAlmacen: $(".tipoAlmacen").val()
                },
                success: function (data) {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Almacén <b>" + $('#descripcion').val() + "</b> agregado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormAlmacen')[0].reset();
                    $('#FormAlmacen').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar').prop("disabled", false);
            bootsVal();
        }
    });

    $('#btnguardar2').click(function () {
        bootsVal();
        $('#FormAlmacen').data('bootstrapValidator').validate();
        var n = $('#FormAlmacen').data('bootstrapValidator').isValid();
        if (n) {
            $('#divAlmacen').show();
            $('#FormularioAlmacen').hide();
            var idAlmacen = rows[0];
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/actualizarWsAlmacen',
                data: {
                    idAlmacen: idAlmacen,
                    descripcion: $("#descripcion").val(),
                    idSucursal: $("#sucursal").val(),
                    idTipoAlmacen: $(".tipoAlmacen").val()
                },
                success: function () {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Usuario <b>" + rows[1] + "</b> Editado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormAlmacen')[0].reset();
                    $('#FormAlmacen').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar2').prop("disabled", false);
            bootsVal();
        }
    });


    $("#btnDelete").click(function () {
        var row = $('#TablaAlmacen').DataTable().row('.selected').data();
        if (row) {
            var idAlmacen = row[0];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el almacén <b>" + row[1] + "</b>?",
                content: "Una vez eliminado el almacen no podras volver acceder a el.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'WSLinPro.asmx/EliminarWsAlmacen',
                        data: {
                            idAlmacen: idAlmacen
                        },
                        success: function (data) {
                            $.smallBox({
                                title: "Éxito!",
                                content: "Almacén <b>" + $('#descripcion').val() + "</b> eliminado",
                                color: "#739e73",
                                timeout: 2000,
                                icon: "fa fa-thumbs-up swing animated"
                            });
                            cargarTabla();
                            $('#FormAlmacen')[0].reset();
                            $('#FormAlmacen').bootstrapValidator('destroy');
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
        editAlmacen();
        $('#btnguardar2').show();
        $('#btnguardar').hide();
        edit = 1;
    })
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
        url: 'WSLinPro.asmx/LlenaTablaAlmacen',
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
                    datos.push([arr.idAlmacen, arr.descripcion, arr.idTipoAlmacen, arr.nombreTipoAlmacen, arr.idSucursal, arr.nombreSucursal]);
                });
            });
        }
    });
    otable = $('#TablaAlmacen').DataTable({

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
                    $('#TablaAlmacen'), breakpointDefinition);
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
            title: "IdAlmacen",
            visible: false
        }, {
            title: "Descripción"
        }, {
            title: "IdTipoAlmacen",
            visible: false
        }, {
            title: "Almacén"
        }, {
            title: "idSucursal",
            visible: false
        }, {
            title: "Sucursal"
        }]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#TablaAlmacen thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#TablaAlmacen tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#TablaAlmacen').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });


    // Evento creado para abrir la ventana de editar al dar doble click sobre un
    // registro
    $('#TablaAlmacen tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        bootsVal();
        editAlmacen();
        edit = 1;
    });
}

function editAlmacen() {

    var row;
    row = $("#TablaAlmacen").DataTable().row('.selected').data();
    rows = $("#TablaAlmacen").DataTable().row('.selected').data();
    if (row) {    

        $("#descripcion").val(row[1]);

        $(".tipoAlmacen").val(row[2]);
        $(".tipoAlmacen").trigger('change');

        $("#sucursal").val(row[4]);
        $("#sucursal").trigger('change');

        $('#divAlmacen').hide();
        $('#FormularioAlmacen').show();

        $('#btnguardar2').show();
        $('#btnguardar').hide();

    } else {
        showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
    }

}


//Funcion creada para validar campos vacios en formulario
function bootsVal() {

    $('#FormAlmacen').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        message: 'Valor invalido',
        fields: {
            descripcion: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'La descripción del almacen es oblgatoria'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 100,
                        message: 'La descripción del almacen no puede tener más de 100 caracteres'
                    }
                }
            },
            tipoAlmacen: {
                group: '.col-6',
                validators: {
                    callback: {
                        message: 'Seleccione un tipo de almacen',
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
            sucursal: {
                group: '.col-6',
                validators: {
                    callback: {
                        message: 'Seleccione una sucursal',
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

//Funcion encargada de refrescar la tabla despues de haber creado, editado o eliminado un regustro
function cargarTabla() {
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaAlmacen',
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
                    datos.push([arr.idAlmacen, arr.descripcion, arr.idTipoAlmacen, arr.nombreTipoAlmacen, arr.idSucursal, arr.nombreSucursal]);
                });
            });
        }
    });
    otable.clear();
    otable.rows.add(datos);
    otable.draw();
}