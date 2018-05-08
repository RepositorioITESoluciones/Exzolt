$(function () {
    initEventos();
    //reporteOEE();
});

function initEventos() {
    console.log('entre al init');
    $('#divTiposTransaccion').show();
    $.timer(60000, function () {
        $(".hola").empty();
        $("#contenedorGraficaOEE").empty();
        setTimeout(reporteOEE(), 10);
        $('.percent').css("text-aling", "center");
        $('#easyCharSr').easyPieChart({
            delay: 2000,
            barColor: '#369E4D',
            trackColor: '#CBC9C9',
            scaleColor: false,
            lineWidth: 25,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });
    });


    function reporteOEE() {
        var html = "";
        var mes = "";
        var sumaOEE = 0;
        var totalReg = 0;
        var resultado = 0;
        
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/reporteOEEProduccion',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $.each(response, function (row, index) {
                    $.each(index.ListaRegistros, function (r, arr) {
                        sumaOEE += arr.OEE;
                        totalReg = index.ListaRegistros.length;
                        mes = arr.mes;
                    });
                    console.log(sumaOEE);
                    console.log(totalReg);
                    console.log(mes);
                    if (mes === "" || mes === null){
                        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                        ];
                        var d = new Date();
                        mes = monthNames[d.getMonth()];
                       
                    }
                    resultado = sumaOEE / totalReg;
                    if (isNaN(resultado)) {
                        resultado = 0;
                    }
                    console.log("El resultado es: " + resultado);
                    html = '<div id="easyCharSr" class="easy-pie-chart txt-color-blue easyPieChart" data-percent="' + resultado + '" data-size="160" data-pie-size="500">' +
                        '<span class="percent percent-sign txt-color-red font-xl semi-bold" ></span> </div>';
                   
                });

                $("#Mes").append(mes);
                $("#contenedorGraficaOEE").append(html);

            }
        });
    }


    setTimeout(reporteOEE(), 10);
    $('.percent').css("text-aling","center");
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
}

