$(function () {
    initEventos();
    initDataTable();
    
});

function initEventos() {
    $('#btnPlus').click(function () {
        var row = $("#detalleArea").DataTable().row('.selected').data();
        if (row) {
            $('#detalleArea').DataTable().$('tr.selected').removeClass('selected');
        }
        limpiaDivs();
        validateForm();
        $('#FormArea').data('bootstrapValidator').resetForm();
        document.getElementById("FormArea").reset();
        llenaComboSucursal();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $("#tituloOperacion").html('Crear Área');
    });

    $('#btnAtras').click(function () {
        $('#FormArea').data('bootstrapValidator').resetForm();
        document.getElementById("FormArea").reset();
        limpiaDivs();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    $('#btnguardar').click(function () {
        var row = $("#detalleArea").DataTable().row('.selected').data();
        var formData = new FormData(document.getElementById('FormArea'));
        if (row) {
            editArea();
        } else {
            var sucursales = new Array();
            var valido = validateForm();
            if (valido) {
            $("input[name='sucursal']").each(function (index, item) {
                if ($("input[name='sucursal']:eq(" + index + ")").is(':checked')) {
                    sucursales.push(parseInt($(this).val()));
                }
                
            });
            var parameters = {
                area: $("#area").val(),
                descripcion: $("#descripcion").val(),
                sucursales: sucursales
            };
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: 'WSLinPro.asmx/insertaAreaWs',
                    data: JSON.stringify(parameters), 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        $.smallBox({
                            title: "Éxito!",
                            content: "Area <b>" + $('#area').val() + "</b> agregada",
                            color: "#739e73",
                            timeout: 2000,
                            icon: "fa fa-thumbs-up swing animated"
                        });
                        llenaDataTable();
                    }
                });
                $('#FormArea').data('bootstrapValidator').resetForm();
                $('#divTiposTransaccion').show();
                $('#FormularioAlta').hide();
            } else {
                $('#divTiposTransaccion').hide();
                $('#FormularioAlta').show();
            }
        }
    });

    $("#btnEdit").click(function () {
        limpiaDivs();
        var row = $("#detalleArea").DataTable().row('.selected').data();
        if (row) {
            setObject(row);
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
            $("#tituloOperacion").html('Editar Área');
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar un elemento</i>');
        }
        })

        $("#btnDelete").click(function () {
            var row = $('#detalleArea').DataTable().row('.selected').data();
            if (row) {
                var idArea = row[0];
                $.SmartMessageBox({
                    title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el area <b>" + row[1] + "</b>?",
                    content: "Una vez eliminada la Transacción no podras volver acceder a ella.",
                    buttons: '[No][Si]'
                }, function (ButtonPressed) {
                    if (ButtonPressed === "Si") {
                        $.ajax({
                            async: false,
                            type: "POST",
                            url: 'WSLinPro.asmx/eliminarAreaWs',
                            data: JSON.stringify({ idArea: row[0] }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (output) {
                                $.each(output, function (j, cam) {
                                    showOkMessage('Transacción Eliminada', 'Se ha Eliminado la Transacción <b>' + row[1] + '<b>');
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
        })
}

function setObject(row) {
    $("#idArea").val(row[0]);
    $("#area").val(row[1]).prop("readonly", false);
    $("#descripcion").val(row[2]).prop("readonly", false);
    checkSucursalesSeleccionadas(row[0]);
}

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
        url: 'WSLinPro.asmx/LlenaTablaArea',
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
                $.each(index.listaReg, function (r, arr) {
                    datos.push([arr.idArea, arr.nombre, arr.descripcion, arr.sucursales]);
                });
            });
        }
    });
    var otable = $('#detalleArea').DataTable({
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
        "preDrawCallback": function () {
            if (!responsiveHelper_datatable_fixed_column) {
                responsiveHelper_datatable_fixed_column = new ResponsiveDatatablesHelper(
                    $('#detalleArea'), breakpointDefinition);
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
            title: "id",
            visible: false
        },
        {
            title: "Área"
        },
        {
            title: "Descripción"
        },
        {
            title: "Sucursales"
        }
        ]
    });

    // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
    $("#detalleArea thead th input[type=text]").on(
        'keyup',
        function (e) {
            otable.column($(this).parent().index() + ':visible').search(
                this.value).draw();
        });

    // Método creado para agregar el evento de selección de una fila
    $('#detalleArea tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('#detalleArea').DataTable().$('tr.selected').removeClass(
                'selected');
            $(this).addClass('selected');
        }
    });
    // Evento creado para abrir la ventana de editar al dar doble click sobre un registro
    $('#detalleArea tbody').on('dblclick', 'tr', function () {
        $(this).addClass('selected');
        var row = $("#detalleArea").DataTable().row('.selected').data();
        setObject(row);
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $("#tituloOperacion").html('Editar Área');
    });
}

function llenaDataTable() {
    var otable = $('#detalleArea').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTablaArea',
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
                $.each(index.listaReg, function (index, item) {
                    datos.push([item.idArea, item.nombre, item.descripcion, item.sucursales]);
                });
            });
        }
    });
    otable.clear().draw();
    otable.rows.add(datos);
    otable.draw();
    otable.ajax.reload();
}

function llenaComboSucursal() {
    var html = "";
    var numDivs;
    var divs = "";
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboSucursalWS',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (dataList) {
            if (!jQuery.isEmptyObject(dataList)) {
                $.each(dataList, function (index, list) {
                    var id;
                    numDivs = list.ListaRegistrosSucursal.length / 8;
                    for (var i = 1; i <= numDivs; i++) {
                        id = i * 8;
                        divs += '<div id="' + id + '" class="divSuc col-2" style="display:inline-block; "></div>';
                    }
                    if (!list.ListaRegistrosSucursal.length % 8 === 0) {
                        divs += '<div id="' + (parseInt(id) + 8) + '" class="divSuc col-2" style="display:inline-block;"></div>';
                    }
                    $("#sucursales").html(divs);
                    var lastIndx = 0;
                    var contador = 0;
                    $.each($("div[class='divSuc col-2']"), function (index, item) {
                        var divId = item.id;
                        var suc = "";
                        $.each(list.ListaRegistrosSucursal, function (index, item) {
                            if (index < divId && index >= lastIndx) {
                                suc += '<input type="checkbox" value="' + item.idSucursal + '" name=sucursal>' + item.nombre + '</input><br>';
                                contador = contador + 1;
                            }
                            lastIndx = contador;
                        });
                        $("#" + divId).html(suc);
                    });
                });
            }
        }
    });
}

function checkSucursalesSeleccionadas(idArea) {
    var html = "";
    var numDivs;
    var divs = "";
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/getidSucursalesByArea',
        data: JSON.stringify({ idArea: idArea }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (dataList) {
            $.each(dataList, function (index, list) {
                if (!jQuery.isEmptyObject(dataList)) {
                    $.each(dataList, function (index, list) {
                        var id;
                        numDivs = list.ListaRegistrosSucursal.length / 8;
                        for (var i = 1; i <= numDivs; i++) {
                            id = i * 8;
                            divs += '<div id="' + id + '" class="divSuc col-2" style="display:inline-block; "></div>';
                        }
                        if (!list.ListaRegistrosSucursal.length % 8 === 0) {
                            divs += '<div id="' + (parseInt(id) + 8) + '" class="divSuc col-2" style="display:inline-block;"></div>';
                        }
                        $("#sucursales").html(divs);
                        var lastIndx = 0;
                        var contador = 0;
                        $.each($("div[class='divSuc col-2']"), function (index, item) {
                            var divId = item.id;
                            var suc = "";
                            $.each(list.ListaRegistrosSucursal, function (index, item) {
                                if (index < divId && index >= lastIndx) {
                                    if (item.empresa === "checked") {
                                        suc += '<input type="checkbox" checked="' + item.empresa + '" value="' + item.idSucursal + '" name=sucursal>' + item.nombre + '</input><br>';
                                    } else {
                                        suc += '<input type="checkbox" value="' + item.idSucursal + '" name=sucursal>' + item.nombre + '</input><br>';
                                    }
                                    contador = contador + 1;
                                }
                                lastIndx = contador;
                            });
                            $("#" + divId).html(suc);
                        });
                    });
                }
            });
        }
    });
}


function editArea() {
    var sucursales = new Array();
    var valido = validateForm();
    if (valido) {
        $("input[name='sucursal']").each(function (index, item) {
            if ($("input[name='sucursal']:eq(" + index + ")").is(':checked')) {
                sucursales.push(parseInt($(this).val()));
            }

        });
        var parameters = {
            idArea: $("#idArea").val(),
            area: $("#area").val(),
            descripcion: $("#descripcion").val(),
            idSucursales: sucursales
        };
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/actualisarAreaWs',
            data: JSON.stringify(parameters),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                $.smallBox({
                    title: "Éxito!",
                    content: "Área <b>" + $("#descripcion").val() + "</b> Editado",
                    color: "#739e73",
                    timeout: 2000,
                    icon: "fa fa-thumbs-up swing animated"
                });
                llenaDataTable();
            }
        });
        $('#FormArea').data('bootstrapValidator').resetForm();
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    } else {
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    }
}

function validateForm() {
    $("#FormArea").bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnguardar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            area: {
                selector: '#area',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'El nombre del área es requerido'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            },
            descripcion: {
                selector: '#descripcion',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'La descripción del área es requerida'
                    },
                    regexp: {
                        regexp: /^[A-Za-z0-9-_\sáÁÉéÍíÓóÚúñÑ]*$/i,
                        message: 'Solo caracteres alfanúmericos'
                    }
                }
            }
        }
    });

    $('#FormArea').data('bootstrapValidator').validate();
    var valido = $('#FormArea').data('bootstrapValidator').isValid();
    return valido;
}

function limpiaDivs() {
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-success');
}
