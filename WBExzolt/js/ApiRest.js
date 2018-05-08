$(function () {

    initEventos();
    initDataTable();
    $('#Fecha').datetimepicker({
        format: 'DD/MM/YYYY hh:mm:ss'
    });
}); 


function initEventos() {
    //boton plus 
    $('#btnPlus').click(function () {
        var row = $("#detallePers").DataTable().row('.selected').data();
        if (row) {
            $('#detallePers').DataTable().$('tr.selected').removeClass('selected');
        }
        limpiaDivs();
        validateForm();
        $('#detallePers').data('bootstrapValidator').resetForm();
        document.getElementById("FormPersona").reset();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $('#btnguardar').show();
    });

    //boton atras
    $('#btnAtras').click(function () {
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    //  boton editar
    $("#btnEdit").click(function () {
        limpiaDivs();
        var row = $("#detallePers").DataTable().row('.selected').data();
        //        console.log(row);
        if (row) {
            $("#idPersona").val(row[0]);
            $("#Nombre").val(row[1]);
            $('#ApellidoPat').val(row[2]);
            $("#ApellidoMat").val(row[3]);
            $("#Nacimiento").val(row[4]);
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    });

    //boton guardar y editar
    $('#btnguardar').click(function () {
        var row = $("#detallePers").DataTable().row('.selected').data();
        if (row) {
            editPersona();
        } else {
            var valido;
            valido = validateForm();
            console.log(valido);
            if (valido) {
                console.log(JSON.stringify($('#FormPersona').serializeArray()));
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'http://localhost:59382/api/Personas',
                    data: $('#FormPersona').serializeArray(),
                    success: function (response) {
                        $.smallBox({
                            title: "Éxito!",
                            content: "Persona <b>" + $('#Nombre').val() + "</b> agregado",
                            color: "#739e73",
                            timeout: 2000,
                            icon: "fa fa-thumbs-up swing animated"
                        });
                        llenaDataTable();
                    }
                });
                $('#FormPersona').data('bootstrapValidator').resetForm();
                $('#divTiposTransaccion').show();
                $('#FormularioAlta').hide();
                llenaDataTable();
            }
            else {
                $('#divTiposTransaccion').hide();
                $('#FormularioAlta').show();
            }
        }
    });

    //boton borrado
    $("#btnDelete").click(function () {
        var row = $('#detallePers').DataTable().row('.selected').data();
        if (row) {
            var idPersona = row[0];
            console.log(idPersona);
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> la Persona <b>" + row[1] + "</b>?",
                content: "Una vez eliminada la Transaccion no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: "DELETE",
                        url: 'http://localhost:59382/api/Personas',
                        data: JSON.stringify({ id: idPersona }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (output) {
                            $.each(output, function (j, cam) {
                                showOkMessage('Transaccion Eliminada', 'Se ha Eliminado la Transaccion <b>' + row[1] + '<b>');
                                llenaDataTable();
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
    });

}

function limpiaDivs() {
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-success');
}

function editPersona() {
    var valido;
    valido = validateForm();

    if (valido) {
        var row = $("#detallePers").DataTable().row('.selected').data();
        console.log(row);
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
        $.ajax({
            async: false,
            type: 'PUT',
            url: 'http://localhost:59382/api/Personas',
            data: {
                idPersona: row[0],
                Nombre: $("#Nombre").val(),
                ApellidoPat: $("#ApellidoPat").val(),
                ApellidoMat: $("#ApellidoMat").val(),
                Nacimiento: $("#Nacimiento").val()
            },
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Persona <b>" + $("#Nombre").val() + "</b> Editado",
                    color: "#739e73",
                    timeout: 2000,
                    icon: "fa fa-thumbs-up swing animated"
                });
                //   llenaDataTable();
                llenaDataTable();
            }
        });
    }
    else {
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    }
}

function initDataTable() {
    console.log('Entre al init Table');
    $.fn.dataTable.ext.errMode = 'none';
    var responsiveHelper_datatable_fixed_column = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480,
        desktop: 1260
    };
    var datos = [];
    console.log(datos);
    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:59382/api/Personas',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#loadingMod').modal({
                backdrop: 'static',
                keyboard: false
            });
        },
        success: function (response) {
            console.log(response);
            $('#loadingMod').modal('hide');
            $.each(response, function (row, index) {
                console.log(index.ApellidoPat);
                datos.push([index.id,index.Nombre, index.ApellidoPat, index.ApellidoMat, index.Nacimiento]);
                //$.each(index.ListaRegistrosMaquina, function (r, arr) {
                //    datos.push([arr.IdMaquina, arr.Descripcion, arr.Año, arr.MarcasMaquina.Descripcion, arr.MarcasMaquina.IdMarca, arr.NoSerie, arr.NavesIndus.IdNave, arr.NavesIndus.DescripcionNave, arr.CamposPlaca.IdPlaca, arr.CamposPlaca.Descripcion, arr.EtatusMaquina.Descripcion]);
                //});
            });
        }
    });
    var otable = $('#detallePers').DataTable({
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
                    $('#detallePers'), breakpointDefinition);
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
            title: "idPersona",
            visible: false
        },
        {
            title: "Nombre"
        },
        {
            title: "Apellido Paterno"
        },
        {
            title: "Apellido Materno"
        },
        {
            title: "Nacimiento"
        }
        ]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#detallePers thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#detallePers tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#detallePers').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });

    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#detallePers tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        var row = $("#detallePers").DataTable().row('.selected').data();
        $("#idPersona").val(row[0]);
        $("#Nombre").val(row[1]);
        $('#ApellidoPat').val(row[2]);
        $("#ApellidoMat").val(row[3]);
        $("#Nacimiento").val(row[4]);
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    });
}
 //detallePers
//FormPersona

function llenaDataTable() {
    var otable = $('#detallePers').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:59382/api/Personas',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#loadingMod').modal({
                backdrop: 'static',
                keyboard: false
            });
        },
        success: function (response) {
            console.log(response);
            datos = response;
            $('#loadingMod').modal('hide');
            $.each(response, function (row, index) {
                console.log(index.ApellidoPat);
                //$.each(index.ListaRegistrosMaquina, function (r, arr) {
                //    datos.push([arr.IdMaquina, arr.Descripcion, arr.Año, arr.MarcasMaquina.Descripcion, arr.MarcasMaquina.IdMarca, arr.NoSerie, arr.NavesIndus.IdNave, arr.NavesIndus.DescripcionNave, arr.CamposPlaca.IdPlaca, arr.CamposPlaca.Descripcion, arr.EtatusMaquina.Descripcion]);
                //});
            });

        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}
                     
function validateForm() {
    $("#FormPersona").bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            Nombre: {
                selector: '#Nombre',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El nombre de la persina es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El nombre de la Persona no puede tener más de 50 caracteres'
                    }
                }
            },
            ApellidoPat: {
                selector: '#ApellidoPat',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El Apellido paterno es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El apellido  paterno no puede tener más de 50 caracteres'
                    }
                }
            },
            ApellidoMat: {
                selector: '#ApellidoMat',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El Apellido Materno es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 50,
                        message: 'El apellido materno no puede tener más de 50 caracteres'
                    }
                }
            },
            FechaAlta: {
                selector: '#Nacimiento',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'Debe ingresar una fecha de Nacimiento'
                    }
                }
            }
        }
    });

    $('#FormPersona').data('bootstrapValidator').validate();
    var valido = $('#FormPersona').data('bootstrapValidator').isValid();
    return valido;
}


