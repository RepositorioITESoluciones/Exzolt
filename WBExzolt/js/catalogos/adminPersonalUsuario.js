
$(function () {

    initEventos();
    initDataTable();
    llenaComboPuestos();
    llenaComboRoles();
    LlenaCheckBoxPrivilegios();
    llenaComboPersonal();
    llenaComboEstados();
});

function initEventos() {
    //boton plus q invoca el evento de insertar
    $('#btnPlus').click(function () {
        //Deja el formulario de alta de personal y usuario visible
        $("#radioPersonal").show();
        llenaComboPersonal();
        $("#personaS").hide();
        $("#altaPersS").show();
        $("#nombreS").show();
        $("#apPaternoS").show();
        $("#apMaternoS").show();
        $("#RFCS").show();
        $("#CPS").show();
        $("#estadoS").show();
        $("#puestoS").show();
        $("#emailS").show();
        $("#accesoS").show();
        document.getElementById("acceso").checked = false;
        $("#privile").show();
        $("#privileEdit").hide();
        $("#privi").val(null);

        var row = $("#TablaDetalle").DataTable().row('.selected').data();
        if (row) {
            $('#TablaDetalle').DataTable().$('tr.selected').removeClass('selected');
        }
        document.getElementById("FormAltaPersonal").reset();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $('#btnguardar').show();
    });

    //boton atras
    $('#btnAtras').click(function () {
        $('#FormAltaPersonal').bootstrapValidator('destroy');
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    //boton editar
    $("#btnEdit").click(function () {

        var row = $("#TablaDetalle").DataTable().row('.selected').data();
        if (row) {
            $("#radioPersonal").hide();
            $("#personaS").hide();
            $("#altaPersS").show();
            $("#nombreS").show();
            $("#apPaternoS").show();
            $("#apMaternoS").show();
            $("#RFCS").show();
            $("#estadoS").show();
            $("#CPS").show();
            $("#puestoS").show();
            $("#emailS").show();
            $("#accesoS").show();

            console.log(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16]);
            console.log('acceso: ' + row[6]);
            $('#estadoC').val(row[11]).trigger('change');
            $("input#nombre").val(row[16]);
            $("input#apPaterno").val(row[14]);
            $("input#apMaterno").val(row[15]);
            $("input#rfc").val(row[1]);
            $("input#puesto").val(row[2]);
            $("input#email").val(row[3]);
            $("input#nombreRol").val(row[5]);
            $("input#nombreUsuario").val(row[6]);
            $("input#privilegios").val(row[7]);
            $("#idPersonal").val(row[8]);
            $("#idUsuario").val(row[9]);
            $("#idRol").val(row[10]);
            $("#estadoC").val(row[11]);
            $("#cpC").val(row[12]);
            $("#idPuesto").val(row[13]);
            $("#usuario").val(row[6]);
            $("#pwd").val(row[17]);
            if (row[4] == "Si") {
                console.log('acceso: Si');
                document.getElementById("acceso").checked = true;
            } else {
                document.getElementById("acceso").checked = false;
            }

            LlenaCheckBoxPrivilegiosEditar(row[9], row[8], row[10]);

            $("#privile").hide();
            $("#privileEdit").show();

            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    })

    //boton guardar y editar
    $('#btnguardar').click(function () {
        var row = $("#TablaDetalle").DataTable().row('.selected').data();
        var privilegios = new Array();
        if (row) {
            editPersonal();
        } else {
            //var valido = true;
            valido = validateFormAlta();
            //   alert(JSON.stringify($('#FormAltaPersonal').serializeArray()));

            var valida = $('input:radio[name=personaUsuario]:checked').val();
            var accesarSistema = 0;

            //alert(valida);

            if (valida == 'personal') {
                //Inserta Personal y Usuario

                if (valido) {
                    if ($("#acceso").is(":checked")) {
                        accesarSistema = 1;
                    }
                    $("input[name='privilegio']").each(function (index, item) {
                        if ($("input[name='privilegio']:eq(" + index + ")").is(':checked')) {
                            privilegios.push(parseInt($(this).val()));
                        }
                    });

                    var parameters = {
                        nombre: $("#nombre").val(),
                        apPaterno: $("#apPaterno").val(),
                        apMaterno: $("#apMaterno").val(),
                        rfc: $("#rfc").val(),
                        estadoC: $("#estadoC").val(),
                        cpC: $("#cpC").val(),
                        idPuesto: $("#idPuesto").val(),
                        email: $("#email").val(),
                        idRol: $("#idRol").val(),
                        usuario: $("#usuario").val(),
                        pwd: $("#pwd").val(),
                        accesarSistema: accesarSistema,
                        privilegios: privilegios
                    };

                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'WSLinPro.asmx/insertaPersonal',
                        data: JSON.stringify(parameters),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $.smallBox({
                                title: "Éxito!",
                                content: "Personal <b>" + $('#nombre').val() + " " + $('#apPaterno').val() + " " + $('#apMaterno').val() + "</b> agregado",
                                color: "#739e73",
                                timeout: 2000,
                                icon: "fa fa-thumbs-up swing animated"
                            });
                            console.log(response);
                            //initDataTable();
                            llenaDataTable();
                        }
                    });
                    //$('#FormAltaPersonal').data('bootstrapValidator').resetForm();
                    $('#FormAltaPersonal').bootstrapValidator('destroy');
                    $('#divTiposTransaccion').show();
                    $('#FormularioAlta').hide();
                } else {
                    $('#divTiposTransaccion').hide();
                    $('#FormularioAlta').show();
                }

            } else {
                //inserta Usuario
                if (valido) {
                    $("input[name='privilegio']").each(function (index, item) {
                        if ($("input[name='privilegio']:eq(" + index + ")").is(':checked')) {
                            privilegios.push(parseInt($(this).val()));
                        }
                    });

                    var parameters = {
                        personaC: $("#personaC").val(),
                        idRol: $("#idRol").val(),
                        usuario: $("#usuario").val(),
                        pwd: $("#pwd").val(),
                        privilegios: privilegios
                    };
                    //alert(parameters);

                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'WSLinPro.asmx/insertaUsuario',
                        data: JSON.stringify(parameters),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $.smallBox({
                                title: "Éxito!",
                                content: "Usuario <b>" + $('#usuario').val() + "</b> agregado",
                                color: "#739e73",
                                timeout: 2000,
                                icon: "fa fa-thumbs-up swing animated"
                            });
                            console.log(response);
                            //initDataTable();
                            llenaDataTable();

                        }
                    });
                    //$('#FormAltaPersonal').data('bootstrapValidator').resetForm();
                    $('#FormAltaPersonal').bootstrapValidator('destroy');
                    $('#divTiposTransaccion').show();
                    $('#FormularioAlta').hide();

                } else {
                    $('#divTiposTransaccion').hide();
                    $('#FormularioAlta').show();
                }
            }

        }
    });

    //boton borrado
    $("#btnDelete").click(function () {
        var row = $('#TablaDetalle').DataTable().row('.selected').data();
        if (row) {
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el Usuario <b>" + row[6] + " de la Persona <b>" + row[0] + "</b>?",
                content: "Una vez eliminado el Usuario no podras volver acceder a el.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {

                    var parameters = {
                        idPersonal: row[8],
                        idUsuario: row[9],
                        idRolAnterior: row[10]
                    };
                    console.log(parameters);

                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/eliminarPersonalUsuario',
                        data: JSON.stringify(parameters),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (output) {
                            $.each(output, function (j, cam) {
                                showOkMessage('Usuario Eliminadp', 'Se ha Eliminado el Usuario <b>' + row[6] + '<b>');
                                llenaDataTable();
                                //initDataTable();
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
            showWarningMessage('Información </b>', '<i>Debe seleccionar un elemento</i>');
        }
    })

}


//Editar Personal
function editPersonal() {
    console.log('Entre a editPersonal');
    //var valido = true;;
    $('#FormAltaPersonal').bootstrapValidator('destroy');
    var privilegios = new Array();
    $("input[name='privilegioEdit']").each(function (index, item) {
        if ($("input[name='privilegioEdit']:eq(" + index + ")").is(':checked')) {
            privilegios.push(parseInt($(this).val()));
        }
    });
    if (privilegios.length != 0) {
        $("#privi").val('validado');
    } else {
        $("#privi").val(null);
    }
    valido = validateFormEdita();

    if (valido) {
        var row = $("#TablaDetalle").DataTable().row('.selected').data();
        var privilegios = new Array();

        console.log($("#nombre").val());
        console.log($("#cpC").val());
        console.log($("#apMaterno").val());
        console.log($("#rfc").val());
        console.log(row[8]);
        console.log(row[9]);
        console.log(row[10]);
        console.log('Entre a if editPersonal');

        var accesarSistema = 0;

        //Inserta Personal y Usuario

        if ($("#acceso").is(":checked")) {
            accesarSistema = 1;
        }
        $("input[name='privilegioEdit']").each(function (index, item) {
            if ($("input[name='privilegioEdit']:eq(" + index + ")").is(':checked')) {
                privilegios.push(parseInt($(this).val()));
            }
        });

        var parameters = {
            nombre: $("#nombre").val(),
            apPaterno: $("#apPaterno").val(),
            apMaterno: $("#apMaterno").val(),
            rfc: $("#rfc").val(),
            estadoC: $("#estadoC").val(),
            cpC: $("#cpC").val(),
            idPuesto: $("#idPuesto").val(),
            email: $("#email").val(),
            idRol: $("#idRol").val(),
            usuario: $("#usuario").val(),
            pwd: $("#pwd").val(),
            accesarSistema: accesarSistema,
            privilegios: privilegios,
            idPersonal: row[8],
            idUsuario: row[9],
            idRolAnterior: row[10]
        };
        console.log(parameters);
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/modificarPersonalUsuario',
            data: JSON.stringify(parameters),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Persona <b>" + row[0] + "</b> con Usuario " + row[6] + " Editado",
                    color: "#739e73",
                    timeout: 2000,
                    icon: "fa fa-thumbs-up swing animated"
                });
                //llenaDataTable();
                //console.log(response);
                //initDataTable();
                llenaDataTable();
            }
        });
        $('#FormAltaPersonal').bootstrapValidator('destroy');
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    } else {
        console.log('Entre al else de editar personal')
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    }
}



//Validaciones para alta
function validateFormAlta() {
    var valida = $('input:radio[name=personaUsuario]:checked').val();
    //alert(valida);
    if (valida == "personal") {
        $("#FormAltaPersonal").bootstrapValidator({
            excluded: [':disabled'],
            live: 'enabled',
            submitButtons: 'button[id="btnguardar"]',
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            fields: {
                nombre: {
                    selector: '#nombre',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El nombre de la de la Persona es requerido'
                        },
                        stringLength: {
                            max: 50,
                            message: 'El nombre de la Persona no puede tener mas de 50 caracteres'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                apPaterno: {
                    selector: '#apPaterno',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El Apellido Paterno de la Persona es requerido'
                        },
                        stringLength: {
                            max: 50,
                            message: 'El Apellido Paterno no puede tener mas de 50 caracteres'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                apMaterno: {
                    selector: '#apMaterno',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El Apellido Materno de la Persona es requerido'
                        },
                        stringLength: {
                            max: 50,
                            message: 'El Apellido Materno no puede tener mas de 50 caracteres'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                rfc: {
                    selector: '#rfc',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El RFC de la Persona es requerido'
                        },
                        stringLength: {
                            max: 13,
                            message: 'El RFC no puede tener mas de 13 caracteres'
                        },
                        regexp: {
                            regexp: /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))((-)?([A-Z\d]{3}))?$/,
                            message: 'El RFC no es valido'
                        }
                    }
                },
                estadoC: {
                    selector: '#estadoC',
                    group: '.form-group',
                    validators: {
                        callback: {
                            message: 'Selecciona un estado',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                cpC: {
                    selector: '#cpC',
                    group: '.form-group',
                    validators: {
                        callback: {
                            message: 'Selecciona un Codigo Postal',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                idPuesto: {
                    selector: '#idPuesto',
                    group: '.form-group',
                    validators: {
                        callback: {
                            message: 'Selecciona un Puesto',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                email: {
                    selector: '#email',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El correo electronico de la Persona es requerido'
                        },
                        emailAddress: {
                            message: 'El correo electronico no es valido'
                        },
                        stringLength: {
                            max: 30,
                            message: 'El correo electronico no puede tener mas de 30 caracteres'
                        }
                    }
                },
                idRol: {
                    selector: '#idRol',
                    group: '.form-group',
                    validators: {
                        callback: {
                            message: 'Selecciona un Rol',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                usuario: {
                    selector: '#usuario',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El Nombre de Usuario es requerido'
                        },
                        stringLength: {
                            min: 8,
                            max: 50,
                            message: 'El Nombre de Usuario debe contener al menos 8 caracteres y no puede tener mas de 50 caracteres'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                pwd: {
                    selector: '#pwd',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'La Contraseña es requerida'
                        },
                        stringLength: {
                            min: 8,
                            max: 50,
                            message: 'La Contraseña debe contener al menos 8 caracteres y no puede tener mas de 50 caracteres'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                privi: {
                    selector: '#privi',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'Debe seleccionar por lo menos 1 privilegio'
                        }
                    }
                }
            }
        });
    } else {

        $("#FormAltaPersonal").bootstrapValidator({
            excluded: [':disabled'],
            live: 'enabled',
            submitButtons: 'button[id="btnguardar"]',
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            fields: {
                personaC: {
                    selector: '#personaC',
                    group: '.form-group',
                    validators: {
                        callback: {
                            message: 'Selecciona una Persona',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                idRol: {
                    selector: '#idRol',
                    group: '.form-group',
                    validators: {
                        callback: {
                            message: 'Selecciona un Rol',
                            callback: function (value, validator, $field) {
                                if (value === '0') {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                },
                usuario: {
                    selector: '#usuario',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'El Nombre de Usuario es requerido'
                        },
                        stringLength: {
                            min: 8,
                            max: 50,
                            message: 'El Nombre de Usuario debe contener al menos 8 caracteres y no puede tener mas de 50 caracteres'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                pwd: {
                    selector: '#pwd',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'La Contraseña es requerida'
                        },
                        stringLength: {
                            min: 8,
                            max: 50,
                            message: 'La Contraseña debe contener al menos 8 caracteres y no puede tener mas de 50 caracteres'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                            message: 'Solo caracteres alfanúmericos'
                        }
                    }
                },
                privi: {
                    selector: '#privi',
                    group: '.form-group',
                    validators: {
                        notEmpty: {
                            message: 'Debe seleccionar por lo menos 1 privilegio'
                        }
                    }
                }
            }
        });

    }

    $('#FormAltaPersonal').data('bootstrapValidator').validate();
    var valido = $('#FormAltaPersonal').data('bootstrapValidator').isValid();
    console.log("llega " + valido);
    return valido;
}

//Validaciones para Editar
function validateFormEdita() {
    //alert("edicion");
    $("#FormAltaPersonal").bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            nombre: {
                selector: '#nombre',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El nombre de la de la Persona es requerido'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El nombre de la Persona no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            apPaterno: {
                selector: '#apPaterno',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El Apellido Paterno de la Persona es requerido'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El Apellido Paterno no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            apMaterno: {
                selector: '#apMaterno',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El Apellido Materno de la Persona es requerido'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El Apellido Materno no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            rfc: {
                selector: '#rfc',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El RFC de la Persona es requerido'
                    },
                    stringLength: {
                        max: 13,
                        message: 'El RFC no puede tener mas de 13 caracteres'
                    },
                    regexp: {
                        regexp: /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))((-)?([A-Z\d]{3}))?$/,
                        message: 'El RFC no es valido'
                    }
                }
            },
            estadoC: {
                selector: '#estadoC',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un estado',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false
                            } else {
                                return true
                            }
                        }
                    }
                }
            },
            cpC: {
                selector: '#cpC',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un Codigo Postal',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false
                            } else {
                                return true
                            }
                        }
                    }
                }
            },
            idPuesto: {
                selector: '#idPuesto',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un Puesto',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false
                            } else {
                                return true
                            }
                        }
                    }
                }
            },
            email: {
                selector: '#email',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El Email de la Persona es requerido'
                    },
                    emailAddress: {
                        message: 'El correo electronico no es valido'
                    },
                    stringLength: {
                        max: 30,
                        message: 'El correo electronico no puede tener mas de 30 caracteres'
                    }
                }
            },
            idRol: {
                selector: '#idRol',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un Rol',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false
                            } else {
                                return true
                            }
                        }
                    }
                }
            },
            usuario: {
                selector: '#usuario',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El Nombre de Usuario es requerido'
                    },
                    stringLength: {
                        min: 8,
                        max: 50,
                        message: 'El Nombre de Usuario debe contener al menos 8 caracteres y no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            pwd: {
                selector: '#pwd',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'La Contraseña es requerida'
                    },
                    stringLength: {
                        min: 8,
                        max: 50,
                        message: 'La Contraseña debe contener al menos 8 caracteres y no puede tener mas de 50 caracteres'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            privi: {
                selector: '#privi',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'Debe seleccionar por lo menos 1 privilegio'
                    }
                }
            }
        }
    });

    $('#FormAltaPersonal').data('bootstrapValidator').validate();
    var valido = $('#FormAltaPersonal').data('bootstrapValidator').isValid();
    console.log("llega " + valido);
    return valido;
}


//Iniciar la tabla
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
        url: 'WSLinPro.asmx/llenaTablaPersonalUsuario',
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
                $.each(index.listaPersonalUsuario, function (r, arr) {
                    datos.push([arr.nombre, arr.rfc, arr.puesto, arr.email, arr.acceso, arr.nombreRol, arr.nombreUsuario, arr.privilegios, arr.idPersonal, arr.idUsuario,
                    arr.idRol, arr.idEstado, arr.c_CP, arr.idPuesto, arr.apPaterno, arr.apMaterno, arr.nombreSolo, arr.contrasena]);
                });
            });

        }
    });
    var otable = $('#TablaDetalle').DataTable({
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
            title: "RFC"
        },
        {
            title: "Puesto"
        },
        {
            title: "Email"
        },
        {
            title: "Acceso"
        },
        {
            title: "Rol"
        },
        {
            title: "Usuario"
        },
        {
            title: "Privilegios"
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
    $('#TablaDetalle tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#TablaDetalle').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });

    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#TablaDetalle tbody').on('dblclick', 'tr', function () {
        $("#radioPersonal").hide();
        $("#personaS").hide();
        $("#altaPersS").show();
        $("#nombreS").show();
        $("#apPaternoS").show();
        $("#apMaternoS").show();
        $("#RFCS").show();
        $("#estadoS").show();
        $("#CPS").show();
        $("#puestoS").show();
        $("#emailS").show();
        $("#accesoS").show();
        $(this).addClass('selected');
        var row = $("#TablaDetalle").DataTable().row('.selected').data();
        //console.log(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16]);
        console.log('acceso: ' + row[4]);
        $('#estadoC').val(row[11]).trigger('change');
        $("input#nombre").val(row[16]);
        $("input#apPaterno").val(row[14]);
        $("input#apMaterno").val(row[15]);
        $("input#rfc").val(row[1]);
        $("input#puesto").val(row[2]);
        $("input#email").val(row[3]);
        $("input#nombreRol").val(row[5]);
        $("input#nombreUsuario").val(row[6]);
        $("input#privilegios").val(row[7]);
        $("#idPersonal").val(row[8]);
        $("#idUsuario").val(row[9]);
        $("#idRol").val(row[10]);
        $("#estadoC").val(row[11]);
        $("#cpC").val(row[12]);
        $("#idPuesto").val(row[13]);
        $("#usuario").val(row[6]);
        $("#pwd").val(row[17]);
        if (row[4] == "Si") {
            console.log('acceso: Si');
            document.getElementById("acceso").checked = true;
        } else {
            document.getElementById("acceso").checked = false;
        }

        LlenaCheckBoxPrivilegiosEditar(row[9], row[8], row[10]);

        //$("#privile").hide();
        $("#privile").hide();
        $("#privileEdit").show();

        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    });
}

//Refresh de campos al invocar la tabla
function llenaDataTable() {
    var otable = $('#TablaDetalle').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/llenaTablaPersonalUsuario',
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
                $.each(index.listaPersonalUsuario, function (r, arr) {
                    datos.push([arr.nombre, arr.rfc, arr.puesto, arr.email, arr.acceso, arr.nombreRol, arr.nombreUsuario, arr.privilegios, arr.idPersonal, arr.idUsuario,
                    arr.idRol, arr.idEstado, arr.c_CP, arr.idPuesto, arr.apPaterno, arr.apMaterno, arr.nombreSolo, arr.contrasena]);
                });
            });

        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}

//Llena comboBox Puestos
function llenaComboPuestos() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboPuesto',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.listaPuestos, function (index1, item1) {

                    html += '<option value="' + item1.idPuesto + '">' + item1.descripcion + '</option>';
                });
            });
            $("#idPuesto").html(html);
        }
    });
}

//Llena comboBox Roles
function llenaComboRoles() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboRoles',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.listaRoles, function (index1, item1) {
                    html += '<option value="' + item1.idRol + '">' + item1.nombreRol + '</option>';
                });
            });
            $("#idRol").html(html);
        }
    });
}

//Llena checkBox Privilegios
function LlenaCheckBoxPrivilegios() {
    var chk = "";
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaCheckBoxPrivilegios',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $.each(data, function (index, item) {
                $.each(item.listaPrivilegios, function (index1, item1) {
                    chk += '<input type="checkbox" onclick="validaCheck()" value="' + item1.idPrivilegio + '" name="privilegio"/>&nbsp; ' + item1.descripcionPrivilegio + '</br >';
                });
            });
            $("#privile").html(chk);
        }
    });

}

//Valida los checkbox con un onclick
function validaCheck() {
    $('#FormAltaPersonal').bootstrapValidator('destroy');
    var privilegios = new Array();
    $("input[name='privilegio']").each(function (index, item) {
        if ($("input[name='privilegio']:eq(" + index + ")").is(':checked')) {
            privilegios.push(parseInt($(this).val()));
        }
    });
    if (privilegios.length != 0) {
        $("#privi").val('validado');
    } else {
        $("#privi").val(null);
    }
    validateFormAlta();
}

//Llena checkBox Privilegios
function LlenaCheckBoxPrivilegiosEditar(idUsuario, idPersonal, idRol) {
    //console.log(idUsuario + ' - ' + idPersonal + ' - ' + idRol)
    var chk = "";
    var parameters = {
        idPersonal: idPersonal,
        idUsuario: idUsuario,
        idRol: idRol
    };
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaCheckBoxPrivilegiosEdit',
        data: JSON.stringify(parameters),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (index, item) {
                $.each(item.listaPrivilegiosCHK, function (index1, item1) {
                    //console.log(item1.idPrivilegio);
                    //console.log(item1.descripcionPrivilegio);
                    //console.log(item1.estatus);
                    if (item1.estatus === "checked") {
                        chk += '<input type="checkbox" onclick="validaCheckEdit()" value="' + item1.idPrivilegio + '" checked = "true" name="privilegioEdit"/>&nbsp; ' + item1.descripcionPrivilegio + '</br >';
                    } else {
                        chk += '<input type="checkbox" onclick="validaCheckEdit()" value="' + item1.idPrivilegio + '" name="privilegioEdit"/>&nbsp; ' + item1.descripcionPrivilegio + '</br >';
                    }
                });
            });
            $("#privileEdit").html(chk);
        }
    });

}

function validaCheckEdit() {
    $('#FormAltaPersonal').bootstrapValidator('destroy');
    var privilegios = new Array();
    $("input[name='privilegioEdit']").each(function (index, item) {
        if ($("input[name='privilegioEdit']:eq(" + index + ")").is(':checked')) {
            privilegios.push(parseInt($(this).val()));
        }
    });
    if (privilegios.length != 0) {
        $("#privi").val('validado');
    } else {
        $("#privi").val(null);
    }
    validateFormEdita();
}

//Llena comboBox Personal
function llenaComboPersonal() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboPersonal',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.listaPersonal, function (index1, item1) {
                    html += '<option value="' + item1.idPersonal + '">' + item1.nombrePersonal + '</option>';
                });
            });
            $("#personaC").html(html);
        }
    });
}

//Llena comboBox Estado
function llenaComboEstados() {
    var html = "";
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboEstados',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.listaEstados, function (index1, item1) {
                    html += '<option value="' + item1.idEstado + '">' + item1.descripcion + '</option>';
                });
            });
            $("#estadoC").html(html);
        }
    });
}

//Llena comboBox CP  apartir de un Estado seleccionado
function actualizaCP() {
    console.log("entre al cp");
    var idEstado = $('select[id=estadoC]').val();
    console.log($('select[id=estadoC]').val());
    //alert(JSON.stringify($('#FormAltaPersonal').serializeArray()))
    var html = "";
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboCPs',
        data: JSON.stringify({ idEstado: idEstado }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegistroCP, function (index1, item1) {
                    html += '<option value="' + item1.c_CP + '">' + item1.c_CP + '</option>';
                });
            });
            $("#cpC").html(html);
        }
    });
}

//Valida el radioButton que selecciona si es alta de Personal y Usuario o solo de Usuario
function validaAlta() {
    $('#FormAltaPersonal').bootstrapValidator('destroy');
    var valida = $('input:radio[name=personaUsuario]:checked').val();

    if (valida == "usuario") {
        $("#altaPersS").hide();
        $("#nombreS").hide();
        $("#apPaternoS").hide();
        $("#apMaternoS").hide();
        $("#RFCS").hide();
        $("#estadoS").hide();
        $("#CPS").hide();
        $("#puestoS").hide();
        $("#emailS").hide();
        $("#accesoS").hide();
        $("#personaS").show();
    } else {
        $("#personaS").hide();
        $("#altaPersS").show();
        $("#nombreS").show();
        $("#apPaternoS").show();
        $("#apMaternoS").show();
        $("#RFCS").show();
        $("#estadoS").show();
        $("#CPS").show();
        $("#puestoS").show();
        $("#emailS").show();
        $("#accesoS").show();
    }
}

