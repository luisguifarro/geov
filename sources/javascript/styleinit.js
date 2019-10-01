
    var map;
    var feature;
    var layerLabels; 
    
            var osmUrl = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            OpenStreetMap_DE = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

            var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
            attr ='Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data {attribution.OpenStreetMap}',
            service = new L.TileLayer(url, {subdomains:"1234",attribution: attr});
        
            var esri = L.esri.basemapLayer('Imagery');
            var layerLabels = L.esri.basemapLayer('Imagery'+ 'Labels');
            var layeresri = L.esri.basemapLayer('ShadedRelief'); 
            var layertopo = L.esri.basemapLayer('Topographic');           

         var osmm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
});

        
        var Esri_DeLorme = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme',
    minZoom: 1,
    maxZoom: 11
});

         var osm = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

         // https: also suppported.
var osmold = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});


var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
  attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

        map = new L.Map('map', { measureControl: true, zoomsliderControl: true, zoomControl: false, layers: [esri,layerLabels], center: new L.LatLng( 14.8649, -85.9466), zoom: 6});
        map.addLayer(esri).fitBounds(map);
        map.addLayer(layerLabels);

        map.options.minZoom = 4;
        map.options.maxZoom = 18;

        var north = L.control({position: "bottomright"});
      north.onAdd = function(map) {
          var div = L.DomUtil.create("div", "");
          div.innerHTML = '<img width="10%" height="10%" src="logo.png">';
          return div;
      }
      north.addTo(map);
      
        var c = new L.Control.Coordinates();
        c.addTo(map);
        function onMapClick(e) {
          c.setCoordinates(e);
        } 
        map.on('mousemove', onMapClick);


        // Se agrega el control Escala.
        //L.control.scale().addTo(map);

        //L.Control.measureControl().addTo(map);

        //Plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls
        var miniMap = new L.Control.MiniMap(Hydda_Full, { toggleDisplay: true, position: 'bottomleft' }).addTo(map);

        var sidebar = L.control.sidebar('sidebarmar', {position: 'right'}).addTo(map);

        setTimeout(function () {
            sidebar.open('home');
        }, 500);


        // control that shows state info on hover
        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        info.update = function (props) {
            this._div.innerHTML = '' +  (props ?
                '<div id="infohija"><center><h4>'+props.tipoelemento+'</h4><h3>' + props.nombre + '</h3></center><hr><center><h4>'+props.titleindicador+'</h4></center><div class="info-box"><span class="info-box-icon '+props.bg+'"><i class="ion ion-android-list"></i></span><div class="info-box-content"><span class="info-box-text">'+props.ano+'</span><span class="info-box-number">'+props.valor+' ('+props.unidades+')</span></div></div>  '
                : '</div>');         
        };

        info.addTo(map);
        
        // Restrict to bounds
        var southWest = new L.LatLng(8.51116, -99.4704);
        var northEast = new L.LatLng(19.06343, -77.97739);
            bounds = new L.LatLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);

        municipios_hn    = L.featureGroup().addTo(map);
        departamentos_hn = L.featureGroup().addTo(map);
        regiones_hn = L.featureGroup();
        wmsLayer1 = L.featureGroup();
        
     
//wfs

      var depgeoJsonPromise = fetch('./departamentos_hnn.json');
      var depSLDPromise = fetch('./departamentos_general.sld'); 

     Promise.all([depgeoJsonPromise, depSLDPromise]).then(function(results) {
         Promise.all([results[0].json(), results[1].text()])
            .then(function(result) {
               var geoJson = result[0];
               var SLDText = result[1];
               addDataToMap_sld(geoJson, SLDText, 'departamentos_hn');
         });
      });

     var geoJsonPromise = fetch('./regiones_hnn.json');
      var SLDPromise = fetch('./regiones_general.sld'); 

     Promise.all([geoJsonPromise, SLDPromise]).then(function(results) {
         Promise.all([results[0].json(), results[1].text()])
            .then(function(result) {
               var geoJson = result[0];
               var SLDText = result[1];
               addDataToMap_sld(geoJson, SLDText, 'regiones_hn');
         });
      });

     function verakml() {
            //value = $('#file').val();      
            var kmlLayer = new L.KML('sources/Geo_58c5ea014de66enkml.kml', {async: true});
            kmlLayer.on("loaded", function(e) { 
                map.fitBounds(e.target.getBounds());
            });            
            map.addLayer(kmlLayer);
        }

//control de capas
     //Creamos un control de capas
      var mapasBase = {        
        "OpenStreetMapOne":osm,
        "OpenStreetMap":osmm,
        "Esri ShadedRelief":layeresri,        
        "OpenStreetMap_DE":OpenStreetMap_DE,        
        "Hydda_Full":Hydda_Full, 
        "Capa WMS": wmsLayer1        
      };
 
      var capas = {        
          "Municipios": municipios_hn,
          "Departamentos": departamentos_hn,
          "Regiones": regiones_hn                   
      };
 
      layersControl = new L.Control.Layers(mapasBase, capas, {position: 'topleft'});
      map.addControl(layersControl);

      var dialog = L.control.dialog();
      var contents = ["<div id='leyendaresultado'></div>"].join('');
      dialog.setContent(contents);
      dialog.addTo(map);
      dialog.close();

       L.easyPrint().addTo(map);

      