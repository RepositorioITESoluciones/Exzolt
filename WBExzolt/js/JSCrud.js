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

        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $('#btnguardar2').hide();
        $('#btnguardar').show();
        url = 'WSLinPro.asmx/insertaWs';

    });
    $('#btnAtras').click(function () {

        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();



    });
    $('#btnguardar').click(function () {

        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();

        $.ajax({
            async: false,
            type: 'POST',
            url: url,
            data: $('#FormEjemplo').serializeArray(),
    
            success: function () {
               
                    $.smallBox({
                        title: "Éxito!",
                        content: "Usuario <b>" + $('#nombre').val() + "</b> agregado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                
                

                var datos = [];
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'WSLinPro.asmx/LlenaTabla',
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

                                datos.push([arr.nombre, arr.apellidos, arr.edad, arr.email, arr.idUsuario]);
                            });
                        });

                    }

                });
               

                otable.clear();
                otable.rows.add(datos);
                otable.draw();
            }
        })


    });
    $('#btnguardar2').click(function () {

        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();

        $.ajax({
            async: false,
            type: 'POST',
            url: url,
            data: {
                idUsuario: rows[4],
                nombre:$("#nombre").val(),
                apellido:$("input#apellido").val(),
                edad:$("input#edad").val(),
                email:$("input#email").val()
            },

            success: function () {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Usuario <b>" + rows[0] + "</b> Editado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
               


                var datos = [];
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'WSLinPro.asmx/LlenaTabla',
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

                                datos.push([arr.nombre, arr.apellidos, arr.edad, arr.email, arr.idUsuario]);
                            });
                        });

                    }

                });


                otable.clear();
                otable.rows.add(datos);
                otable.draw();
            }
        })


    });
    $("#btnDelete").click(function () {
        var row = $('#TablaDetalle').DataTable().row('.selected').data();
        if (row) {

            var idUsuario = row[4];

            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el usuario <b>" + row[0] + "</b>?",
                content: "Una vez eliminada la Transaccion no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {


                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/eliminarWs',
                        data: JSON.stringify({ idUsuario: idUsuario }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (output) {



                            $.each(output, function (j, cam) {

                                
                                    showOkMessage('Transaccion Eliminada', 'Se ha Eliminado la Transaccion <b>' + row[0] + '<b>');

                                    var datos = [];
                                $.ajax({
                                    async: false,
                                    type: 'POST',
                                    url: 'WSLinPro.asmx/LlenaTabla',
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

                                                datos.push([arr.nombre, arr.apellidos, arr.edad, arr.email, arr.idUsuario]);
                                            });
                                        });

                                    }

                                });

                                    otable.clear();
                                    otable.rows.add(datos);
                                    otable.draw();
                                

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
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');

        }

    })
    $("#btnEdit").click(function () {
        editUsuario();
        $('#btnguardar2').show();
        $('#btnguardar').hide();
        edit = 1;
    })
    var cadena = "";

    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboWS',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {  
            $.each(response, function (row, index) {
                $.each(index.listaReg, function (r, arr) {
                    cadena += '<option value="'+arr.idArea+'">'+arr.descripcion+'</option>'
                    //datos.push([arr.nombre, arr.apellidos, arr.edad, arr.email, arr.idUsuario]);
                });
            });

            console.log(cadena);

            $("#SelectPrueba").html(cadena);
        }

    });



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
        url: 'WSLinPro.asmx/LlenaTabla',
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

                    datos.push([arr.nombre, arr.apellidos, arr.edad, arr.email, arr.idUsuario]);
                });
            });

        }

    });
     otable = $('#TablaDetalle')
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
                        $('#TablaDetalle'), breakpointDefinition);
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
                title: "Nombre"
            },
            {
                title: "Apelliedos"
            },
            {
                title: "Edad"
            },
            {
                title: "Correo"
            }
            ]
        });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#TablaDetalle thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#TablaDetalle tbody').on(
        'click',
        'tr',
        function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $('#dtTiposTransaccion').DataTable().$('tr.selected').removeClass(
                    'selected');
                $(this).addClass('selected');
            }
        });
    // Evento creado para abrir la ventana de editar al dar doble click sobre un
    // registro
    $('#TablaDetalle tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');        
        editUsuario();
        edit = 1;

    });
}
function editUsuario() {

    
    var row = $("#TablaDetalle").DataTable().row('.selected').data();
    rows = $("#TablaDetalle").DataTable().row('.selected').data();
    if (row) {
        console.log(row[0],row[1],row[2],row[3]);
        $("#nombre").val(row[0]);
        $("input#apellido").val(row[1]);
        $("input#edad").val(row[2]);
        $("input#email").val(row[3]);

        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();

        $('#btnguardar2').show();
        $('#btnguardar').hide();

        url = 'WSLinPro.asmx/ActualisarWs';

        var datos = [];
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/LlenaTabla',
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

                        datos.push([arr.nombre, arr.apellidos, arr.edad, arr.email, arr.idUsuario]);
                    });
                });

            }

        });

        otable.clear();
        otable.rows.add(datos);
        otable.draw();
    } else {
        showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
    }
    
}






