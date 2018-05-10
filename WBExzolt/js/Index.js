﻿var otable;
var url;
var rows;
var data;
var nombreParametro = "";
$(function () {
    console.log("Hola");
    $("#divAlias").hide();
    initEventos();
});
function initEventos() {

    $("#tableroPuntuacion").click(function () {
        window.open('tablero.html', '_blank');
    })

    $('input#radioNo').prop("checked", "checked");
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
      

        if ($('input#radioSi').is(':checked')) {
            //$('input#radioNo').prop("checked", false);
            //$('input#radioSi').prop("checked", "checked");
            nombreParametro = $(".alias").val();
        } else {
            //$('input#radioSi').prop("checked", false);
            //$('input#radioNo').prop("checked", "checked");
            nombreParametro = $("#nombre").val();
        }

        $('#formularioRegistro').data('bootstrapValidator').validate();
        var n = $('#formularioRegistro').data('bootstrapValidator').isValid();

        if (n) {
            $('#botonReg').prop("disabled", true);

            console.log("Lo que trae: " + nombreParametro);
            $.ajax({
                async: true,
                type: 'POST',
                url: 'WSExzolt.asmx/verifiaSesion',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: '{"nombre": "' + nombreParametro + '"}',
                success: function (response) {
                    console.log("Respuesta: " + response.d);
                    $('#formularioRegistro').bootstrapValidator('destroy');
                    bootsVal();
                    if (response.d == "true" || response.d == true) {
                        $.bigBox({
                            title: "<center><p style='font-size: 20px'>¡Advertencia!</p></center>",
                            content: "<center><p style='font-size: 20px'>El nombre de jugador <b>" + nombreParametro + "</b> no esta disponible </p></center>",
                            color: "rgb(199, 145, 33)",
                            timeout: "3000",
                            icon: "fa fa-shield fadeInLeft animated",
                        });

                        $('#botonReg').prop("disabled", false);
                    } else {
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
                                    timeout: "3000",
                                    icon: "fa fa-check"
                                });
                                //$('#formularioRegistro')[0].reset();
                                $('#nombre').val('');
                                $('#alias').val('');
                                $('#botonReg').prop("disabled", false);
                                $("#avatar").val(null);
                                $("#img1").remove();
                                $("#sectionImg").append(" <img id='img1' width='50px' height='50px'>");
                            }
                        });
                    }
                }
            });
        } else {
            //$('#botonReg').prop("disabled", false);
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
    try {
        var file = event.target.files[0];
    }
    catch (err) {
    }
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = document.getElementById('img1');
        img.src = event.target.result;
    }
    try {
        reader.readAsDataURL(file);
    }
    catch (err) {
    }

}
