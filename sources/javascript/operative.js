
function showtables() {//tablas y graficos
    ano =  document.formmap.ano.value;// code unique
    sidebar.open('indi');
    map_todatabase('robots/itg_inputarticulo.php?param='+ano+'&accion=mostrartablas'); // enviamos consulta    
}

function addDataToMap_mac(data, map, tipo) {
    
    var geojson = L.geoJson(data, {
       style: style,
        onEachFeature: function(feature, layer) {
            var popupText = "<center><h3>"+feature.properties.tipoelemento+"</h3><h3>"+feature.properties.nombre+"</h2></center><hr>"
                + '<center><h3>'+feature.properties.titleindicador+'</h3></center><div class="info-box"><span class="info-box-icon '+feature.properties.bg+' "><i class="ion ion-clipboard"></i></span><div class="info-box-content"><span class="info-box-text">'+feature.properties.ano+'</span><span class="info-box-number">'+feature.properties.valor+'</span></div></div>'
                + '<form name="formmap"><input id="ano" name="ano" type="hidden" value="'+feature.properties.ano+'"><input id="departamento" name="departamento" type="hidden" value="'+tipo+'"><input id="codep" name="codep" class="form-control" placeholder="" type="hidden" value="'+feature.properties.cod+'"></form><button onclick="getmunicipios_gest('+feature.properties.ano+',\''+tipo+'\', '+feature.properties.id_indicador+', \''+feature.properties.cod+'\');" id="singlebutton" name="singlebutton" class="btn btn-success btn-xs">Ver Municipios</button><button onclick="showtables();" id="singlebutton" name="singlebutton" class="btn btn-primary btn-xs">Ver Tablas y Gráficos</button>'
                + '<span onclick="showindicadores();" class="label label-warning">Ver Listado General de Indicadores</span>';
            layer.bindPopup(popupText);
            layer.on({
                mouseover: highlightFeature,
                mouseout: highlightFeatureReset,
                click: zoomToFeature
            });
            vera(feature.properties.nombre);
        }
    });
    //var  = L.geoJson(data).addTo(map);

    if (tipo==='municipios_hn') { municipios_hn.addLayer(geojson); }else if (tipo==='departamentos_hn'){ departamentos_hn.addLayer(geojson);}else{ regiones_hn.addLayer(geojson); } ;
}


function addDataToMap_macmunis(data, map, tipo) {
    
    var geojson = L.geoJson(data, {
       style: style,
        onEachFeature: function(feature, layer) {

            
                var popupText = "<center><h3>"+feature.properties.tipoelemento+"</h3><h3>"+feature.properties.nombre+"</h2></center><hr>"
                + '<center><h3>'+feature.properties.titleindicador+'</h3></center><div class="info-box"><span class="info-box-icon '+feature.properties.bg+' "><i class="ion ion-clipboard"></i></span><div class="info-box-content"><span class="info-box-text">'+feature.properties.ano+'</span><span class="info-box-number">'+feature.properties.valor+'</span></div></div>'
                + '<span onclick="backdep();" class="label label-danger">Ir a Departamentos</span>'
                + '<span onclick="backrep();" class="label label-danger">Ir a Regiones</span>';
            

            

            layer.bindPopup(popupText);
            layer.on({
                mouseover: highlightFeature,
                mouseout: highlightFeatureReset,
                click: zoomToFeature
            });
        }
    });
    //var  = L.geoJson(data).addTo(map);

    if (tipo==='municipios_hn') { municipios_hn.addLayer(geojson); }else if (tipo==='departamentos_hn'){ departamentos_hn.addLayer(geojson);}else{ regiones_hn.addLayer(geojson); } ;
}

//////SLD
function addDataToMap_sld(geoJson, SLDText, tipo) {

    var SLDStyler = new L.SLDStyler(SLDText);
    //alert(SLDText);
    var geojsonLayer = L.geoJson(geoJson, {
            style: SLDStyler.getStyleFunction(),
        onEachFeature: function(feature, layer) {
            if (tipo==='regiones_hn') { 
                var popupText = "<h2>"+feature.properties.nombre+"</h2><hr>"
                + '';             
            }else{ 
                var popupText = "<h2>"+feature.properties.nombre+"</h2><hr>"
                + ''                
                + '';
             };
            
            layer.bindPopup(popupText);
            layer.on({
               // mouseover: highlightFeature,
               // mouseout: highlightFeatureReset,
                click: zoomToFeature,
                //dblclick:indicador
            });
        }
    });

    if (tipo==='regiones_hn') { regiones_hn.addLayer(geojsonLayer); }else{ departamentos_hn.addLayer(geojsonLayer);};

}

///////////////////////// STYLE AND BEHAVIOR ////////////////////////////////////////////////////////////////////////

function highlightFeature(e) {//mouse over
            var layer = e.target;

            layer.setStyle({
                weight: 7,
                color: '#FC4E2A',
                dashArray: '',
                fillOpacity: 0.3
            });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
            //layer.openPopup();
            info.update(layer.feature.properties);
}

        function highlightFeatureReset(e) { //mouse mouseout
            var layer = e.target;

            layer.setStyle({
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.8
            });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
            //layer.closePopup();
            info.update();

        }


        // get color depending on population density value
        function getColor(d) {
            return d > 1000 ? '#800026' :
                   d > 500  ? '#BD0026' :
                   d > 200  ? '#E31A1C' :
                   d > 100  ? '#FC4E2A' :
                   d > 50   ? '#FD8D3C' :
                   d > 20   ? '#FEB24C' :
                   d > 10   ? '#FED976' :
                              '#FD8D3C';
        }

        function style(feature) {
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.8,
                fillColor: feature.properties.density,
            };
        }


      function resetHighlight(e) {
             var layer = e.target;
              
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
            sidebar.close('indi');
        }

        function get_indicador(str) {            
            map_todatabase('robots/itg_inputarticulo.php?param='+str+'&accion=getindicador');            
        }

        function showindicadores(tipo){
            tipocapa   = document.formmap.departamento.value;
            sidebar.open('indi');
            map_todatabase('robots/itg_inputarticulo.php?param='+tipocapa+'&accion=showindicador');               
        }

        
        function departamentos_gest(ano,capa,indicador) {
            str = ano+";"+capa+";"+indicador;
            //str = ano+";"+capa+";179";            
            map_todatabase('robots/itg_inputarticulo.php?accion=makechartlinebefore'); // enviamos consulta    

  try {     
            
            $.getJSON("vendor/geonode.php?param="+str+"",{                
                format: "json"
            },function (data) {
                municipios_hn.clearLayers();
                departamentos_hn.clearLayers();
                addDataToMap_mac(data, map, 'departamentos_hn');
            })
            .success(function() { map.fitBounds([[14.51116, -88.4704], [15.06343, -83.97739]]);    })
            .error(function(data) { console.log( "error en WS MAP" ); })
            .complete(function(data) { sidebar.close('indi'); dialog.open(); leyenda_fx('robots/itg_inputarticulo.php?param='+ano+'&accion=makejson');   });// fin function (data) {    
                
                             
  } catch(e) {
    alert('error pero continua con');
    console.log(1);
    return true; // Esta sentencia de retorno es suspendida
                 // hasta que el bloque finally esté completo
    console.log(2); // no alcanzable
    alert('catch--yano');
  } finally {
    console.log(3);
    //alert('este script--');
    return false; // sobreescribe la sentencia de retorno anterior
    console.log(4); // no alcanzable
  }
  // "return false" es ejecutada ahora
  console.log(5); // no alcanz  


        }

        function regiones_gest(ano,capa,indicador) {
            str = ano+";"+capa+";"+indicador;
            //str = ano+";"+capa+";179";            
            map_todatabase('robots/itg_inputarticulo.php?accion=makechartlinebefore'); // enviamos consulta    

  try {     
            
            $.getJSON("vendor/geonode.php?param="+str+"",{                
                format: "json"
            },function (data) {
                municipios_hn.clearLayers();
                regiones_hn.clearLayers();
                addDataToMap_mac(data, map, 'regiones_hn');
            })
            .success(function() { map.fitBounds([[14.51116, -88.4704], [15.06343, -83.97739]]);    })
            .error(function(data) { console.log( "error en WS MAP" ); })
            .complete(function(data) { sidebar.close('indi'); dialog.open(); leyenda_fx('robots/itg_inputarticulo.php?param='+ano+'&accion=makejson');   });// fin function (data) {    
                
                             
  } catch(e) {
    alert('error pero continua con');
    console.log(1);
    return true; // Esta sentencia de retorno es suspendida
                 // hasta que el bloque finally esté completo
    console.log(2); // no alcanzable
    alert('catch--yano');
  } finally {
    console.log(3);
    //alert('este script--');
    return false; // sobreescribe la sentencia de retorno anterior
    console.log(4); // no alcanzable
  }
  // "return false" es ejecutada ahora
  console.log(5); // no alcanz  

        }

        function getmunicipios_gest(ano,capa,indicador,idgeo) {
            str = ano+';'+capa+';'+indicador+';'+idgeo;             
            sidebar.open('indi');
            map_todatabase('robots/itg_inputarticulo.php?accion=makechartlinebefore');
           $.getJSON("vendor/geonodemunis.php?param="+str+" ", function(data){                                
                municipios_hn.clearLayers();
                addDataToMap_macmunis(data, map, 'municipios_hn');
            })
            .success(function() {   })
            .error(function(data) { console.log( "error en WS MAP" ); })
            .complete(function(data) { sidebar.close('indi'); dialog.open(); leyenda_fx('robots/itg_inputarticulo.php?param='+str+'&accion=makejsonmunicipios'); });// fin function (data) {    

            departamentos_hn.setStyle({//set capa one down
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.4
            });
        regiones_hn.setStyle({
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.4
            });//set capa one down


        map.removeLayer(departamentos_hn);
        map.removeLayer(regiones_hn);

        }

        function putwms_redvial(){
            wmsLayer1.clearLayers();
            var wmsLayer11 = L.tileLayer.wms('http://geoportal.icf.gob.hn:8081/geoserver/icf/wms', 
            {
                layers: 't1:m3101vl001970_hn',
                'transparent': true
            }   
        );
        wmsLayer1.addLayer(wmsLayer11);           
        }

        function putwms_redhidrica(){
            wmsLayer1.clearLayers();
            var wmsLayer11 = L.tileLayer.wms('http://geoportal.icf.gob.hn:8081/geoserver/icf/wms', 
            {
                layers: 't1:m2301vl001970_hn',
                'transparent': true
            }   
        );
        wmsLayer1.addLayer(wmsLayer11);           
        }

        function putwms_seq(){
            wmsLayer1.clearLayers();
            var wmsLayer11 = L.tileLayer.wms('http://sinit.hn:8080/geoserver/wms/', 
            {
                layers: 'sinit:n2603rR002009_HN',
                'transparent': true
            }   
        );
        wmsLayer1.addLayer(wmsLayer11);           
        }

        function putwms_hosp(){
            wmsLayer1.clearLayers();
            var wmsLayer11 = L.tileLayer.wms('http://sinit.hn:8080/geoserver/wms/', 
            {
                layers: 'sinit:n3605vP002000_HN',
                'transparent': true
            }   
        );
        wmsLayer1.addLayer(wmsLayer11);           
        }

        function putwms_tempm(){
            wmsLayer1.clearLayers();
            var wmsLayer11 = L.tileLayer.wms('http://sinit.hn:8080/geoserver/wms/', 
            {
                layers: 'sinit:n3601vA002009_HN',
                'transparent': true
            }   
        );
        wmsLayer1.addLayer(wmsLayer11);           
        }

        function get_wms(value) {
          //alert(value);
          if (value==='redvial') { putwms_redvial(); wmsLayer1.bringToFront(); } else{};
          if (value==='redhidrica') {putwms_redhidrica();} else{};
          if (value==='seq') {putwms_seq();} else{};
          if (value==='hosp') {putwms_hosp();} else{};
          if (value==='tempm') {putwms_tempm();} else{};
           
        }


        function showpiramide(str){

            mostrar_piramide('robots/itg_inputarticulo.php?param='+str+'&accion=mostrar_piramide');

        }

        function showcontenido(str){
            sidebar.close('indi');
            mostrar_contenidoindicador('robots/itg_inputarticulo.php?param='+str+'&accion=contenidoindicador');

        }
       

        function backdep(tipo){
            municipios_hn.clearLayers();
            departamentos_hn.addTo(map);
        }

        function backrep(tipo){
            municipios_hn.clearLayers();
            regiones_hn.addTo(map);
        }

        function descargar() {
            // Extract GeoJson from featureGroup
            var data = departamentos_hn.toGeoJSON();

            // Stringify the GeoJson
            var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

            // Create export
            document.getElementById('export').setAttribute('href', 'data:' + data.toGeoJSON);
            document.getElementById('export').setAttribute('download','data.geojson');
        }