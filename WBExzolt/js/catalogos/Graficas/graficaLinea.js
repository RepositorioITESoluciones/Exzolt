$(function () {

    $('#FechaInicio').datetimepicker({
        format: 'YYYY/MM/DD',
        //  locale: 'es',
        minDate: '+2017/01/01',
        maxDate: 'now'
    });

    initGraficaLineas();
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


function initGraficaLineas() {

    $('#FormReporte').show();
  //  $('#GraficaPastel').hide();

    

    $('#btnbuscar').click(function () {
        $('#detalleEnergia').empty();
        var valido;
        var chartData = [];
        valido = validateForm();
        console.log(valido);
        console.log($('#FechaInicio').val());
        var fechaInicio = $('#FechaInicio').val();
        var fechaFin = $('#FechaFin').val();
        //var fechaInicioauxiliar = $('#FechaInicio').val().split("/");
        //var fechaInicio = fechaInicioauxiliar[2] + "/" + fechaInicioauxiliar[0] + "/" + fechaInicioauxiliar[1];
        //var fechaInicioauxiliars = $('#FechaFin').val().split("/");
        //var fechaFin = fechaInicioauxiliars[2] + "/" + fechaInicioauxiliars[0] + "/" + fechaInicioauxiliars[1];

        console.log('Fecha inicio');
        console.log(fechaInicio);
        console.log('Fecha fin');
        console.log(fechaFin);
        if (valido) {
            console.log('entre a ajax');
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/GraficaProyeccion',
                dataType: 'json',
                data: "{'fechaInicio':'" + fechaInicio + "','fechaFin':'" + fechaFin + "'}",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //los datos obtenidos econsole.log(data);n jason del controlador
                    console.log(data);
                    $.each(data, function (index, item) {
                        $.each(item.ListaRegistros, function (index1, item1) {
                            console.log(item1.fechas + '----------' + item1.Porcentaje)
                            chartData.push({
                                name: item1.FechaCorta,
                                name2: item1.fechas,
                                value: item1.Porcentaje
                            })

                        });
                    });

                }
            });

            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                // "type": "areaspline",
                "theme": "light",
                "marginTop": 0,
                "marginRight": 80,
                "dataProvider": chartData,
                "valueAxes": [{
                    "axisAlpha": 0,
                    "position": "left"
                }],
                "graphs": [{
                    "id": "g1",
                    "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]] % OEE</span></b>",
                    "bullet": "round",
                    "bulletSize": 8,
                    "lineColor": "#d1655d",
                    "lineThickness": 2,
                    "negativeLineColor": "#637bb6",
                    "type": "smoothedLine",
                    "valueField": "value"
                }],
                "chartScrollbar": {
                    "graph": "g1",
                    "gridAlpha": 0,
                    "color": "#888888",
                    "scrollbarHeight": 55,
                    "backgroundAlpha": 0,
                    "selectedBackgroundAlpha": 0.1,
                    "selectedBackgroundColor": "#888888",
                    "graphFillAlpha": 0,
                    "autoGridCount": true,
                    "selectedGraphFillAlpha": 0,
                    "graphLineAlpha": 0.2,
                    "graphLineColor": "#c2c2c2",
                    "selectedGraphLineColor": "#888888",
                    "selectedGraphLineAlpha": 1

                },
                "chartCursor": {
                    //  "categoryBalloonDateFormat": "YYYY",
                    "cursorAlpha": 0,
                    "valueLineEnabled": true,
                    "valueLineBalloonEnabled": true,
                    "valueLineAlpha": 0.5,
                    "fullWidth": true
                },
                // "dataDateFormat": "YYYY",
                "categoryField": "name",
                "export": {
                    "enabled": false
                }
            });

            chart.addListener("rendered", zoomChart);
            if (chart.zoomChart) {
                chart.zoomChart();
            }

            function zoomChart() {
                chart.zoomToIndexes(Math.round(chart.dataProvider.length * 0.4), Math.round(chart.dataProvider.length * 0.55));
            }


            $('#FormParametros').data('bootstrapValidator').resetForm();
         //   $('#GraficaPastel').show();
            // $('#FormParametros').hide();
            // llenaDataTable();
        }
        else {
            //            $('#FormParametros').data('bootstrapValidator').resetForm();
           // $('#GraficaPastel').hide();
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


