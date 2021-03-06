$(function() {
    var config =  {
        empresa: $('#lienzo_recalculable').find('input[name=emp]').val(),
        sucursal: $('#lienzo_recalculable').find('input[name=suc]').val(),
        tituloApp: 'Reporte de Envasado',
        contextpath : $('#lienzo_recalculable').find('input[name=contextpath]').val(),
        userName : $('#lienzo_recalculable').find('input[name=user]').val(),
        ui : $('#lienzo_recalculable').find('input[name=iu]').val(),

        getUrlForGetAndPost : function(){
            var url = document.location.protocol + '//' + document.location.host + this.getController();
            return url;
        },

        getEmp: function(){
            return this.empresa;
        },

        getSuc: function(){
            return this.sucursal;
        },

        getUserName: function(){
            return this.userName;
        },

        getUi: function(){
            return this.ui;
        },
        getTituloApp: function(){
            return this.tituloApp;
        },

        getController: function(){
            return this.contextpath + "/controllers/proreportenvasado";
        }
    };

    //desencadena evento del $campo_ejecutar al pulsar Enter en $campo
    $aplicar_evento_keypress = function($campo, $campo_ejecutar){
        $campo.keypress(function(e){
            if(e.which == 13){
                $campo_ejecutar.trigger('click');
                return false;
            }
        });
    }

    $('#header').find('#header1').find('span.emp').text(config.getEmp());
    $('#header').find('#header1').find('span.suc').text(config.getSuc());
    $('#header').find('#header1').find('span.username').text(config.getUserName());
    //aqui va el titulo del catalogo
    $('#barra_titulo').find('#td_titulo').append(config.getTituloApp());

    $('#barra_acciones').hide();
    //barra para el buscador
    $('#barra_buscador').hide();

    var $tabla_envasado = $('#lienzo_recalculable').find('#lista_envasado');
    var $select_agentes = $('#lienzo_recalculable').find('select[name=select_agentes]');
    var $boton_busqueda = $('#lienzo_recalculable').find('#boton_busqueda');
    var $boton_genera_pdf = $('#lienzo_recalculable').find('#boton_genera_pdf');

    var input_json = config.getUrlForGetAndPost()+'/getDatosBusqueda.json';

    $arreglo = {
        'iu':iu = $('#lienzo_recalculable').find('input[name=iu]').val()
    };

    $.post(input_json,$arreglo,function(entry){
        //aqui van los campos que se cargan desde un principio.
//        $select_agentes.children().remove();
//        var almacen_hmtl = '';
//        var almacen_hmtl = '<option value="0" selected="yes">[--Todos--]</option>';
//        $.each(entry['Agentes'],function(entryIndex,alm){
//            almacen_hmtl += '<option value="' + alm['id'] + '"  >' + alm['nombre_agente'] + '</option>';
//        });
//        $select_agentes.append(almacen_hmtl);
    });//termina llamada json

    $boton_genera_pdf.click(function(event){
        var cadena =  $select_agentes.val() ;
        var input_json = config.getUrlForGetAndPost() + '/getReporteEnvasado/'+cadena+'/'+config.getUi()+'/out.json';
        window.location.href=input_json;
    });
    var height2 = $('#cuerpo').css('height');
    var alto = parseInt(height2)-240;
    var pix_alto=alto+'px';

    $('#table_clientes').tableScroll({
        height:parseInt(pix_alto)
    });

    //ejecutar busqueda del reporte
    $boton_busqueda.click(function(event){
        $tabla_envasado.find('tbody').children().remove();
        var input_json = config.getUrlForGetAndPost()+'/getProReporteEnvasado.json';
        $arreglo = {
            'id_agente':$select_agentes.val(),
            'iu': config.getUi()
        };

        var trr="";
        $.post(input_json,$arreglo,function(entry){

            trr +='<thead> <tr>';
            trr +='<td >Envasado 1</td>';
            trr +='<td >Envasado 2(s)</td>';
            trr +='<td >Envasado 3</td>';
            trr +='<td >Envasado 4</td>';
            trr +='<td >Envasado 5</td>';
            trr +='<td >Envasado 6(s)</td>';
            trr +='<td >Envasado 7</td>';
            trr +='<td >Envasado 8</td>';
            trr +='<td >Envasado 9</td>';
            trr +='<td >Envasado 10</td>';
            trr +='<td >Envasado 11</td>';
            trr +='<td >Envasado 12</td>';

            trr +='</tr> </thead>';

            if(entry['Datos_R_Envasado'].length > 0 ){
                $.each(entry['Datos_R_Envasado'],function(entryIndex,R_envasado){
                    trr += '<tr>';
                    trr += '<td width="100px">'+R_envasado['columna_1']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_2']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_3']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_4']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_5']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_6']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_7']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_8']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_9']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_10']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_11']+'</td>';
                    trr += '<td width="100px">'+R_envasado['columna_12']+'</td>';
                    trr += '</tr>';
                });
                $tabla_envasado.find('tbody').append(trr);
            }else{
                jAlert("Esta consulta no genero Resultados",'Atencion!!!');
            }

            var height2 = $('#cuerpo').css('height');
            var alto = parseInt(height2)-275;
            var pix_alto=alto+'px';
            $('#lista_envasado').tableScroll({
                height:parseInt(pix_alto)
            });
        });
    });

    $aplicar_evento_keypress($select_agentes, $boton_busqueda);
    $select_agentes.focus();
});