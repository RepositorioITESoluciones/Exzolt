var otable;
var url;
var edit = 0;
var rows;
var data;
var idGiroEmpresa = 0;
var nombreEmpresa;
var idGiroEmpresaEdit = 0;
$(function () {
    initEventos();
    initDataTable();
});

function initEventos() {

    $('#btnPlus').click(function () {
        bootsVal();
        $('#divPuestos').hide();
        $('#FormularioPuestos').show();
        $('#btnguardar2').hide();
        $('#btnguardar').show();
    });
    $('#btnAtras').click(function () {
        $('#divPuestos').show();
        $('#FormularioPuestos').hide();
        $('#FormPuestos')[0].reset();
        $('#FormPuestos').bootstrapValidator('destroy');
    });

    $('#btnguardar').click(function () {
        bootsVal();
        $('#FormPuestos').data('bootstrapValidator').validate();
        var n = $('#FormPuestos').data('bootstrapValidator').isValid();
        if (n) {
            $('#divPuestos').show();
            $('#FormularioPuestos').hide();        
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/InsertaWsPuestos',
                data: {
                    nombre: $("#nombre").val(),
                    descripcion: $("#descripcion").val()
                },
                success: function (data) {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Puesto <b>" + $('#nombre').val() + "</b> agregado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormPuestos')[0].reset();
                    $('#FormPuestos').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar').prop("disabled", false);
            bootsVal();
        }
    });

    $('#btnguardar2').click(function () {
        bootsVal();
        $('#FormPuestos').data('bootstrapValidator').validate();
        var n = $('#FormPuestos').data('bootstrapValidator').isValid();
        if (n) {
            $('#divPuestos').show();
            $('#FormularioPuestos').hide();
            var idPuesto = rows[0];
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/ActualizarWsPuestos',
                data: {
                    idPuesto: idPuesto,
                    nombre: $("#nombre").val(),
                    descripcion: $("#descripcion").val()
                },
                success: function () {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Puesto <b>" + rows[1] + "</b> Editado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormPuestos')[0].reset();
                    $('#FormPuestos').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar').prop("disabled", false);
            bootsVal();
        }
    });


    $("#btnDelete").click(function () {
        var row = $('#TablaPuestos').DataTable().row('.selected').data();
        if (row) {
            var idPuesto = row[0];

            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el puesto <b>" + row[1] + "</b>?",
                content: "Una vez eliminado el puesto no podras volver acceder a el.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'WSLinPro.asmx/EliminarWsPuestos',
                        data: {
                            idPuesto: idPuesto
                        },
                        success: function (data) {                       
                            $.smallBox({
                                title: "Éxito!",
                                content: "Puesto <b>" + $('#nombre').val() + "</b> eliminado",
                                color: "#739e73",
                                timeout: 2000,
                                icon: "fa fa-thumbs-up swing animated"
                            });
                            cargarTabla();
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
        editPuestos();
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
        url: 'WSLinPro.asmx/LlenaTablaPuestos',
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
                    datos.push([arr.idPuesto, arr.nombrePuesto, arr.descripcion]);
                });
            });
        }
    });
    otable = $('#TablaPuestos')
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
                        $('#TablaPuestos'), breakpointDefinition);
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
                title: "Id puesto",
                visible: false
            }, {
                title: "Nombre"
            }, {
                title: "Descripción"
            }]
        });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#TablaPuestos thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila

    $('#TablaPuestos tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#TablaPuestos').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });


    // Evento creado para abrir la ventana de editar al dar doble click sobre un
    // registro
    $('#TablaPuestos tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        bootsVal();
        editPuestos();
        edit = 1;

    });
}

function editPuestos() {

    var row;
    row = $("#TablaPuestos").DataTable().row('.selected').data();
    rows = $("#TablaPuestos").DataTable().row('.selected').data();
    if (row) {

        $("#nombre").val(row[1]);
        $("#descripcion").val(row[2]);
        $('#divPuestos').hide();
        $('#FormularioPuestos').show();

        $('#btnguardar2').show();
        $('#btnguardar').hide();

    } else {
        showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
    }

}

//Funcion creada para validar campos vacios en formulario
function bootsVal() {

    $('#FormPuestos').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        message: 'Valor invalido',
        fields: {
            nombre: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'El nombre del puesto es obligatorio'
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
                        message: 'La descripcion del puesto es obligatoria'
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

//Funcion encargada de refrescar la tabla despues de haber creado, editado o eliminado un regustro
function cargarTabla() {
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaPuestos',
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

                    datos.push([arr.idPuesto, arr.nombrePuesto, arr.descripcion]);
                });
            });

        }

    });
    otable.clear();
    otable.rows.add(datos);
    otable.draw();
}