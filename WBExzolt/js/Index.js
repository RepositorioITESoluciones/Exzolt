function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    var tiempo = new Date();
    var fecha = new Date();

    var hora = tiempo.getHours();
    var minuto = tiempo.getMinutes();
    var segundo = tiempo.getSeconds();

    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var año = fecha.getFullYear();

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    window.location = ("Login.html");
    console.log("Session eliminada");
}
/**
 * Función que muestra el mensaje de color azul
 * @param titulo
 * @param mensaje
 * @returns
 */

function showOkMessage(titulo, mensaje) {
    $.smallBox({
        title: titulo,
        content: mensaje,
        color: "#296191",
        timeout: 4000,
        icon: "fa fa-thumbs-o-up swing animated"
    });
}

/**
 * Función que muestra el mensaje de color rojo
 * @param titulo
 * @param mensaje
 * @returns
 */
function showErrorMessage(titulo, mensaje) {
    $.smallBox({
        title: titulo,
        content: mensaje,
        color: "#c79121",
        timeout: 4000,
        icon: "fa fa-times-circle swing animated"
    });
}

/**
 * Función que muestra el mensaje de color amarillo
 * @param titulo
 * @param mensaje
 * @returns
 */
function showWarningMessage(titulo, mensaje) {
    $.smallBox({
        title: titulo,
        content: mensaje,
        color: "#C79121",
        timeout: 4000,
        icon: "fa fa-exclamation-circle swing animated"
    });
}

//function comboDepartamentos() {
//    var cadenaCombodepartamentosPiezas = ""; 
//    $.ajax({
//        async: false,
//        type: 'POST',
//        url: 'WSLinPro.asmx/departamento',
//        dataType: 'json',
//        contentType: 'application/json; charset=utf-8',
//        success: function (response) {
//            $.each(response, function (row, index) {
//                cadenaCombodepartamentosPiezas += '<option value="' + 0 + '"> Seleccione una opción </option>'
//                $.each(index.ListaRegistros, function (r, arr) {
//                   // console.log("AAAggggggggAA: " + JSON.stringify(arr));
//                    cadenaCombodepartamentosPiezas += '<option value="' + arr.departamento.idDepartamento + '">' + arr.departamento.nombreDepartamento + '</option>'
                    
//                });
//            });     
//        }
//    });
//    return cadenaCombodepartamentosPiezas;
//}

function datetimeToDateFormat(date) {
    var fecha = date.substr(6, 13);
    var fechaAlta = new Date(parseInt(fecha));
    var day = fechaAlta.getDate();
    var month = fechaAlta.getMonth() + 1;
    var year = fechaAlta.getFullYear();
    var hours = fechaAlta.getHours();
    var minutes = fechaAlta.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + year + " " + strTime;
}

function datetimeToFechaBaja(date) {
    var date = new Date()
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + year + " " + strTime;
}

function eliminaEspacio(e, object) {
    var val = object.value.trim();
    var type = object.type;
    var id = object.id;
    var regex = /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/;
    tecla = (document.all) ? e.keyCode : e.which;
    if (val.length === 0 && tecla === 32) {
        return false;
    }
    //else {
    //    if (type === 'text' && val.length >= 0) {
    //        console.log("value " + val.length);
    //        console.log(val.match(regex));
    //        if (regex.test(val) !== true) {
    //            $("#" + id).parent().addClass("has-error");
    //            $("#" + id + " + small").text('Solo caracteres alfanumericos');
    //            $("#" + id + " + small").css('display', 'block');
    //            return false; 
    //        } 
    //    } else {
    //        $("#" + id).blur(function () {
    //            if ($("#" + id).val().length === 0) {
    //                $("#"+ id +"+ small").text('El '+id+' es obligatorio');
    //            }
    //        });
    //    }
    //}
}
