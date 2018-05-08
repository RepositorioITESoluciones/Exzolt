
$(function () {
    $('#FechaInicio').datetimepicker({
        format: 'YYYY/MM/DD',
        //  locale: 'es',
        minDate: '+2017/01/01',
        maxDate: 'now'
    });

    LlenaComboDepartamento();
    initGraficaPastel();
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


function initGraficaPastel() {
    $('#FormReporte').show();

    $('#btnbuscar').click(function () {
        var valido;
        var html = "";
        var mes = "";
        var sumaEficiencia = 0;
        var totalReg = 0;
        var resultado = 0;
        valido = validateForm();
        //console.log(valido);
        //console.log($('#FechaInicio').val());
        var fechaInicioauxiliar = $('#FechaInicio').val().split("/");
        var fechaInicio = fechaInicioauxiliar[2] + "/" + fechaInicioauxiliar[0] + "/" + fechaInicioauxiliar[1];
        var fechaInicioauxiliars = $('#FechaFin').val().split("/");
        var fechaFin = fechaInicioauxiliars[2] + "/" + fechaInicioauxiliars[0] + "/" + fechaInicioauxiliars[1];
        //console.log('Fecha inicio');
        //console.log(fechaInicio);
        //console.log('Fecha fin');
        //console.log(fechaFin);
        if (valido) {
          //  console.log('entre a ajax');
            $.ajax({
                async: false,
                type: 'POST',
                url: 'WSLinPro.asmx/reporteEficienciaMaquinaPeriodoFinal',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: "{'fechaInicio':'" + fechaInicio + "','fechaFin':'" + fechaFin + "','idMaquina':'" + $("#ComboMaq").val() + "'}",
                success: function (response) {
                    $("#contenedorGraficaPorDepartamento").empty();
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
                    $("#contenedorGraficaPorDepartamento").append(html);
                }
            });
            $('.percent').css("text-aling", "center");
            $('#easyCharSr').easyPieChart({
                delay: 2000,
                barColor: '#369E4D',
                trackColor: '#CBC9C9',
                //FF0C0C - DBFCE2
                scaleColor: false,
                lineWidth: 25,
                trackWidth: 16,
                lineCap: 'butt',
                onStep: function (from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });


            $('#FormParametros').data('bootstrapValidator').resetForm();
        }
        else {
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
            },
            idDepartamento: {
                selector: '#idDepartamento',
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
            Maquina: {
                selector: '#ComboMaq',
                group: '.form-group',
                validators: {
                    callback: {
                        message: 'Selecciona una Máquina',
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

    $('#FormParametros').data('bootstrapValidator').validate();
    var valido = $('#FormParametros').data('bootstrapValidator').isValid();
    return valido;
}

function LlenaComboDepartamento() {
    var html;
    //console.log('Entre  al combo departamento');
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
            $("#idDepartamento").html(html);
        }
    });

}

function actualizaMaq() {
    var idDepartamento = $('select[id=idDepartamento]').val();
    //alert(JSON.stringify($('#FormAltaPersonal').serializeArray()))
    var html = "";
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/LlenaMaquina',
        data: JSON.stringify({ idDepartamento: idDepartamento }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            html += '<option value="0">Seleccione</option>';
            $.each(data, function (index, item) {
                $.each(item.ListaRegistrosMaquina, function (index1, item1) {
                    html += '<option value="' + item1.IdMaquina + '">' + item1.Descripcion + '</option>';
                });
            });
            $("#ComboMaq").html(html);
        }
    });

}

