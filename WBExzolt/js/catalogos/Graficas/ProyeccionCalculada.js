$(function () {
    initEventos();
  //  graficaLineas();
    grafica();
});

function initEventos() {

    $('input[name="daterange"]').daterangepicker();
    fechaHoy();
    function fechaHoy() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = mm + '/' + dd + '/' + yyyy;
        configuraionIdiomaDateRangePicker(today);
    }

    function configuraionIdiomaDateRangePicker(today) {
        $('#daterange').daterangepicker({
            "maxDate": today,
            "locale": {
                "format": "MM/DD/YYYY",
                "separator": " - ",
                "applyLabel": "Aceptar",
                "cancelLabel": "Cancelar",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Custom",
                "daysOfWeek": [
                    "Lu",
                    "Ma",
                    "Mi",
                    "Ju",
                    "Vi",
                    "Sa",
                    "Do"
                ],
                "monthNames": [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
                ],
                "firstDay": 1
            }
        })
    }


}


function grafica() {
  
        var graficas;
    var lineas;
    var chartData = generateChartData();

    var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
        "theme": "light",
        "legend": {
            "useGraphSettings": true
        },
        "dataProvider": chartData,
        "synchronizeGrid": true,
        "valueAxes": lineas,
        "graphs": graficas,
        "chartScrollbar": {},
        "chartCursor": {
            "cursorPosition": "mouse"
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "axisColor": "#DADADA",
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true,
            "position": "bottom-right",
            "beforeCapture": function() {
                var chart = this.setup.chart;
                var c = chart.graphs.length;
                for(var i = 0; i< c; i++)
                {
            chart.graphs[i].labelText = "[[value]]";
        }
                chart.validateNow();
            },
        }
    });

    chart.addListener("dataUpdated", zoomChart);
    zoomChart();

  function generateChartData() {
        var datos="";
        lineas ="";
        graficas = "";
        $.ajax({
              async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/GraficaProyeccion',
        dataType: 'json',
        data: "{'fechaInicio':'11/11/2017','fechaFin':'01/01/2018'}",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //los datos obtenidos en jason del controlador
            $.each(data, function (index, item) {
                $.each(item.ListaRegistros, function (index1, item1) {
                    console.log(item1.fechas + '----------' + item1.Porcentaje)
                    chartData.push({

                        datos: item1.fechas,
                        graficas: item1.Porcentaje,
                         lineas = data.lineas
                    });
                });
            });
        //    datos = data.valores;
        //graficas = data.graficas;
        //        lineas = data.lineas;
            },
            error: function (ex) {
            alert('ha ocurrido un error al cargar la gráfica.' + ex);
        }
        });
        chartData = $.parseJSON(datos);
        chartData.push(datos);
        return chartData;
    }

    function zoomChart() {chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
        }




}


function graficaLineas() {
    var chartData = [];

    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/GraficaProyeccion',
        dataType: 'json',
        data: "{'fechaInicio':'11/11/2017','fechaFin':'01/01/2018'}",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {


            $.each(data, function (index, item) {
                $.each(item.ListaRegistros, function (index1, item1) {
                    console.log(item1.fechas + '----------' + item1.Porcentaje)
                    chartData.push({
                       
                        date: item1.fechas,
                        value: item1.Porcentaje
                    });
                });
            });
        }
    });

    
            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "light",
                "marginRight": 40,
                "marginLeft": 40,
                "autoMarginOffset": 20,
                "mouseWheelZoomEnabled": true,
                "dataDateFormat": "YYYY, MM",
                "valueAxes": [{
                    "id": "v1",
                    "axisAlpha": 0,
                    "position": "left",
                    "ignoreAxisWidth": true
                }],
                "balloon": {
                    "borderThickness": 1,
                    "shadowAlpha": 0
                },
                "graphs": [{
                    "id": "g1",
                    "balloon": {
                        "drop": true,
                        "adjustBorderColor": false,
                        "color": "#ffffff"
                    },
                    "bullet": "round",
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#FFFFFF",
                    "bulletSize": 30,
                    "hideBulletsCount": 50,
                    "lineThickness": 2,
                    "title": "red line",
                    "useLineColorForBulletBorder": true,
                    "valueField": "value",
                    "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
                }],
                "chartScrollbar": {
                    "graph": "g1",
                    "oppositeAxis": false,
                    "offset": 30,
                    "scrollbarHeight": 80,
                    "backgroundAlpha": 0,
                    "selectedBackgroundAlpha": 0.1,
                    "selectedBackgroundColor": "#888888",
                    "graphFillAlpha": 0,
                    "graphLineAlpha": 0.5,
                    "selectedGraphFillAlpha": 0,
                    "selectedGraphLineAlpha": 1,
                    "autoGridCount": true,
                    "color": "#AAAAAA"
                },
                "chartCursor": {
                    "pan": true,
                    "valueLineEnabled": true,
                    "valueLineBalloonEnabled": true,
                    "cursorAlpha": 1,
                    "cursorColor": "#258cbb",
                    "limitToGraph": "g1",
                    "valueLineAlpha": 10,
                    "valueZoomable": true
                },
                "valueScrollbar": {
                    "oppositeAxis": false,
                    "offset": 50,
                    "scrollbarHeight": 10
                },
                "categoryField": "date",
                "categoryAxis": {
                    "parseDates": true,
                    "dashLength": 10,
                    "minorGridEnabled": true
                },
                "export": {
                    "enabled": false
                },
                "dataProvider": chartData
            });

            chart.addListener("rendered");

 
        }
         