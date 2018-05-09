var otable;
var url;
var rows;
var data;
$(function () {
    initEventos();
});
function initEventos() {
    var inputFile = document.getElementById('avatar');
    inputFile.addEventListener('change', mostrarImagen, false);
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
        var nombreParametro = "";

        if ($('input#radioSi').is(':checked')) {
            nombreParametro = $("#alias").val();
        } else {
            nombreParametro = $("#nomnbre").val();
        }

        $('#formularioRegistro').data('bootstrapValidator').validate();
        var n = $('#formularioRegistro').data('bootstrapValidator').isValid();
        if (n) {
            $.ajax({
                async: true,
                type: 'POST',
                url: 'WSExzolt.asmx/insertarUsuario',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: '{"nombre": "' + nombreParametro + '"}',
                success: function (response) {
                    $.bigBox({
                        title: "<center><p style='font-size: 20px'>¡Felicidades!</p></center>",
                        content: "<center><p style='font-size: 20px'>Tu numero de jugador es : <b>" + response.d + "</b> </p></center>",
                        color: "#739E73",
                        timeout: "5000",
                        icon: "fa fa-check"
                    });
                    $('#botonReg').prop("disabled", false);
                    $('#nombre').val('');
                    $('#alias').val('');
                }
            });
        } else {
            $('#botonReg').prop("disabled", false);
            bootsVal();
        }
    });
}

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
function showOkMessage(titulo, mensaje) {
    $.smallBox({
        title: titulo,
        content: mensaje,
        color: "#296191",
        timeout: 4000,
        icon: "fa fa-thumbs-o-up swing animated"
    });
}

function mostrarImagen(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = document.getElementById('img1');
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
}
