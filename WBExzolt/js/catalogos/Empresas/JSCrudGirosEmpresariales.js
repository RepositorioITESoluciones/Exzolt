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
    bootsVal();

    $('#btnPlus').click(function () {
        bootsVal();
        $('#divGirosEmpresariales').hide();
        $('#FormularioGirosEmpresariales').show();
        $('#btnguardar2').hide();
        $('#btnguardar').show();
        url = 'WSLinPro.asmx/insertaWsGE';

    });
    $('#btnAtras').click(function () {
        $('#divGirosEmpresariales').show();
        $('#FormularioGirosEmpresariales').hide();
        $('#FormGiroEmpresarial')[0].reset();
        $('#FormGiroEmpresarial').bootstrapValidator('destroy');
    });

    //Funcion encargada de insertar un registro
    $('#btnguardar').click(function () {
        bootsVal();
        $('#FormGiroEmpresarial').data('bootstrapValidator').validate();
        var n = $('#FormGiroEmpresarial').data('bootstrapValidator').isValid();
        if (n) {          
            $('#divGirosEmpresariales').show();
            $('#FormularioGirosEmpresariales').hide();
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/insertaWsGE',
                data: {
                    nombre: $("#nombre").val()
                },
                success: function (data) {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Usuario <b>" + $('#nombre').val() + "</b> agregado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });              
                    cargarTabla();
                    $('#FormGiroEmpresarial')[0].reset();
                    $('#FormGiroEmpresarial').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar').prop("disabled", false);
            bootsVal();
        }
    });

    //Funcion encargada de editar un registro
    $('#btnguardar2').click(function () {
        bootsVal();
        $('#FormGiroEmpresarial').data('bootstrapValidator').validate();
        var n = $('#FormGiroEmpresarial').data('bootstrapValidator').isValid();
        if (n) {
            $('#divGirosEmpresariales').show();
            $('#FormularioGirosEmpresariales').hide();         
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/ActualizarWsGE',
                data: {
                    nombre: $("#nombre").val(),
                    idGiro: rows[1]
                },
                success: function () {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Usuario <b>" + rows[0] + "</b> Editado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormGiroEmpresarial')[0].reset();
                    $('#FormGiroEmpresarial').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar2').prop("disabled", false);
            bootsVal();
        }
    });

    //Funcion encargada de eliminar logicamente un registro
    $("#btnDelete").click(function () {
        var row = $('#TablaGirosEmpresariales').DataTable().row('.selected').data();
        if (row) {
            var idGiro = row[1];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el giro empresarial <b>" + row[0] + "</b>?",
                content: "Una vez eliminado el giro empresarial no podras volver acceder a el.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'WSLinPro.asmx/EliminarWsGE',
                        data: {
                            idGiro: idGiro
                        },
                        success: function (data) {
                            $.smallBox({
                                title: "Éxito!",
                                content: "giro de empresa <b>" + $('#nombre').val() + "</b> eliminado",
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
        editGiroEmpresarial();
        $('#btnguardar2').show();
        $('#btnguardar').hide();
        edit = 1;
    })

}
//Funcion encargada de inicializar el data table
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
        url: 'WSLinPro.asmx/LlenaTablaGE',
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
                    datos.push([arr.nombre, arr.idGiro]);
                });
            });
        }
    });
    otable = $('#TablaGirosEmpresariales')
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
                        $('#TablaGirosEmpresariales'), breakpointDefinition);
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
                title: "Nombre del giro empresarial"
            }]
        });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#TablaGirosEmpresariales thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila

    $('#TablaGirosEmpresariales tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#TablaGirosEmpresariales').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });


    // Evento creado para abrir la ventana de editar al dar doble click sobre un
    // registro
    $('#TablaGirosEmpresariales tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        bootsVal();
        editGiroEmpresarial();
        edit = 1;

    });
}

//Funcion encargada  de llenar el formulario con los datos de la BD
function editGiroEmpresarial() {

    var row;
    row = $("#TablaGirosEmpresariales").DataTable().row('.selected').data();
    rows = $("#TablaGirosEmpresariales").DataTable().row('.selected').data();
    if (row) {
        
        $("#nombre").val(row[0]);
        $('#divGirosEmpresariales').hide();
        $('#FormularioGirosEmpresariales').show();
        $('#btnguardar2').show();
        $('#btnguardar').hide();
        url = 'WSLinPro.asmx/ActualizarWsGE';
    } else {
        showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
    }

}

//Funcion creada para validar campos vacios en formulario
function bootsVal() {
    $('#FormGiroEmpresarial').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        message: 'Valor invalido',
        fields: {
            nombre: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'El nombre del giro empresarial es obligatorio'
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
        url: 'WSLinPro.asmx/LlenaTablaGE',
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

                    datos.push([arr.nombre, arr.idGiro]);
                });
            });

        }

    });
    otable.clear();
    otable.rows.add(datos);
    otable.draw();
}