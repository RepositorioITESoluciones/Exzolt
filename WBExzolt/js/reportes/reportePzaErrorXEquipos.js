$(function () {
    LlenaComboDepartamento();
    $('#FechaInicio').datetimepicker({
        format: 'YYYY/MM/DD',
        //  locale: 'es',
        minDate: '+2017/01/01',
        maxDate: 'now'
    });
    initDataTablePzaError();
});

$('#FechaInicio').on('dp.change', function (e) {
    $('#FechaFin').empty();
    // document.getElementById("FechaFin").resetForm();
    //   .disabled = false;
    var fechaFin = '';
    e = $('#FechaInicio').val();
    fechaFin = String(e);
    console.log(e);

    $('#FechaFin').datetimepicker({
        format: 'YYYY/MM/DD',
        //locale: 'es',
        minDate: '+' + fechaFin,
        maxDate: '2018/12/31'
    });
});

function initDataTablePzaError() {
    $('#FormReporte').show();
    $('#tablasReporte').hide();
    $.fn.dataTable.ext.errMode = 'none';
    var responsiveHelper_datatable_fixed_column = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480,
        desktop: 1260
    };
    var datos = [];

    $('#btnbuscar').click(function () {
        $('#detallePzaError').empty();
        var valido;
        datos = [];
        valido = validateForm();
        console.log(valido);
        if (valido) {
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/reportePiezasDefectuosas',
                data: "{'FechaInicio':'" + $('#FechaInicio').val() + "','FechaFin':'" + $('#FechaFin').val() + "','ComboDepar':'" + $('#ComboDepar').val() + "'}",
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    $('#loadingMod').modal('hide');
                    $.each(response, function (row, index) {
                        $.each(index.ListaRegistros, function (r, arr) {
                            var piezasTotal = (arr.piezasDefectuosas * 100) / arr.piezasProducidas;
                            datos.push([arr.idMaquina, arr.maquina.Descripcion, arr.piezasProducidas, arr.piezasDefectuosas, piezasTotal + " %"]);
                        });
                    });
                }
            });
            //$('#tablasReportes').show();
            var otable = $('#detallePzaError').DataTable({
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
                            $('#detallePzaError'), breakpointDefinition);
                    }
                },
                "drawCallback": function (oSettings) {
                    responsiveHelper_datatable_fixed_column.respond();
                },
                data: datos,
                columns: [
                    {
                        title: "idMaquina",
                        visible: false
                    },
                    {
                        title: "Descripción"
                    },
                    {
                        title: "Piezas producidas"
                    },
                    {
                        title: "Piezas defectuosas"
                    },
                    {
                        title: "Porcentaje"
                    }
                ]
            });

            //Evento creado para realizar la búsqueda cuando se presione la tecla ENTER
            $("#detallePzaError thead th input[type=text]").on(
                'keyup',
                function (e) {
                    otable.column($(this).parent().index() + ':visible').search(
                        this.value).draw();
                });

            // Método creado para agregar el evento de selección de una fila
            $('#detallePzaError tbody').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    $('#detallePzaError').DataTable().$('tr.selected').removeClass(
                        'selected');
                    $(this).addClass('selected');
                }
            });


            $('#FormParametros').data('bootstrapValidator').resetForm();
            $('#tablasReporte').show();
            // $('#FormParametros').hide();
            // llenaDataTable();
        }
        else {
            //            $('#FormParametros').data('bootstrapValidator').resetForm();
            $('#tablasReporte').hide();
            $('#FormParametros').show();
        }

    });

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