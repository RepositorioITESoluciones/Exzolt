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

    var f = new Date();

    $("#fecha").val(f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear());
    $('#fecha').prop('readonly', true);

    $('#btnPlus').click(function () {
        bootsVal();
        $('#divTipoAlmacen').hide();
        $('#FormularioTipoAlmacen').show();
        $('#btnguardar2').hide();
        $('#btnguardar').show();
        url = 'WSLinPro.asmx/insertaWsTipoAlmacen';

    });
    $('#btnAtras').click(function () {
        $('#FormularioTipoAlmacen').hide();
        $('#divTipoAlmacen').show();
        $('#FormTipoAlmacen')[0].reset();
        $('#FormTipoAlmacen').bootstrapValidator('destroy');
    });


    $('#btnguardar').click(function () {
        bootsVal();
        $('#FormTipoAlmacen').data('bootstrapValidator').validate();
        var n = $('#FormTipoAlmacen').data('bootstrapValidator').isValid();
        if (n) {
            $('#divTipoAlmacen').show();
            $('#FormularioTipoAlmacen').hide();
            console.log($("#nombre").val());
            console.log($("#descripcion").val());
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/insertaWsTipoAlmacen',
                data: {
                    nombre: $("#nombre").val(),
                    descripcion: $("#descripcion").val()
                },
                success: function (data) {               
                    $.smallBox({
                        title: "Éxito!",
                        content: "Tipo de almacén <b>" + $('#nombre').val() + "</b> agregado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });           
                    cargarTabla();
                    $('#FormTipoAlmacen')[0].reset();
                    $('#FormTipoAlmacen').bootstrapValidator('destroy');
                }
            })
        } else {

            $('#btnguardar').prop("disabled", false);
            bootsVal();
        }
    });

    $('#btnguardar2').click(function () {
        bootsVal();
        $('#FormTipoAlmacen').data('bootstrapValidator').validate();
        var n = $('#FormTipoAlmacen').data('bootstrapValidator').isValid();
        if (n) {
            $('#divTipoAlmacen').show();
            $('#FormularioTipoAlmacen').hide();
            console.log("rows[0]: " + rows[0]);
            console.log("rows[1]: " + rows[1]);
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/ActualizarWsTipoAlmacen',
                data: {
                    idTipoAlmacen: rows[0],
                    nombre: $("#nombre").val(),
                    descripcion: $("#descripcion").val()
                },
                success: function () {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Tipo de almacén <b>" + rows[1] + "</b> Editado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
                    $('#FormTipoAlmacen')[0].reset();
                    $('#FormTipoAlmacen').bootstrapValidator('destroy');
                }
            })
        } else {
            $('#btnguardar2').prop("disabled", false);
            bootsVal();
        }   
    });


    $("#btnDelete").click(function () {
        var row = $('#TablaTipoAlmacen').DataTable().row('.selected').data();
        if (row) {
            var idTipoAlmacen = row[0];
            console.log("cccccccccc: " + idTipoAlmacen);
            console.log("ddddd: " + row);
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el tipo de almacén <b>" + row[1] + "</b>?",
                content: "Una vez eliminado el tipo del almacén no podras volver acceder a el.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'WSLinPro.asmx/EliminarWsTipoAlmacen',
                        data: {
                            idTipoAlmacen: idTipoAlmacen
                        },
                        success: function (data) {
                            $.smallBox({
                                title: "Éxito!",
                                content: "tipo de almacén <b>" + $('#nombre').val() + "</b> eliminado",
                                color: "#739e73",
                                timeout: 2000,
                                icon: "fa fa-thumbs-up swing animated"
                            });
                            cargarTabla();
                            $('#FormTipoAlmacen')[0].reset();
                            $('#FormTipoAlmacen').bootstrapValidator('destroy');
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
        editTipoAlmacen();
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
        url: 'WSLinPro.asmx/LlenaTablaTipoAlmacen',
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
                    datos.push([arr.idTipoAlmacen, arr.nombre, arr.descripcion]);
                });
            });
        }
    });
    otable = $('#TablaTipoAlmacen')
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
                        $('#TablaTipoAlmacen'), breakpointDefinition);
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
                title: "Nombre"
            }, {
                title: "Descripción"
            }]
        });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#TablaTipoAlmacen thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila

    $('#TablaTipoAlmacen tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#TablaTipoAlmacen').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });


    // Evento creado para abrir la ventana de editar al dar doble click sobre un
    // registro
    $('#TablaTipoAlmacen tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        bootsVal();
        editTipoAlmacen();
        edit = 1;

    });
}

function editTipoAlmacen() {
    var row;
    row = $("#TablaTipoAlmacen").DataTable().row('.selected').data();
    rows = $("#TablaTipoAlmacen").DataTable().row('.selected').data();
    if (row) {      
        $("#nombre").val(row[1]);
        $("#descripcion").val(row[2]);
        $('#divTipoAlmacen').hide();
        $('#FormularioTipoAlmacen').show();

        $('#btnguardar2').show();
        $('#btnguardar').hide();
    } else {
        showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
    }

}



//Funcion creada para validar campos vacios en formulario
function bootsVal() {
    console.log("dsdasd");
    $('#FormTipoAlmacen').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        message: 'Valor invalido',
        fields: {
            nombre: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'El nombre del del tipo de almacén es obligatorio'
                    },
                regexp: {
                    regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                    message: 'Solo caracteres alfanúmericos'
                },
                stringLength: {
                    max: 100,
                    message: 'La nombre del tipo de almacén no puede tener más de 200 caracteres'
                }
                }
            },
            descripcion: {
                group: '.col-6',
                validators: {
                    notEmpty: {
                        message: 'La descripción del tipo de almacén es obligatoria'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 100,
                        message: 'La descripción del tipo de almacén no puede tener más de 100 caracteres'
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
        url: 'WSLinPro.asmx/LlenaTablaTipoAlmacen',
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

                    datos.push([arr.idTipoAlmacen, arr.nombre, arr.descripcion]);
                });
            });
        }
    });

    otable.clear();
    otable.rows.add(datos);
    otable.draw();
}