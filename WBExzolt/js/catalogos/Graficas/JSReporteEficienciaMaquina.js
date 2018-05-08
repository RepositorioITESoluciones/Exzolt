$(function () {
    initEventos();
});

function initEventos() {
    var cadenaCombodepartamentos = "";
    var cadenaComboMaquinas = "";
    $("#maquinas").prop("disabled", true);
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


    var cadenaDep = comboDepartamentos();
    $("#departamentos").html(cadenaDep);


    $("#departamentos").change(function () {
        $("#maquinas").prop("disabled", false);
        var idDepartamento = $("#departamentos").val();
        $.ajax({
            async: true,
            type: 'POST',
            url: 'WSLinPro.asmx/reporteEficienciaMaquinaPeriodo',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: "{'idDepartamento':'"+idDepartamento+"'}",
            success: function (response) {
                $("#contenedorGraficaPorMaquina").empty();
                cadenaComboMaquinas = "";
                $.each(response, function (row, index) {              
                    if (index.ListaRegistros.length === 0) {
                        $("#maquinas").empty();
                        cadenaComboMaquinas = "";
                        cadenaComboMaquinas += '<option value="' + 0 + '">No hay datos para mostrar</option>'
                    } else {
                        $("#maquinas").empty();
                        cadenaComboMaquinas = "";
                        cadenaComboMaquinas += '<option value="' + 0 + '"> Seleccione una opción </option>'
                        $.each(index.ListaRegistros, function (r, arr) {
                            console.log("CCCCCC: " + JSON.stringify(arr));
                            cadenaComboMaquinas += '<option value="' + arr.idMaquina + '">' + arr.maquina.Descripcion + '</option>'
                        });
                    }                                 
                });
                $("#maquinas").html(cadenaComboMaquinas);
            }
        });    
    })

    $("#maquinas").change(function () {
      //  console.log("WWWWWWWWWWWW:::::: " + $("#maquinas").val());
        var html = "";
        var mes = "";
        var sumaEficiencia = 0;
        var totalReg = 0;
        var resultado = 0;
        var fechas = $("#daterange").val();
        fechas = fechas.replace("\"");
        fechas = fechas.replace(/\s/g, '');
        fechas = fechas.split("-");   
        console.log(fechas);
        var fechaInicioauxiliar = fechas[0].split("/");
        var fechaInicio = fechaInicioauxiliar[2] + "/" + fechaInicioauxiliar[0] + "/" + fechaInicioauxiliar[1];
        var fechaFinauxiliar = fechas[1].split("/");
        var fechaFin = fechaFinauxiliar[2] + "/" + fechaFinauxiliar[0] + "/" + fechaFinauxiliar[1];
        console.log("Fecha inicio final: " + fechaInicio);
        console.log("Fecha fin final: " + fechaFin);
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/reporteEficienciaMaquinaPeriodoFinal',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: "{'fechaInicio':'" + fechaInicio + "','fechaFin':'" + fechaFin + "','idMaquina':'" + $("#maquinas").val() + "'}",
                success: function (response) {               
                    $("#contenedorGraficaPorMaquina").empty();
                    $.each(response, function (row, index) {               
                        $.each(index.ListaRegistros, function (r, arr) {

                            sumaEficiencia += arr.eficiencia;
                            totalReg = index.ListaRegistros.length                           
                        });
                        resultado = sumaEficiencia / totalReg;
                        console.log("El resultad5so es: " + resultado);
                        if (isNaN(resultado)) {
                            resultado = 0;
                        }
                        html = '<div id="easyCharSr" class="easy-pie-chart txt-color-blue easyPieChart" data-percent="' + resultado + '" data-size="160" data-pie-size="500">' +
                            '<span class="percent percent-sign txt-color-red font-xl semi-bold" ></span> </div>';
                    });
                    $("#contenedorGraficaPorMaquina").append(html);
                }
            });
            $('.percent').css("text-aling", "center");
            $('#easyCharSr').easyPieChart({
                delay: 2000,
                barColor: '#369E4D',
                trackColor: '#DBFCE2',
                scaleColor: false,
                lineWidth: 25,
                trackWidth: 16,
                lineCap: 'butt',
                onStep: function (from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });
    })

    //$("#departamentos").change(function () {
    //var html = "";
    //$("#contenedorGraficaPorMaquina").empty();
    //html = '<div id="easyCharSr" class="easy-pie-chart txt-color-blue easyPieChart" data-percent="' + resultado + '" data-size="160" data-pie-size="500">' +
    //    '<span class="percent percent-sign txt-color-red font-xl semi-bold" ></span> </div>';
    //$("#contenedorGraficaPorMaquina").append(html);

    //})

    $("#daterange").change(function () {
        var html = "";
        var mes = "";
        var sumaEficiencia = 0;
        var totalReg = 0;
        var resultado = 0;
        var fechas = $("#daterange").val();
        fechas = fechas.replace("\"");
        fechas = fechas.replace(/\s/g, '');
        fechas = fechas.split("-");
        console.log(fechas);
        var fechaInicioauxiliar = fechas[0].split("/");
        var fechaInicio = fechaInicioauxiliar[2] + "/" + fechaInicioauxiliar[0] + "/" + fechaInicioauxiliar[1];
        var fechaFinauxiliar = fechas[1].split("/");
        var fechaFin = fechaFinauxiliar[2] + "/" + fechaFinauxiliar[0] + "/" + fechaFinauxiliar[1];
        console.log("Fecha inicio final: " + fechaInicio);
        console.log("Fecha fin final: " + fechaFin);
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/reporteEficienciaMaquinaPeriodoFinal',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: "{'fechaInicio':'" + fechaInicio + "','fechaFin':'" + fechaFin + "','idMaquina':'" + $("#maquinas").val() + "'}",
            success: function (response) {
                $("#contenedorGraficaPorMaquina").empty();
                $.each(response, function (row, index) {
                    $.each(index.ListaRegistros, function (r, arr) {
                        sumaEficiencia += arr.eficiencia;
                        totalReg = index.ListaRegistros.length
                    });
                    resultado = sumaEficiencia / totalReg;
                    console.log("El resultado es: " + resultado);
                    if (isNaN(resultado)) {
                        resultado = 0;
                    }
                    html = '<div id="easyCharSr" class="easy-pie-chart txt-color-blue easyPieChart" data-percent="' + resultado + '" data-size="160" data-pie-size="500">' +
                        '<span class="percent percent-sign txt-color-red font-xl semi-bold" ></span> </div>';
                });
                $("#contenedorGraficaPorMaquina").append(html);
            }
        });
        $('.percent').css("text-aling", "center");
        $('#easyCharSr').easyPieChart({
            delay: 2000,
            barColor: '#369E4D',
            trackColor: '#DBFCE2',
            scaleColor: false,
            lineWidth: 25,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });
    })



}