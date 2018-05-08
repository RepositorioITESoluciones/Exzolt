$(function () {
    initEventos();
    initDataTable();
});

function initEventos() {
    $('#btnPlus').click(function () {
        document.getElementById("FormArea").reset();
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
        $('#btnguardar').show();
    });

    $('#btnAtras').click(function () {
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
    });

    $('#btnguardar').click(function () {
        $('#divTiposTransaccion').show();
        $('#FormularioAlta').hide();
        var row = $("#detalleArea").DataTable().row('.selected').data();
        if (row) {
            editUsuario();
        } else {
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/insertaAreaWs',
                data: $('#FormArea').serializeArray(),
                success: function () {
                    $.smallBox({
                        title: "Éxito!",
                        content: "Área <b>" + $('#descripcion').val() + "</b> agregado",
                        color: "#739e73",
                        timeout: 2000,
                        icon: "fa fa-thumbs-up swing animated"
                    });
                    llenaDataTable();
                }
            })

        }
    });

    /*  $('#btnguardar2').click(function () {
          console.log("url "+url+ " des " + $("#descripcion").val() + " sucs " + $("#sucursal").val() + " ar " + $("#idArea").val());
          $('#divTiposTransaccion').show();
          $('#FormularioAlta').hide();
          $.ajax({
              async: false,
              type: 'POST',
              url: url,
              data: {
                  descripcion: $("#descripcion").val(),
                  idSucursal: $("input#sucursal").val(),
                  idArea: $("#idArea").val()
              },
              success: function () {
                  $.smallBox({
                      title: "Éxito!",
                      content: "Area <b>" + $("#descripcion").val() + "</b> Editado",
                      color: "#739e73",
                      timeout: 2000,
                      icon: "fa fa-thumbs-up swing animated"
                  });
                  llenaDataTable();
              }
          })
      }); */

    $("#btnDelete").click(function () {
        var row = $('#detalleArea').DataTable().row('.selected').data();
        if (row) {
            var idArea = row[0];
            $.SmartMessageBox({
                title: "¿Desea <font color='#ff9100'><b>eliminar</b></font> el área <b>" + row[1] + "</b>?",
                content: "Una vez eliminada la Transaccion no podras volver acceder a ella.",
                buttons: '[No][Si]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Si") {
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: 'WSLinPro.asmx/eliminarAreaWs',
                        data: JSON.stringify({ idArea: idArea }),
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
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    })

    $("#btnEdit").click(function () {
        var row = $("#detalleArea").DataTable().row('.selected').data();
        if (row) {
            $("#idArea").val(row[0]);
            $("#descripcion").val(row[1]);
            $("input#sucursal").val(row[2]);
            $('#divTiposTransaccion').hide();
            $('#FormularioAlta').show();
        } else {
            showWarningMessage('Información </b>', '<i>Debe seleccionar por lo menos un elemento</i>');
        }
    })
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
        url: 'WSLinPro.asmx/LlenaTabla',
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
                $.each(index.ListaRegistrosArea, function (r, arr) {
                    datos.push([arr.idArea, arr.descripcion, arr.idSucursal]);
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
        "autoWidth": true,
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
            title: "Sucursal"
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
        $("#idArea").val(row[0]);
        $("#descripcion").val(row[1]);
        $("input#sucursal").val(row[2]);
        $('#divTiposTransaccion').hide();
        $('#FormularioAlta').show();
    });
}

function llenaDataTable() {
    var otable = $('#detalleArea').DataTable();
    var datos = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaTabla',
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
                $.each(index.ListaRegistrosArea, function (index, item) {
                    datos.push([item.idArea, item.descripcion, item.idSucursal]);
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
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaComboSucursalWS',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $.each(data, function (index, item) {
                html += '<option value="'+item.id+'">"'+item.nombre+'"</option>';
            });
            $("#sucursal").html(html);
        }
    });

}

function editUsuario() {
    $('#divTiposTransaccion').show();
    $('#FormularioAlta').hide();
    console.log("url " + url + " des " + $("#descripcion").val() + " sucs " + $("#sucursal").val() + " ar " + $("#idArea").val());
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/actualisarAreaWs',
        data: {
            descripcion: $("#descripcion").val(),
            idSucursal: $("#sucursal").val(),
            idArea: $("#idArea").val()
        },
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
    })
}