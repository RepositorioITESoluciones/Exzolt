var otable;
var url;
var rows;
var data;
var imagenBase64;
var nombreParametro = "";
$(function () {
    console.log("Hola");
    $("#divAlias").hide();
    initEventos();
});

$("#foto").click(() => {
    $('#myModal').modal('show');
})

function initEventos() {

    $("#tableroPuntuacion").click(function () {
        window.open('tablero.html', '_blank');
    })
    $(".close").remove();
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

    $("#foto").click(function () {
        Webcam.set({
            // live preview size
            width: 490,
            height: 340,

            // device capture size
            dest_width: 640,
            dest_height: 480,

            // final cropped size
            crop_width: 480,
            crop_height: 480,

            // format and quality
            image_format: 'jpeg',
            jpeg_quality: 90,

            // flip horizontal (mirror mode)
            flip_horiz: true
        });

        Webcam.attach('#my_camera');
    })

    $("#btnFoto").click(function () {
        $(".btnOtra").removeClass('hidden');
        $(".btnSave").removeClass('hidden');
        $(".btnFoto").addClass('hidden');
        Webcam.freeze();
    })

    $(".btnOtra").click(function () {
        $(".btnOtra").addClass('hidden');
        $(".btnSave").addClass('hidden');
        $(".btnFoto").removeClass('hidden');
        Webcam.unfreeze();
    })

    $(".btnSave").click(function () {
        Webcam.snap(function (data_uri) {
            $(".btnOtra").addClass('hidden');
            $(".btnSave").addClass('hidden');
            $(".btnFoto").removeClass('hidden');
            $("#img1").attr("src", data_uri);
            Webcam.reset();
            //Webcam.unfreeze();
            Webcam.freeze();
            try {
                 
            }catch(err){
            }
            document.getElementById('my_photo_booth').style.display = 'none';
           
        });
    })

    $(".btnCancelar").click(function () {
        $(".btnOtra").addClass('hidden');
        $(".btnSave").addClass('hidden');
        $(".btnFoto").removeClass('hidden');
        Webcam.unfreeze();
    })

    $('#botonReg').click(function () {
        bootsVal();
        if ($('input#radioSi').is(':checked')) {  
            nombreParametro = $(".alias").val();
        } else {
            nombreParametro = $("#nombre").val();
        }

        var file = document.querySelector('#avatar').files[0];
        if (file == null) {
            imagenBase64 = $('#img1').attr('src');
        } else {
            var reader = new FileReader();
            reader.onload = function (e) {
                imagenBase64 = reader.result;
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };

        }
        //console.log(file);
        $('#formularioRegistro').data('bootstrapValidator').validate();
        var n = $('#formularioRegistro').data('bootstrapValidator').isValid();

        if (n) {
            $('#botonReg').prop("disabled", true);


            $.ajax({
                async: true,
                type: 'POST',
                url: 'WSExzolt.asmx/insertarUsuario',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: '{"nombre": "' + nombreParametro + '", "foto": "' + imagenBase64 + '"}',
                success: function (response) {

                    $('#formularioRegistro').bootstrapValidator('destroy');
                    bootsVal();

                    if (response.d == "Error al insertar") {
                        $.bigBox({
                            title: "<center><p style='font-size: 20px'>¡Advertencia!</p></center>",
                            content: "<center><p style='font-size: 20px'>Se presento un erro al insertar</p></center>",
                            color: "#C46A69",
                            timeout: "3000",
                            icon: "fa fa-times fa-2x fadeInRight animated",
                        });
                    }
                    if (response.d == "El usuario ya existe") {
                        $.bigBox({
                            title: "<center><p style='font-size: 20px'>¡Advertencia!</p></center>",
                            content: "<center><p style='font-size: 20px'>El nombre de jugador <b>" + nombreParametro + "</b> no esta disponible </p></center>",
                            color: "rgb(199, 145, 33)",
                            timeout: "3000",
                            icon: "fa fa-shield fadeInLeft animated",
                        });

                    }
                    if (isNaN(response.d)) {

                        $.bigBox({
                            title: "<center><p style='font-size: 20px'>¡Advertencia!</p></center>",
                            content: "<center><p style='font-size: 20px'>Se presento un erro al insertar</p></center>",
                            color: "#C46A69",
                            timeout: "3000",
                            icon: "fa fa-times fa-2x fadeInRight animated",
                        });

                    } else {
                        $.bigBox({
                            title: "<center><p style='font-size: 20px'>¡Felicidades!</p></center>",
                            content: "<center><p style='font-size: 20px'>Tu número de jugador es : <b>" + response.d + "</b> </p></center>",
                            color: "#739E73",
                            timeout: "3000",
                            icon: "fa fa-check"
                        });
                        $('#nombre').val('');
                        $('#alias').val('');
                        $('#botonReg').prop("disabled", false);
                        $("#avatar").val(null);
                        $("#img1").remove();
                        $("#sectionImg").append(" <img id='img1' width='50px' height='50px'>");
                    }
                }
            });

            //console.log("Lo que trae: " + nombreParametro);
            //$.ajax({
            //    async: true,
            //    type: 'POST',
            //    url: 'WSExzolt.asmx/verifiaSesion',
            //    dataType: 'json',
            //    contentType: 'application/json; charset=utf-8',
            //    data: '{"nombre": "' + nombreParametro + '"}',
            //    success: function (response) {
            //        $('#formularioRegistro').bootstrapValidator('destroy');
            //        bootsVal();
            //        if (response.d == "true" || response.d == true) {
            //            $.bigBox({
            //                title: "<center><p style='font-size: 20px'>¡Advertencia!</p></center>",
            //                content: "<center><p style='font-size: 20px'>El nombre de jugador <b>" + nombreParametro + "</b> no esta disponible </p></center>",
            //                color: "rgb(199, 145, 33)",
            //                timeout: "3000",
            //                icon: "fa fa-shield fadeInLeft animated",
            //            });

            //            $('#botonReg').prop("disabled", false);
            //        } else {
                        
            //        }
            //    }
            //});
        } else {
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
    } catch (err) { }
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = document.getElementById('img1');
        img.src = event.target.result.toString();

        imagenBase64 = event.target.result.toString();
    }
    try {
        reader.readAsDataURL(file);
    } catch (err) { }

}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new BlobBuilder();
    bb.append(ab);
    console.log(bb.getBlob(mimeString));
    return bb.getBlob(mimeString);
}

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        //imagenBase64 = reader.result;
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}