var otable;
var url;
var edit = 0;
var rows;
var data;

$(function () {
    initEventos();
    initDataTable();
});

function initEventos() {

    $('#btnPlus').click(function () {
        bootsVal();
        $('#divModeloPlacas').hide();
        $('#FormularioModeloPlacas').show();
        $('#btnguardar2').hide();
        $('#btnguardar').show();

    });
    $('#btnAtras').click(function () {
        $('#divModeloPlacas').show();
        $('#FormularioModeloPlacas').hide();
        $('#FormModeloPlacas')[0].reset();
        $('#FormModeloPlacas').bootstrapValidator('destroy');
    });


    $('#btnguardar').click(function () {
        bootsVal();
        $('#FormModeloPlacas').data('bootstrapValidator').validate();
        var n = $('#FormModeloPlacas').data('bootstrapValidator').isValid();
        if (n) {
            $('#divModeloPlacas').show();
            $('#FormularioModeloPlacas').hide();         
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/InsertaWsModeloPlacas',
                data: {
                    nombre: $("#nombre").val(),
                    modelo: $("#modelo").val(),
                    descripcion: $("#descripcion").val()
                },
                success: function (data) {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Modelo de placa <b>" + $('#nombre').val() + "</b> agregado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormModeloPlacas')[0].reset();
                    $('#FormModeloPlacas').bootstrapValidator('destroy');
                }
            })   
        } else {
            $('#btnguardar').prop("disabled", false);
            bootsVal();
        }
    });

    $('#btnguardar2').click(function () {
        bootsVal();
        $('#FormModeloPlacas').data('bootstrapValidator').validate();
        var n = $('#FormModeloPlacas').data('bootstrapValidator').isValid();
        if (n) {
            $('#divModeloPlacas').show();
            $('#FormularioModeloPlacas').hide();      
            var idModeloCircuito = rows[0];
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/ActualizarWsModeloPlacas',
                data: {
                    idModeloCircuito: idModeloCircuito,
                    nombre: $("#nombre").val(),
                    modelo: $("#modelo").val(),
                    descripcion: $("#descripcion").val()
                },
                success: function () {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Modelo de placa <b>" + rows[1] + "</b> Editado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormModeloPlacas')[0].reset();
                    $('#FormModeloPlacas').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar2').prop("disabled", false);
            bootsVal();
        }
    });


    $("#btnDelete").click(function () {
        var row = $('#TablaModeloPlacas').DataTable().row('.selected').data();
        if (row) {
            var idModeloCircuito = row[0];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el modelo de placa <b>" + row[1] + "</b>?",
                content: "Una vez eliminado el modelo de placa no podras volver acceder a el.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'WSLinPro.asmx/EliminarWsModeloPlacas',
                        data: {
                            idModeloCircuito: idModeloCircuito
                        },
                        success: function (data) {                     
                            $.smallBox({
                                title: "Éxito!",
                                content: "Modelo de placa <b>" + $('#nombre').val() + "</b> eliminado",
                                color: "#739e73",
                                timeout: 2000,
                                icon: "fa fa-thumbs-up swing animated"
                            });
                            cargarTabla();
                            $('#FormModeloPlacas')[0].reset();
                            $('#FormModeloPlacas').bootstrapValidator('destroy');
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
        editModeloPlacas();
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
        url: 'WSLinPro.asmx/LlenaTablaModeloPlacas',
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
                    datos.push([arr.idModeloCircuito, arr.nombre, arr.modelo, arr.descripcion]);
                });
            });
        }
    });
    otable = $('#TablaModeloPlacas')
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
                        $('#TablaModeloPlacas'), breakpointDefinition);
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
                title: "IdCircuitp",
                visible: false
            }, {
                title: "Nombre"
            }, {
                title: "Modelo"
            }, {
                title: "Descripción"
            }]
        });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#TablaModeloPlacas thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila

    $('#TablaModeloPlacas tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#TablaModeloPlacas').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });


    // Evento creado para abrir la ventana de editar al dar doble click sobre un
    // registro
    $('#TablaModeloPlacas tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        bootsVal();
        editModeloPlacas();
        edit = 1;

    });
}

function editModeloPlacas() {

    row = $("#TablaModeloPlacas").DataTable().row('.selected').data();
    rows = $("#TablaModeloPlacas").DataTable().row('.selected').data();
    if (row) {

        $("#nombre").val(row[1]);
        $("#modelo").val(row[2]);
        $("#descripcion").val(row[3]);

        $('#divModeloPlacas').hide();
        $('#FormularioModeloPlacas').show();

        $('#btnguardar2').show();
        $('#btnguardar').hide();

    } else {
        showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
    }

}


//Funcion creada para validar campos vacios en formulario
function bootsVal() {
    $('#FormModeloPlacas').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        message: 'Valor invalido',
        fields: {
            nombre: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'El nombre de la placa es obligatorio'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El nombre de la placa no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            descripcion: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'La descripción de la placa es obligatoria'
                    },
                    stringLength: {
                        max: 50,
                        message: 'La descripción de la placa no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            modelo: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'El modelo de la placa es obligatoria'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El modelo de la placa no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
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
        url: 'WSLinPro.asmx/LlenaTablaModeloPlacas',
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
                    datos.push([arr.idModeloCircuito, arr.nombre, arr.modelo, arr.descripcion]);
                });
            });

        }

    });
    otable.clear();
    otable.rows.add(datos);
    otable.draw();
}