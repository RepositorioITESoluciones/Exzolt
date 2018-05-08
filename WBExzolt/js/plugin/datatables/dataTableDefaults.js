//configuracion general de los DataTable

//valores de la opcion "dom", orden en el que se muestra cada seccion
//The built-in table control elements in DataTables are:
//
//B - buttons
//l - length changing input control
//f - filtering input
//t - The table!
//i - Table information summary
//p - pagination control
//r - processing display element

//Further to these options, you can also specify additional div elements to be inserted into the document, which can be used for styling / nesting of the control elements. To add tags, the following syntax is expected:
//
//< and > - div element
//<"class" and > - div with a class
//<"#id" and > - div with an ID
//<"#id.class" and > - div with an ID and a class
//ejemplo
/* Results in:
    <div class="top">
      {information}
    </div>
    {processing}
    {table}
    <div class="bottom">
      {filter}
      {length}
      {pagination}
    </div>
    <div class="clear"></div>
*/
/*$('#example').dataTable( {
  "dom": '<"top"i>rt<"bottom"flp><"clear">'
} );*/

var dataTableES = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Del _START_ al _END_ de _TOTAL_",
    "sInfoEmpty":      "0 registros",
    "sInfoFiltered":   "(de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "<<",
        "sLast":     ">>",
        "sNext":     ">",
        "sPrevious": "<"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};

//ver explicacion arriba
var formato = 
	'<"top" ' +
		'<"row"  ' +
		'<"col-md-3"i> ' +
		'<"col-md-6"p> ' +
		'<"col-md-3 divCenter dataTables_length"l B> ' +
		'> ' +
	'>  ' +
	't ' +
	'<"bottom"' +
		'<"row"' +
		'<"col-md-6"> ' +
		'<"col-md-6"> ' + // f
		'> ' +
	'>'; // + '<"clear">'; //'Bfrtilp';

//formato = "<<'col-sm-6 col-xs-12  hidden-xs'><'col-sm-6 col-xs-12 hidden-xs'<'toolbar'>>r>"
//	+ "t"
//	+ "<'dt-toolbar-footer'<'col-sm-3 col-xs-12'i><'col-sm-6 col-xs-12 divCenter'p><'col-sm-3 col-xs-12'l>>";

// TODO poner todas las opciones disponibles con sus posibles valores
$.extend( $.fn.dataTable.defaults, {
	language: dataTableES,
	destroy: true,
//    searching: true,
//    ordering:  true,
//    scrollY: false,
//    scrollX: false,
    paging: true,
    aLengthMenu: [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, "Todo"]],
    iDisplayLength : 10,
    dom: formato,
    buttons: [
//    	{
//            extend: 'copy',
//            text: 'Copiar',
//            exportOptions: {
//                modifier: {
//                    page: 'current'
//                }
//            }
//        },
//      'print',
      'excel',
      'csv',
      'pdf'
      ]
//,
//      rowId: 'id'
} );

