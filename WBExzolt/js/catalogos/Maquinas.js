$(function () {

    initEventos();
    initDataTable();
    llenaComboPlaca();
    llenaComboNave();
    llenaComboMarcas();
    $('#Año').datetimepicker({
        viewMode: 'years',
        format: 'YYYY'
    });
});

function initEventos() {
    //boton plus 
    $('#btnPlus').click(function () {
        var row = $("#detalleMaquina").DataTable().row('.selected').data();
        if (row) {
            $('#detalleMaquina').DataTable().$('tr.selected').removeClass('selected');
        }
        limpiaDivs();
        validateForm();
        $('#FormMaquina').data('bootstrapValidator').resetForm();
        document.getElementById("FormMaquina").reset();
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
        var row = $("#detalleMaquina").DataTable().row('.selected').data();
//        console.log(row);
        llenaComboPlaca();
        llenaComboNave();
        llenaComboMarcas();
        if (row) {
            $("#idMaquina").val(row[0]);
            $("#Descripcion").val(row[1]);
            $('#CmbMarca').val(row[4]).trigger('change');
            $("#Nserie").val(row[5]);
            $("#CmbNave").val(row[6]).trigger('change');
            $("#ComboPlaca").val(row[8]).trigger('change');
            $("#Año").val(row[2]);
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    });

    //boton guardar y editar
    $('#btnguardar').click(function () {
        var row = $("#detalleMaquina").DataTable().row('.selected').data();
        if (row) {
            editMaquina();
        } else {
            var valido;
            valido = validateForm();
            console.log(valido);
            if (valido) {
            console.log(JSON.stringify($('#FormMaquina').serializeArray()));
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'WSLinPro.asmx/InsertaMaquina',
                    data: $('#FormMaquina').serializeArray(),
                    success: function (response) {
                        $.smallBox({
                            title: "Éxito!",
                            content: "Maquina <b>" + $('#Descripcion').val() + "</b> agregado",
                            color: "#739e73",
                            timeout: 2000,
                            icon: "fa fa-thumbs-up swing animated"
                        });
                        llenaDataTable();
                    }
                });
                $('#FormMaquina').data('bootstrapValidator').resetForm();
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
        var row = $('#detalleMaquina').DataTable().row('.selected').data();
        if (row) {
            var IdMaquina = row[0];
            console.log(IdMaquina);
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> la Máquina <b>" + row[1] + "</b>?",
                content: "Una vez eliminada la Transaccion no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/EliminarMaquina',
                        data: JSON.stringify({ IdMaquina: IdMaquina }),
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

function editMaquina() {
    var valido;
    valido = validateForm();
    if (valido) {
        var row = $("#detalleMaquina").DataTable().row('.selected').data();
        console.log(row);
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/ActualizaMaquina',
            data: {
                idMaquina: row[0],
                Descripcion: $("#Descripcion").val(),
                idMarca: $("#CmbMarca").val(),
                Nserie: $("#Nserie").val(),
                idNave: $("#CmbNave").val(),
                idPlaca: $("#ComboPlaca").val(),
                año: $("#Año").val()
            },
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Maquina <b>" + $("#Descripcion").val() + "</b> Editado",
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
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaMaquina',
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
                $.each(index.ListaRegistrosMaquina, function (r, arr) {
                    datos.push([arr.IdMaquina, arr.Descripcion, arr.Año, arr.MarcasMaquina.Descripcion, arr.MarcasMaquina.IdMarca, arr.NoSerie, arr.NavesIndus.IdNave, arr.NavesIndus.DescripcionNave, arr.CamposPlaca.IdPlaca, arr.CamposPlaca.Descripcion, arr.EtatusMaquina.Descripcion]);
                });
            });
        }
    });
    var otable = $('#detalleMaquina').DataTable({
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
                    $('#detalleMaquina'), breakpointDefinition);
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
            title: "IdMaquina",
             visible: false
        },
        {
            title: "Descripción"
        },
        {
            title: "Año"
        },
        {
            title: "Marca"
        },
        {
            title: "IdMarca",
            visible: false
        },
        {
            title: "Número De Serie"
        },
        {
            title: "idNave",
            visible: false
        },
        {
            title: "Nave"
        },
        {
            title: "idPlaca",
            visible: false
        },
        {
            title: "Placa"
        },
        {
            title: "Estatus"
        }
        ]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#detalleMaquina thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#detalleMaquina tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#detalleMaquina').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });

    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#detalleMaquina tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        var row = $("#detalleMaquina").DataTable().row('.selected').data();
        $("#idMaquina").val(row[0]);
        $("#Descripcion").val(row[1]);
        $('#CmbMarca').val(row[4]).trigger('change');
        $("#Nserie").val(row[5]);
        $("#CmbNave").val(row[6]).trigger('change');
        $("#ComboPlaca").val(row[8]).trigger('change');
        $("#Año").val(row[2]);
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    });
}

function llenaDataTable() {
    var otable = $('#detalleMaquina').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaMaquina',
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
                $.each(index.ListaRegistrosMaquina, function (r, arr) {
                    datos.push([arr.IdMaquina, arr.Descripcion, arr.Año, arr.MarcasMaquina.Descripcion, arr.MarcasMaquina.IdMarca, arr.NoSerie, arr.NavesIndus.IdNave, arr.NavesIndus.DescripcionNave, arr.CamposPlaca.IdPlaca, arr.CamposPlaca.Descripcion, arr.EtatusMaquina.Descripcion]);
                });
            });

        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}


function llenaComboPlaca() {

    var html1 = '';
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboPlaca',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log(data);
            html1 += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegPlaca, function (index1, item1) {

                    html1 += '<option value="' + item1.IdPlaca + '">' + item1.Descripcion    + '</option>';
                });
            });
            $("#ComboPlaca").html(html1);
        }
    });

}

function llenaComboNave() {

    var html1 = '';
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboNave',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log(data);
            html1 += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegNavesIndus, function (index1, item1) {

                    html1 += '<option value="' + item1.IdNave + '">' + item1.DescripcionNave + '</option>';
                });
            });
           // console.log(html1);
            $("#CmbNave").html(html1);
        }
    });

}

function llenaComboMarcas() {

        var html1 = '';
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/LlenaComboMarca',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                console.log(data);
                html1 += '<option value="0">Seleccione</option>';
                $.each(data, function (index, item) {
                    $.each(item.ListaRegMarcasMaq, function (index1, item1) {

                        html1 += '<option value="' + item1.IdMarca + '">' + item1.Descripcion + '</option>';
                    });
                });
               $("#CmbMarca").html(html1);
            }
        });

}

function validateForm() {
    $("#FormMaquina").bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            descripcion: {
                selector: '#Descripcion',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'La descripción de la Máquina es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 100,
                        message: 'La descripción de la Máquina no puede tener más de 100 caracteres'
                    }
                }
            },
            NumSerie: {
                selector: '#Nserie',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El Número de Serie es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    },
                    stringLength: {
                        max: 20,
                        message: 'El número de serie de la Máquina no puede tener más de 20 caracteres'
                    }
                }
            },
            Año: {
                selector: '#Año',
                group: '.form-group',
                validators: {
                    between: {
                       min: 1900,
                       max: 2100,
                       message: 'Año entre 1900 y 2100'
                   },
                    notEmpty: {
                       message: 'Favor de ingresar un número entero'
                   }
                    }
            },
            idMarca: {
                selector: '#CmbMarca',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una Marca',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            idNave: {
                selector: '#CmbNave',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una nave industrial',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            idPlaca: {
                selector: '#ComboPlaca',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una placa',
                        callback: function (value, validator, $field) {
                            if (value === '0') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    });

    $('#FormMaquina').data('bootstrapValidator').validate();
    var valido = $('#FormMaquina').data('bootstrapValidator').isValid();
    return valido;
}

function validarN(e) {
    tecla = (e.keyCode ? e.keyCode : e.which);
    if (tecla == 8) return true;
    patron = /[0-9\s\t\.]/;
    te = String.fromCharCode(tecla);
    return patron.test(te);
}


