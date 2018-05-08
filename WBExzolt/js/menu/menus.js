$(function () {
    getMenus();
    $("#left-panel").css('width', '50px');
    $(".menu-item-parent").css('display','none');
    $(".emP").css('display', 'none');
    $("#main").css('margin-left', '50px');

    $("#left-panel").mouseover(function () {
        $("#main").css('margin-left', '225px');
        $("#left-panel").css('width', '225px');
        $(".menu-item-parent").css('display', 'inline-block'); 
        $(".emP").css('display', 'inline-block');
    });

    $("#left-panel").mouseout(function () {
        if ($(".top-menu-invisible").hasClass('active')) {
            $("#main").css('margin-left', '225px');
            $("#left-panel").css('width', '225px');
        } else {
            $("#main").css('margin-left', '50px');
            $("#left-panel").css('width', '50px');
            $(".menu-item-parent").css('display', 'none');
            $(".emP").css('display', 'none');
        }

    });
  
});


function getMenus() {
    var html="";
    $.ajax({
        async: false,
        type: 'POST',
        url: 'WSLinPro.asmx/muestraMenus',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (dataList) {
            $.each(dataList, function (index, list) {
                html += '<ul class="menu-items">';
                $.each(list.listaMenus, function (index, item) {
                    html += '<li class="top-menu-invisible" id="li' + item.idMenu + '">' +
                                    '<a href="' + item.liga + '" onclick="getSubMenus(' + item.idMenu + '); showSubmenu(' + item.idMenu + ')">' +
                                    '<i class="'+item.icono+'"></i> <span class="menu-item-parent">' + item.nombreMenu + '</span>';
                    if(item.idMenu != 1 && item.hijos === 1){
                        html += '<b class="collapse-sign"><em class="fa fa-plus-square-o emP"></em></b>';
                    }
                    html += '</a>' +
                                    '<div id="list' + item.idMenu + '"></div>' +
                             '</li>';
                });
                html += '</ul>';
                $("nav").html(html);
            });
        }
    });
}

function getSubMenus(idMenu) {
    if (parseInt(idMenu) != 0) {
        $.ajax({
            async: false,
            type: 'POST',
            url: 'WSLinPro.asmx/muestraSubMenus',
            data: JSON.stringify({ idPadre: idMenu }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (dataList) {
                if (!jQuery.isEmptyObject(dataList)) {
                    pintMenuHijos(dataList, idMenu)
                } 
            }
        });
    }
}

function pintMenuHijos(dataList, idPadre) {
    var html="";
    $.each(dataList, function (index, menuHijos) {
        if (!jQuery.isEmptyObject(menuHijos.listaMenusHijos)) {
            html += '<ul class="sub-items">';
            $.each(menuHijos.listaMenusHijos, function (index, item) {
                html += '<li class="scroll " id="li' + item.idMenu + '">' +
                                '<a href="' + item.liga + '" onclick="getSubMenus(' + item.idMenu + '); showSubmenu(' + item.idMenu + ')" class="listChildren">' +
                                '<i class="' + item.icono + '"></i> <span  class="menu-item-parent" onclick=" ">' + item.nombreMenu + '</span>';
                                if(item.hijos === 1){
                                    html += '<b class="collapse-sign"><em class="fa fa-plus-square-o"></em></b>';
                                }
                                html += '</a>' +
                                '<div id="list' + item.idMenu + '"></div>' +    
                            '</li>';
            });
            html += '</ul>';
            $("#list" + idPadre).html(html);
        }
    });
}

function showSubmenu(idPadre) {
        if ($("#list" + idPadre + " > * ").length > 0 && $("#li" + idPadre + "  > a > b  > em:first-child").hasClass("fa fa-plus-square-o")) {
            $("#list" + idPadre).show();
            $("#li" + idPadre).addClass('active');
            $("#li" + idPadre + " > a > b > em:first-child").removeClass('fa fa-plus-square-o');
            $("#li" + idPadre + " > a > b > em:first-child").addClass('fa fa-minus-square-o');
        } else {
            $("#list" + idPadre).hide();
            $("#li" + idPadre).removeClass('active');
            $("#li" + idPadre + " em:first-child").removeClass('fa fa-minus-square-o');
            $("#li" + idPadre + " em:first-child").addClass('fa fa-plus-square-o');
        }   
}
