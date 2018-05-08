var otable;
var url;
var edit = 0;
var rows;
var data;
var cadenaImgMaquina = "";
var cadenaComboPlaca = "";

$(function () {
    initEventos();
});
function initEventos() {

    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/ConsultarMaqinariaPlacas',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var countSelectPlaca = 0;
            $.each(response, function (row, index) {
                cadenaComboPlaca += '<option value="' + 0 + '"> Seleccione una opción </option>'
                $.each(index.ListaRegistros, function (r, arr) {
                    console.log("AAA: " + index.ListaRegistros.length);
                    if (countSelectPlaca + 1 = index.ListaRegistros.length){

                    }
                    cadenaComboPlaca += '<option value="' + arr.idPlaca + '">' + arr.nombrePlaca + '</option>'
                    cadenaImgMaquina += '<section class="col col-4"><label>' + arr.nombreMaquina + '<img id="' + arr.idMaquina + '" class="img-responsive" src="../img/maquina.jpg"/></label> <select class="form-control combo_' + countSelectPlaca + '" id="placa_' + countSelectPlaca + '">'+cadenaComboPlaca+' </select></section>';
                   
                    $("#divMaquinas").html(cadenaImgMaquina);
                    $("#placa_" + countSelectPlaca).html(cadenaComboPlaca);
                    console.log("ARR: " + JSON.stringify(arr));
                    countSelectPlaca++;
                    console.log(countSelectPlaca);
                });
            });
           
        }
    });

    $('#btnPlus').click(function () {

        $('#divPlacas').hide();
        $('#FormularioPlacas').show();
        $('#btnguardar2').hide();
        $('#btnguardar').show();   

    });
    $('#btnAtras').click(function () {
        $('#divPlacas').show();
        $('#FormularioPlacas').hide();
    });

    $('#btnguardar').click(function () {

        $('#divPlacas').show();
        $('#FormularioPlacas').hide();

        console.log($("#direccionMAC").val());
        console.log($("#fechaAlta").val());
        console.log($("#fechaBaja").val());
        console.log($("#descripcion").val());
        console.log($("#direccionIP").val());
        console.log($("#modeloCircuito").val());
        console.log($("#numSerie").val());

        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/InsertaWsPlacas',
            data: {
                direccionMAC: $("#direccionMAC").val(),
                fechaAlta: $("#fechaAlta").val(),
                fechaBaja: $("#fechaBaja").val(),
                descripcion : $("#descripcion").val(),
                direccionIp : $("#direccionIP").val(),
                modeloCircuito : $("#modeloCircuito").val(),
                noSerie: $("#numSerie").val()
            },    
            success: function (data) {               
                    $.smallBox({
                        title: "Éxito!",
                        content: "Placa <b>" + $('#nombre').val() + "</b> agregada",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    cargarTabla();
            }
        })
    });

    $('#btnguardar2').click(function () {
     
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
;
            }
        })
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
                                content: "Placa <b>" + $('#nombre').val() + "</b> eliminada",
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
        editPlacas();
        $('#btnguardar2').show();
        $('#btnguardar').hide();
        edit = 1;
    });
    //var cadena = "";
//}

   
    function editPlacas() {

        row = $("#TablaPlacas").DataTable().row('.selected').data();
        rows = $("#TablaPlacas").DataTable().row('.selected').data();
        if (row) {

            console.log(row);
            //console.log($("#direccionMAC").val());
            //console.log($("#fechaAlta").val());
            //console.log($("#fechaBaja").val());
            //console.log($("#descripcion").val());
            //console.log($("#direccionIP").val());
            //console.log($("#modeloCircuito").val());
            //console.log($("#numSerie").val());

            $("#direccionMAC").val(row[1]);

            var myDate = new Date(row[2]);
            $("#fechaAlta").val(myDate);
            

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





