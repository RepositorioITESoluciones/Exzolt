var otable;
var url;
var rows;
var data;
$(function () {
    console.log("Hola");
    initEventos();
   
    
});
function initEventos() {
    initDataTable();
    setInterval(cargarTabla, 2000);
}

function initDataTable() {
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
        url: 'WSExzolt.asmx/tableroPuntaje',
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
            $.each(response, function(row, index){
                $.each(index, function (r, arr) {
                    datos.push([arr.nombre, arr.nIntentos, arr.score]);
                });
            });
        }
    });
    otable = $('#TablaPuntaje').DataTable({

        "aLengthMenu": [
            [10, 25, 50],
            [10, 25, 50]
        ],
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6 hidden-xs'l><'col-sm-6 col-xs-12 hidden-xs'<'toolbar'>>r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
        "oLanguage": {
            "sUrl": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "paging": false,
        "ordering": false,
        "info": false,
        "autoWidth": true,
        "scrollY": "400px",
        "scrollCollapse": true,
        "preDrawCallback": function () {
            if (!responsiveHelper_datatable_fixed_column) {
                responsiveHelper_datatable_fixed_column = new ResponsiveDatatablesHelper(
                    $('#TablaPuntaje'), breakpointDefinition);
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
            title: "Jugador",
            visible: true
        }, {
            title: "Intentos"
        }, {
            title: "Puntuación"
        }]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#TablaPuntaje thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#TablaPuntaje tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#TablaPuntaje').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });


    // Evento creado para abrir la ventana de editar al dar doble click sobre un
    // registro
    $('#TablaPuntaje tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        bootsVal();
        editAlmacen();
        edit = 1;
    });
}



//Funcion encargada de refrescar la tabla despues de haber creado, editado o eliminado un regustro
function cargarTabla() {
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSExzolt.asmx/tableroPuntaje',
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
                $.each(index, function (r, arr) {
                    datos.push([arr.nombre, arr.nIntentos, arr.score]);
                });
            });
        }
    });
    otable.clear();
    otable.rows.add(datos);
    otable.draw();
}
