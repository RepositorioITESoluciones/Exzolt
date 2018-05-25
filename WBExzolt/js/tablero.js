var otable;
var url;
var rows;
var data;
$(function () {
    //console.log("Hola");
    initEventos();
   
    
});
function initEventos() {
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSExzolt.asmx/tableroPuntaje',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            
            var filas = data.d.length;
            var numero = 0;
            var nuevafila = "";

            var tblnumero=""            
            var tblnombre=""
            var tblacaros=""
            var tblgallinas=""
            var tblintentos=""
            var tblpuntaje = ""


               for (i = 0 ; i < filas; i++) { //cuenta la cantidad de registros

                    console.log(i+": "+ data.d[i].nombre);
                    numero = i + 1;
                    nuevafila += "<tr class='trstyle'>"
                    nuevafila += "<td>" + numero + "</td>"
                    nuevafila += "<td class='tdstylos' style='text-align: left !IMPORTANT;'><img style='width:35px; height: 35px !Importan; ' src='" + data.d[i].foto + "'/>    " + data.d[i].nombre + "</td>"
                    nuevafila += "<td class='tdstyleleft'>" + data.d[i].nAcaros + "</td>"
                    nuevafila += "<td class='tdstylos'>" + data.d[i].nGallinas + "</td>"
                    nuevafila += "<td class='tdstyleleft'>" + data.d[i].nIntentos + "</td>"
                    nuevafila += "<td>" + data.d[i].puntaje + "</td>"
                    nuevafila += "</tr>"
                    
                }
            $("#tbodyTabla").append(nuevafila) 

            //for (i = 0 ; i < filas; i++) { //cuenta la cantidad de registros

            //    console.log(i+": "+ data.d[i].nombre);
            //    numero = i + 1;
            //    nuevafila += "<tr class='trstyle'>"
            //    //tblnumero += "<td class='trstyle'>" + numero + "</td>"
            //    tblnombre += "<td class='trstyle'style='text-align: left !IMPORTANT;'>" + numero + " <img style='width:35%; height:35% !Importan; ' src='" + data.d[i].foto + "'/>    " + data.d[i].nombre + "</td>"
            //    //nuevafila += "<td class='tdstylos'>" + data.d[i].nombre + "</td>"
            //    tblacaros += "<td class='trstyle'>" + data.d[i].acaro + "</td>"
            //    tblgallinas += "<td class='trstyle'>" + data.d[i].gallina + "</td>"
            //    tblintentos += "<td class='trstyle'>" + data.d[i].nIntentos + "</td>"
            //    tblpuntaje += "<td class='trstyle'>" + data.d[i].score + "</td>"
            //    nuevafila += "</tr>"

            //}



            //$("#tblnumero").append(tblnumero)
            //$("#tblnombre").append(tblnombre)
            //$("#tblacaros").append(tblacaros)
            //$("#tblgallinas").append(tblgallinas)
            //$("#tblintentos").append(tblintentos)
            //$("#tblpuntaje").append(tblpuntaje)
        }
    });


    //initDataTable();
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
    $("#tbodyTabla").empty();
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSExzolt.asmx/tableroPuntaje',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {

            var filas = data.d.length;
            var numero = 0;
            var nuevafila = "";

            var tblnumero = ""
            var tblnombre = ""
            var tblacaros = ""
            var tblgallinas = ""
            var tblintentos = ""
            var tblpuntaje = ""


            for (i = 0 ; i < filas; i++) { //cuenta la cantidad de registros

                console.log(i + ": " + data.d[i].nombre);
                numero = i + 1;
                nuevafila += "<tr class='trstyle'>"
                nuevafila += "<td>" + numero + "</td>"
                nuevafila += "<td class='tdstylos' style='text-align: left !IMPORTANT;'><img style='width:35px; height: 35px !Importan; ' src='" + data.d[i].foto + "'/>    " + data.d[i].nombre + "</td>"
                nuevafila += "<td class='tdstyleleft'>" + data.d[i].nAcaros + "</td>"
                nuevafila += "<td class='tdstylos'>" + data.d[i].nGallinas + "</td>"
                nuevafila += "<td class='tdstyleleft'>" + data.d[i].nIntentos + "</td>"
                nuevafila += "<td>" + data.d[i].puntaje + "</td>"
                nuevafila += "</tr>"

            }
            $("#tbodyTabla").append(nuevafila)

            //for (i = 0 ; i < filas; i++) { //cuenta la cantidad de registros

            //    console.log(i+": "+ data.d[i].nombre);
            //    numero = i + 1;
            //    nuevafila += "<tr class='trstyle'>"
            //    //tblnumero += "<td class='trstyle'>" + numero + "</td>"
            //    tblnombre += "<td class='trstyle'style='text-align: left !IMPORTANT;'>" + numero + " <img style='width:35%; height:35% !Importan; ' src='" + data.d[i].foto + "'/>    " + data.d[i].nombre + "</td>"
            //    //nuevafila += "<td class='tdstylos'>" + data.d[i].nombre + "</td>"
            //    tblacaros += "<td class='trstyle'>" + data.d[i].acaro + "</td>"
            //    tblgallinas += "<td class='trstyle'>" + data.d[i].gallina + "</td>"
            //    tblintentos += "<td class='trstyle'>" + data.d[i].nIntentos + "</td>"
            //    tblpuntaje += "<td class='trstyle'>" + data.d[i].score + "</td>"
            //    nuevafila += "</tr>"

            //}



            //$("#tblnumero").append(tblnumero)
            //$("#tblnombre").append(tblnombre)
            //$("#tblacaros").append(tblacaros)
            //$("#tblgallinas").append(tblgallinas)
            //$("#tblintentos").append(tblintentos)
            //$("#tblpuntaje").append(tblpuntaje)
        }
    });
}
