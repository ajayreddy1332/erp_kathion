$(function() {
	var config =  {
		empresa: $('#lienzo_recalculable').find('input[name=emp]').val(),
		sucursal: $('#lienzo_recalculable').find('input[name=suc]').val(),
		tituloApp: 'Reporte de Saldos por Mes' ,                 
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
			return this.contextpath + "/controllers/cxprepsaldomes";
			//  return this.controller;
		}
	};
	
	$('#header').find('#header1').find('span.emp').text(config.getEmp());
	$('#header').find('#header1').find('span.suc').text(config.getSuc());
    $('#header').find('#header1').find('span.username').text(config.getUserName());
	//aqui va el titulo del catalogo
	$('#barra_titulo').find('#td_titulo').append(config.getTituloApp());
	
	$('#barra_acciones').hide();
	
	//barra para el buscador 
	$('#barra_buscador').hide();
	
	//var $proveedor = $('#lienzo_recalculable').find('table#busqueda tr td').find('input[name=proveedor]');
	var $select_tipo_reporte = $('#lienzo_recalculable').find('table#busqueda tr td').find('select[name=tipo_reporte]');
	var $select_ano = $('#lienzo_recalculable').find('table#busqueda tr td').find('select[name=select_ano]');
	var $select_mes = $('#lienzo_recalculable').find('table#busqueda tr td').find('select[name=select_mes]');
	var $id_proveedor_edo_cta = $('#lienzo_recalculable').find('table#busqueda tr td').find('input[name=id_proveedor_edo_cta]');
	var $razon_proveedor = $('#lienzo_recalculable').find('table#busqueda tr td').find('input[name=razon_proveedor]');
	var $buscar_proveedor= $('#lienzo_recalculable').find('table#busqueda tr td').find('a[href*=buscar_proveedor]');
	var $genera_PDF = $('#lienzo_recalculable').find('table#busqueda tr td').find('input[value$=Generar_PDF]');
	var $busqueda_reporte= $('#lienzo_recalculable').find('table#busqueda tr td').find('input[value$=Buscar]');
	var $div_reporte_estados_de_cuenta= $('#lienzo_recalculable').find('#divreporteedocta');
	
	$razon_proveedor.attr('readonly',true);
	$razon_proveedor.css({'background' : '#DDDDDD'});
	$buscar_proveedor.hide();
	
	$select_tipo_reporte.children().remove();
	html='<option value="0">General</option>';
	html+='<option value="1">Por proveedor</option>';
	$select_tipo_reporte.append(html);
	
	var array_meses = {0:"- Seleccionar -",  1:"Enero",  2:"Febrero", 3:"Marzo", 4:"Abirl", 5:"Mayo", 6:"Junio", 7:"Julio", 8:"Agosto", 9:"Septiembre", 10:"Octubre", 11:"Noviembre", 12:"Diciembre"};
	
	
	$select_tipo_reporte.change(function(){
		if(parseInt($(this).val())==0){
			$razon_proveedor.css({'background' : '#DDDDDD'});
			$razon_proveedor.attr('readonly',true);
			$buscar_proveedor.hide();
			$razon_proveedor.val('');
			$id_proveedor_edo_cta.val(0);
		}else{
			$razon_proveedor.css({'background' : '#ffffff'});
			$buscar_proveedor.show();
			$razon_proveedor.attr('readonly',false);
		}
	});
	


	 var arreglo_parametros = { 
		iu:config.getUi()
	 };
		
	var restful_json_service = config.getUrlForGetAndPost() + '/getDatos.json';
	$.post(restful_json_service,arreglo_parametros,function(entry){
		//carga select de años
		$select_ano.children().remove();
		var html_anio = '';
		$.each(entry['Anios'],function(entryIndex,anio){
			if(parseInt(anio['valor']) == parseInt(entry['Dato'][0]['anioActual']) ){
				html_anio += '<option value="' + anio['valor'] + '" selected="yes">' + anio['valor'] + '</option>';
			}else{
				html_anio += '<option value="' + anio['valor'] + '"  >' + anio['valor'] + '</option>';
			}
		});
		$select_ano.append(html_anio);
		
		//cargar select del Mes inicial
		$select_mes.children().remove();
		var select_html = '';
		for(var i in array_meses){
			if(parseInt(i) == parseInt(entry['Dato'][0]['mesActual']) ){
				select_html += '<option value="' + i + '" selected="yes">' + array_meses[i] + '</option>';	
			}else{
				select_html += '<option value="' + i + '"  >' + array_meses[i] + '</option>';	
			}
		}
		$select_mes.append(select_html);
	});




	$busca_proveedores = function(){
		$(this).modalPanel_Buscaprov();
		var $dialogoc =  $('#forma-buscaproveedor-window');
		$dialogoc.append($('div.buscador_proveedores').find('table.formaBusqueda_proveedores').clone());
		$('#forma-buscaproveedor-window').css({ "margin-left": -200, 	"margin-top": -200  });
		
		var $tabla_resultados = $('#forma-buscaproveedor-window').find('#tabla_resultado');
		var $campo_rfc = $('#forma-buscaproveedor-window').find('input[name=campo_rfc]');
		var $campo_email = $('#forma-buscaproveedor-window').find('input[name=campo_email]');
		var $campo_nombre = $('#forma-buscaproveedor-window').find('input[name=campo_nombre]');
		
		var $buscar_plugin_proveedor = $('#forma-buscaproveedor-window').find('#busca_proveedor_modalbox');
		var $cancelar_plugin_busca_proveedor = $('#forma-buscaproveedor-window').find('#cencela');
		
		$('#forma-entradamercancias-window').find('input[name=tipo_proveedor]').val('');
			
		//funcionalidad botones
		$buscar_plugin_proveedor.mouseover(function(){
			$(this).removeClass("onmouseOutBuscar").addClass("onmouseOverBuscar");
		});
		$buscar_plugin_proveedor.mouseout(function(){
			$(this).removeClass("onmouseOverBuscar").addClass("onmouseOutBuscar");
		});
		   
		$cancelar_plugin_busca_proveedor.mouseover(function(){
			$(this).removeClass("onmouseOutCancelar").addClass("onmouseOverCancelar");
		});
		$cancelar_plugin_busca_proveedor.mouseout(function(){
			$(this).removeClass("onmouseOverCancelar").addClass("onmouseOutCancelar");
		});
		
		
		//click buscar proveedor
		$buscar_plugin_proveedor.click(function(event){
			//event.preventDefault();
			var restful_json_service = config.getUrlForGetAndPost() + '/getBuscaProveedores.json'
			$arreglo = {    rfc:$campo_rfc.val(),
							email:$campo_email.val(),
							nombre:$campo_nombre.val(),
							iu:config.getUi()
						}
			
			var trr = '';
			$tabla_resultados.children().remove();
			$.post(restful_json_service,$arreglo,function(entry){
				$.each(entry['Proveedores'],function(entryIndex,proveedor){
					
					trr = '<tr>';
						trr += '<td width="120">';
							trr += '<input type="hidden" id="id_prov" value="'+proveedor['id']+'">';
							trr += '<input type="hidden" id="tipo_prov" value="'+proveedor['proveedortipo_id']+'">';
							trr += '<span class="rfc">'+proveedor['rfc']+'</span>';
						trr += '</td>';
						trr += '<td width="250"><span id="razon_social">'+proveedor['razon_social']+'</span></td>';
						trr += '<td width="250"><span class="direccion">'+proveedor['direccion']+'</span></td>';
					trr += '</tr>';
					
					$tabla_resultados.append(trr);
				});
				$tabla_resultados.find('tr:odd').find('td').css({ 'background-color' : '#e7e8ea'});
				$tabla_resultados.find('tr:even').find('td').css({ 'background-color' : '#FFFFFF'});

				$('tr:odd' , $tabla_resultados).hover(function () {
					$(this).find('td').css({ background : '#FBD850'});
				}, function() {
					$(this).find('td').css({'background-color':'#e7e8ea'});
				});
				$('tr:even' , $tabla_resultados).hover(function () {
					$(this).find('td').css({'background-color':'#FBD850'});
				}, function() {
					$(this).find('td').css({'background-color':'#FFFFFF'});
				});
				
				//seleccionar un producto del grid de resultados
				$tabla_resultados.find('tr').click(function(){
					//asigna la razon social del proveedor al campo correspondiente
					$razon_proveedor.val($(this).find('#razon_social').html());
					$id_proveedor_edo_cta.val($(this).find('#id_prov').val());
					//elimina la ventana de busqueda
					var remove = function() { $(this).remove(); };
					$('#forma-buscaproveedor-overlay').fadeOut(remove);
				});
			});
		});
		
		$(this).aplicarEventoKeypressEjecutaTrigger($campo_rfc, $buscar_plugin_proveedor);
		$(this).aplicarEventoKeypressEjecutaTrigger($campo_email, $buscar_plugin_proveedor);
		$(this).aplicarEventoKeypressEjecutaTrigger($campo_nombre, $buscar_plugin_proveedor);
		
		$cancelar_plugin_busca_proveedor.click(function(event){
			//event.preventDefault();
			var remove = function() { $(this).remove(); };
			$('#forma-buscaproveedor-overlay').fadeOut(remove);
		});
	}//termina buscador de proveedores
	
	
	
    $buscar_proveedor.click(function(event){
        //alert("aqui ando");
        event.preventDefault();
        $busca_proveedores();//llamada a la funcion que busca proveedores
    });
    
    
	
//	//genera pdf del reporte de estados de cuenta de proveedores
	$genera_PDF.click(function(event){
		event.preventDefault();
		var proveedor = '0';
		if($razon_proveedor.val().trim()!=''){
			proveedor=$razon_proveedor.val();
		}
		
		var cadena = $select_tipo_reporte.val()+"___"+$select_ano.val()+"___"+$select_mes.val()+"___"+proveedor;
		
		//var id_proveedor=$id_proveedor_edo_cta.val();
		
		var iu = $('#lienzo_recalculable').find('input[name=iu]').val();
		var input_json = config.getUrlForGetAndPost() + '/getPdfSaldoMensual/'+cadena+'/'+iu+'/out.json'
		window.location.href=input_json;
		
	});//termina llamada json
	
	
	
	$busqueda_reporte.click(function(event){
		event.preventDefault();
		$div_reporte_estados_de_cuenta.children().remove();
			
			var arreglo_parametros = {	
										tipo_reporte: $select_tipo_reporte.val(),
										proveedor: $razon_proveedor.val(),
										anio_corte: $select_ano.val(),
										mes_corte: $select_mes.val(),
										iu:config.getUi()
									};
			
			var restful_json_service = config.getUrlForGetAndPost() + '/getReporteSaldos.json'
			var proveedoor="";
			$.post(restful_json_service,arreglo_parametros,function(entry){
				var body_tabla = entry['Facturas'];
				var header_tabla = {
					serie_folio			:'Factura',
					fecha_facturacion	:'Fecha',
					orden_compra		:'O. Compra',
					moneda_total		:'',
					monto_total			:'Monto Facturado',
					moneda_pagado		:'',
					importe_pagado  	:'Monto Pagado',
					ultimo_pago    		:'Ultimo Pago',
					moneda_saldo    	:'',
					saldo_factura    	:'Saldo Pendiente'
				};
				
				var html_reporte = '<table id="edocta">';
				var html_fila_vacia='';
				var html_footer = '';
				
				html_reporte +='<thead> <tr>';
				for(var key in header_tabla){
					var attrValue = header_tabla[key];
					if(attrValue == "Factura"){
						html_reporte +='<td width="100px" align="left">'+attrValue+'</td>'; 
					}
					
					if(attrValue == "Fecha"){
						html_reporte +='<td width="90px" align="center">'+attrValue+'</td>'; 
					}
					
					if(attrValue == "O. Compra"){
						html_reporte +='<td width="120px" align="left">'+attrValue+'</td>'; 
					}
					
					if(attrValue == ''){
						html_reporte +='<td width="10px" align="right" >'+attrValue+'</td>'; 
					}
					
					if(attrValue == "Monto Facturado"){
						html_reporte +='<td width="130px" align="left" id="monto">'+attrValue+'</td>'; 
					}
					
					if(attrValue == "Monto Pagado"){
						html_reporte +='<td width="100px" align="left" id="monto">'+attrValue+'</td>'; 
					}
					
					if(attrValue == "Ultimo Pago"){
						html_reporte +='<td width="90px" align="center">'+attrValue+'</td>'; 
					}
					
					if(attrValue == "Saldo Pendiente"){
						html_reporte +='<td width="120px" align="left" id="monto">'+attrValue+'</td>'; 
					}

				}
				html_reporte +='</tr> </thead>';
				
				html_fila_vacia +='<tr>';
				html_fila_vacia +='<td align="left"  id="sin_borde" height="10"></td>';
				html_fila_vacia +='<td align="left"  id="sin_borde"></td>';
				html_fila_vacia +='<td align="right" id="sin_borde"></td>';
				html_fila_vacia +='<td align="right" id="sin_borde"></td>';
				html_fila_vacia +='<td align="right" id="sin_borde"></td>';
				html_fila_vacia +='<td align="right" id="sin_borde"></td>';
				html_fila_vacia +='<td align="right" id="sin_borde"></td>';
				html_fila_vacia +='<td align="left"  id="sin_borde"></td>';
				html_fila_vacia +='<td align="right" id="sin_borde"></td>';
				html_fila_vacia +='<td align="right" id="sin_borde"></td>';
				html_fila_vacia +='</tr>';
				
				var orden_compra="";
				var simbolo_moneda="";
				var proveedor_actual="";
				
                //inicializar variables
                var suma_monto_total_proveedor=0.0;
                var suma_importe_pagado_proveedor=0.0;
                var suma_saldo_pendiente_proveedor=0.0;
                
                var simbolo_moneda_pesos="";
                var suma_monto_total_moneda_pesos=0.0;
                var suma_importe_pagado_moneda_pesos=0.0;
                var suma_saldo_pendiente_moneda_pesos=0.0;
				
				var simbolo_moneda_dolar="";
                var suma_monto_total_moneda_dolar=0.0;
                var suma_importe_pagado_moneda_dolar=0.0;
                var suma_saldo_pendiente_moneda_dolar=0.0;
                
                var simbolo_moneda_euro="";
                var suma_monto_total_moneda_euro=0.0;
                var suma_importe_pagado_moneda_euro=0.0;
                var suma_saldo_pendiente_moneda_euro=0.0;
				
				if(parseInt(body_tabla.length)>0){
					proveedor_actual=body_tabla[0]["proveedor"];
					simbolo_moneda=body_tabla[0]["moneda_simbolo"];
					
					html_reporte +='<tr id="tr_totales" class="first"><td align="left" colspan="12">'+proveedor_actual+'</td></tr>';
					
					for(var i=0; i<body_tabla.length; i++){
						if(body_tabla[i]["orden_compra"]==null){
							orden_compra="";
						}else{
							orden_compra=body_tabla[i]["orden_compra"];
						}
						
						if(proveedor_actual==body_tabla[i]["proveedor"] && simbolo_moneda==body_tabla[i]["moneda_simbolo"]){
							html_reporte +='<tr>';
							html_reporte +='<td align="left" >'+body_tabla[i]["serie_folio"]+'</td>';
							html_reporte +='<td align="center" >'+body_tabla[i]["fecha_facturacion"]+'</td>';
							html_reporte +='<td align="left" >'+orden_compra+'</td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(body_tabla[i]["monto_total"]).toFixed(2))+'</td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(body_tabla[i]["importe_pagado"]).toFixed(2))+'</td>';
							html_reporte +='<td align="center" >'+body_tabla[i]["ultimo_pago"]+'</td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(body_tabla[i]["saldo_factura"]).toFixed(2))+'</td>';
							html_reporte +='</tr>';
							
							suma_monto_total_proveedor=parseFloat(suma_monto_total_proveedor) + parseFloat(body_tabla[i]["monto_total"]);
							suma_importe_pagado_proveedor=parseFloat(suma_importe_pagado_proveedor) + parseFloat(body_tabla[i]["importe_pagado"]);
							suma_saldo_pendiente_proveedor=parseFloat(suma_saldo_pendiente_proveedor) + parseFloat(body_tabla[i]["saldo_factura"]);
							
							//pesos
							if(parseInt(body_tabla[i]["moneda_id"])==1){
								suma_monto_total_moneda_pesos=parseFloat(suma_monto_total_moneda_pesos) + parseFloat(body_tabla[i]["monto_total"]);
								suma_importe_pagado_moneda_pesos=parseFloat(suma_importe_pagado_moneda_pesos) + parseFloat(body_tabla[i]["importe_pagado"]);
								suma_saldo_pendiente_moneda_pesos=parseFloat(suma_saldo_pendiente_moneda_pesos) + parseFloat(body_tabla[i]["saldo_factura"]);
								simbolo_moneda_pesos=body_tabla[i]["moneda_simbolo"];
							}
							
							//dolares
							if(parseInt(body_tabla[i]["moneda_id"])==2){
								suma_monto_total_moneda_dolar=parseFloat(suma_monto_total_moneda_dolar) + parseFloat(body_tabla[i]["monto_total"]);
								suma_importe_pagado_moneda_dolar=parseFloat(suma_importe_pagado_moneda_dolar) + parseFloat(body_tabla[i]["importe_pagado"]);
								suma_saldo_pendiente_moneda_dolar=parseFloat(suma_saldo_pendiente_moneda_dolar) + parseFloat(body_tabla[i]["saldo_factura"]);
								simbolo_moneda_dolar=body_tabla[i]["moneda_simbolo"];
							}
							
							//euros
							if(parseInt(body_tabla[i]["moneda_id"])==3){
								suma_monto_total_moneda_euro=parseFloat(suma_monto_total_moneda_euro) + parseFloat(body_tabla[i]["monto_total"]);
								suma_importe_pagado_moneda_euro=parseFloat(suma_importe_pagado_moneda_euro) + parseFloat(body_tabla[i]["importe_pagado"]);
								suma_saldo_pendiente_moneda_euro=parseFloat(suma_saldo_pendiente_moneda_euro) + parseFloat(body_tabla[i]["saldo_factura"]);
								simbolo_moneda_euro=body_tabla[i]["moneda_simbolo"];
							}
						}else{
							//imprimir totales
							html_reporte +='<tr id="tr_totales">';
							html_reporte +='<td align="left" id="sin_borde_derecho"></td>';
							html_reporte +='<td align="left" id="sin_borde"></td>';
							html_reporte +='<td align="right" id="sin_borde">Total Proveedor</td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_monto_total_proveedor).toFixed(2))+'</td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_importe_pagado_proveedor).toFixed(2))+'</td>';
							html_reporte +='<td align="left" ></td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_saldo_pendiente_proveedor).toFixed(2))+'</td>';
							html_reporte +='</tr>';
							
							//fila vacia
							html_reporte +=html_fila_vacia;
							
							//reinicializar varibles
							suma_monto_total_proveedor=0.0;
							suma_importe_pagado_proveedor=0.0;
							suma_saldo_pendiente_proveedor=0.0;
							
							//tomar razon social de nuevo prov
							proveedor_actual=body_tabla[i]["proveedor"];
							simbolo_moneda=body_tabla[i]["moneda_simbolo"]
							
							html_reporte +='<tr id="tr_totales"><td align="left" colspan="12">'+proveedor_actual+'</td></tr>';
							//crear primer registro del nuevo prov
							html_reporte +='<tr>';
							html_reporte +='<td align="left" >'+body_tabla[i]["serie_folio"]+'</td>';
							html_reporte +='<td align="center" >'+body_tabla[i]["fecha_facturacion"]+'</td>';
							html_reporte +='<td align="left" >'+orden_compra+'</td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(body_tabla[i]["monto_total"]).toFixed(2))+'</td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(body_tabla[i]["importe_pagado"]).toFixed(2))+'</td>';
							html_reporte +='<td align="center" >'+body_tabla[i]["ultimo_pago"]+'</td>';
							html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
							html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(body_tabla[i]["saldo_factura"]).toFixed(2))+'</td>';
							html_reporte +='</tr>';
							
							//sumar montos del nuevo prov
							suma_monto_total_proveedor=parseFloat(suma_monto_total_proveedor) + parseFloat(body_tabla[i]["monto_total"]);
							suma_importe_pagado_proveedor=parseFloat(suma_importe_pagado_proveedor) + parseFloat(body_tabla[i]["importe_pagado"]);
							suma_saldo_pendiente_proveedor=parseFloat(suma_saldo_pendiente_proveedor) + parseFloat(body_tabla[i]["saldo_factura"]);
							
							//pesos
							if(parseInt(body_tabla[i]["moneda_id"])==1){
								suma_monto_total_moneda_pesos=parseFloat(suma_monto_total_moneda_pesos) + parseFloat(body_tabla[i]["monto_total"]);
								suma_importe_pagado_moneda_pesos=parseFloat(suma_importe_pagado_moneda_pesos) + parseFloat(body_tabla[i]["importe_pagado"]);
								suma_saldo_pendiente_moneda_pesos=parseFloat(suma_saldo_pendiente_moneda_pesos) + parseFloat(body_tabla[i]["saldo_factura"]);
								simbolo_moneda_pesos=body_tabla[i]["moneda_simbolo"];
							}
							
							//dolares
							if(parseInt(body_tabla[i]["moneda_id"])==2){
								suma_monto_total_moneda_dolar=parseFloat(suma_monto_total_moneda_dolar) + parseFloat(body_tabla[i]["monto_total"]);
								suma_importe_pagado_moneda_dolar=parseFloat(suma_importe_pagado_moneda_dolar) + parseFloat(body_tabla[i]["importe_pagado"]);
								suma_saldo_pendiente_moneda_dolar=parseFloat(suma_saldo_pendiente_moneda_dolar) + parseFloat(body_tabla[i]["saldo_factura"]);
								simbolo_moneda_dolar=body_tabla[i]["moneda_simbolo"];
							}
							
							//euros
							if(parseInt(body_tabla[i]["moneda_id"])==3){
								suma_monto_total_moneda_euro=parseFloat(suma_monto_total_moneda_euro) + parseFloat(body_tabla[i]["monto_total"]);
								suma_importe_pagado_moneda_euro=parseFloat(suma_importe_pagado_moneda_euro) + parseFloat(body_tabla[i]["importe_pagado"]);
								suma_saldo_pendiente_moneda_euro=parseFloat(suma_saldo_pendiente_moneda_euro) + parseFloat(body_tabla[i]["saldo_factura"]);
								simbolo_moneda_euro=body_tabla[i]["moneda_simbolo"];
							}

						}
					}
					//imprimir total del ultimo prov
					html_reporte +='<tr id="tr_totales">';
					html_reporte +='<td align="left" id="sin_borde_derecho"></td>';
					html_reporte +='<td align="left" id="sin_borde"></td>';
					html_reporte +='<td align="right" id="sin_borde">Total Proveedor</td>';
					html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
					html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_monto_total_proveedor).toFixed(2))+'</td>';
					html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
					html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_importe_pagado_proveedor).toFixed(2))+'</td>';
					html_reporte +='<td align="left" ></td>';
					html_reporte +='<td align="right" id="simbolo_moneda">'+simbolo_moneda+'</td>';
					html_reporte +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_saldo_pendiente_proveedor).toFixed(2))+'</td>';
					html_reporte +='</tr>';
					
					
					//imprimir totales de la moneda PESOS
					html_footer +='<tr id="tr_totales">';
					html_footer +='<td align="left" id="sin_borde_derecho"></td>';
					html_footer +='<td align="left" id="sin_borde"></td>';
					html_footer +='<td align="right" id="sin_borde">Total MN</td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_pesos+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_monto_total_moneda_pesos).toFixed(2))+'</td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_pesos+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_importe_pagado_moneda_pesos).toFixed(2))+'</td>';
					html_footer +='<td align="left" ></td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_pesos+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_saldo_pendiente_moneda_pesos).toFixed(2))+'</td>';
					html_footer +='</tr>';
					
					
					//imprimir totales de la moneda DOLARES
					html_footer +='<tr id="tr_totales">';
					html_footer +='<td align="left" id="sin_borde_derecho"></td>';
					html_footer +='<td align="left" id="sin_borde"></td>';
					html_footer +='<td align="right" id="sin_borde">Total USD</td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_dolar+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_monto_total_moneda_dolar).toFixed(2))+'</td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_dolar+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_importe_pagado_moneda_dolar).toFixed(2))+'</td>';
					html_footer +='<td align="left" ></td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_dolar+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_saldo_pendiente_moneda_dolar).toFixed(2))+'</td>';
					html_footer +='</tr>';
					
					
					//imprimir totales de la moneda EUROS
					html_footer +='<tr id="tr_totales">';
					html_footer +='<td align="left" id="sin_borde_derecho"></td>';
					html_footer +='<td align="left" id="sin_borde"></td>';
					html_footer +='<td align="right" id="sin_borde">Total EUR</td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_euro+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_monto_total_moneda_euro).toFixed(2))+'</td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_euro+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_importe_pagado_moneda_euro).toFixed(2))+'</td>';
					html_footer +='<td align="left" ></td>';
					html_footer +='<td align="right" id="simbolo_moneda">'+simbolo_moneda_euro+'</td>';
					html_footer +='<td align="right" id="monto">'+$(this).agregar_comas(parseFloat(suma_saldo_pendiente_moneda_euro).toFixed(2))+'</td>';
					html_footer +='</tr>';
				}
				
				
				html_reporte +='<tfoot>';
					html_reporte += html_footer;
				html_reporte +='</tfoot>';
				
				
				
				html_reporte += '</table>';
				
				
				$div_reporte_estados_de_cuenta.append(html_reporte); 
				var height2 = $('#cuerpo').css('height');
				var alto = parseInt(height2)-300;
				var pix_alto=alto+'px';
				$('#edocta').tableScroll({height:parseInt(pix_alto)});
			});
	});
	
	$(this).aplicarEventoKeypressEjecutaTrigger($select_tipo_reporte, $busqueda_reporte);
	$(this).aplicarEventoKeypressEjecutaTrigger($select_ano, $busqueda_reporte);
	$(this).aplicarEventoKeypressEjecutaTrigger($select_mes, $busqueda_reporte);
	$(this).aplicarEventoKeypressEjecutaTrigger($razon_proveedor, $busqueda_reporte);
	
});   
        
        
        
        
    
