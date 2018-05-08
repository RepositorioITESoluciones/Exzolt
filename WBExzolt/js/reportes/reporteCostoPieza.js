$(function () {

    LlenaComboDepartamento();
    $('#FechaInicio').datetimepicker({
        format: 'DD/MM/YYYY hh:mm:ss'
    });
    $('#FechaFin').datetimepicker({
        format: 'DD/MM/YYYY hh:mm:ss'
    });
    InitDatatableCosto();
});

function LlenaComboDepartamento() {
    var html;
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/departamento',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegistros, function (index1, item1) {

                    html += '<option value="' + item1.departamento.idDepartamento + '">' + item1.departamento.nombreDepartamento + '</option>';
                });
            });
            $("#ComboDepar").html(html);
        }
    });

}

function InitDatatableCosto() {
    $('#FormularioAlta').show();
    $('#AdminTransaccion').hide();
    $.fn.dataTable.ext.errMode = 'none';
    var responsiveHelper_datatable_fixed_column = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480,
        desktop: 1260
    };
    var datos = [];
    $('#btnbuscar').click(function () {

        var valido;
        valido = validateForm();
        console.log(valido);
        if (valido) {
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/LlenaReporteCostoPzaPorMaquina',
                data: "{'FechaInicio':'" + $('#FechaInicio').val() + "','FechaFin':'" + $('#FechaFin').val() + "','ComboDepar':'" + $('#ComboDepar').val() + "'}",
                //1data: JSON.stringify({ FechaInicio: $('#FechaInicio').val, FechaFin: $('#FechaFin').val, ComboDepar: $('#ComboDepar').val }),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    $('#loadingMod').modal('hide');
                    $.each(response, function (row, index) {
                        $.each(index.ListaRegistros, function (r, arr) {
                            datos.push([arr.fecha, arr.maquina.Descripcion, arr.piezasProducidas, arr.costoPza, arr.eficiencia]);
                        });
                    });
                }
            });
        
        var otable = $('#detalleCostoPza').DataTable({
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
                        $('#detalleCostoPza'), breakpointDefinition);
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
            columns: [
                {
                    title: "fecha",
                    "render": function (data, type, row) {
                        var fechaAlta = datetimeToDateFormat(data);
                        return fechaAlta.substr(0, 11);
                    }
                },
                {
                    title: "descripcion"
                },
                {
                    title: "piezasProducidas"
                },
                {
                    title: "costoPza"
                },
                {
                    title: "Total"
                }
            ]
        });

        // Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
        $("#detalleCostoPza thead th input[type=text]").on(
            'keyup',
            function (e) {
                otable.column($(this).parent().index() + ':visible').search(
                    this.value).draw();
            });

        // Método creado para agregar el evento de selección de una fila
        $('#detalleCostoPza tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $('#detalleCostoPza').DataTable().$('tr.selected').removeClass(
                    'selected');
                $(this).addClass('selected');
            }
        });
        $('#FormParametros').data('bootstrapValidator').resetForm();
        otable.clear().draw();
        otable.rows.add(datos);
        otable.draw();
        otable.ajax.reload();    }
        else {
            $('#AdminTransaccion').hide();
            $('#FormularioAlta').clearQueue();
        }
    });

    //document.getElementById("#FechaInicio").value = "";
}

function validateForm() {
    $("#FormParametros").bootstrapValidator({
        excluded: [':disabled'],
        live: 'enabled',
        submitButtons: 'button[id="btnbuscar"]',
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        fields: {
            idDepartamento: {
                selector: '#ComboDepar',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona un Departamento',
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
            FechaInicio: {
                selector: '#FechaInicio',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'Debe ingresar una fecha de Inicio'
                    }
                }
            },
            FechaFin: {
                selector: '#FechaFin',
                group: '.form-group',
                validators: {
                    notEmpty: {
                        message: 'Debe ingresar una fecha final'
                    }
                }
            }
        }
    });

    $('#FormParametros').data('bootstrapValidator').validate();
    var valido = $('#FormParametros').data('bootstrapValidator').isValid();
    return valido;
}