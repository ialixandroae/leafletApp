require([
    "dojo/domReady!"
], function () {

    var url = "https://services6.arcgis.com/MLuUQwq7FiARivuF/arcgis/rest/services/Incidente/FeatureServer/0"

    // Selectie blutoane
    var btnCluster = $("#btnCluster");
    var btnHeatMap = $('#btnHeatMap');
    var featureServiceInput = $('.input-group-input');
    // Adaugare text in <input-group-input>
    featureServiceInput.val(featureServiceInput.val() + url);
    // Setare focus la sfarsit <input-group-input>
    featureServiceInput.focus().val(featureServiceInput.val());
    var addServiceBtn = $('#addServiceBtn');

    // Creare obiect harta
    var map = L.map('mainDiv');

    // Creare obiect basemap si adaugare in harta
    L.esri.basemapLayer('DarkGray').addTo(map);

    // Initializare harta 
    startUpMap(map, url);

    // Eveniment buton Adaugare serviciu nou
    addServiceBtn.on('click', () => {
        // Setare focus la sfarsit <input-group-input>
        featureServiceInput.focus().val(featureServiceInput.val());
        // Adaugare serviciu nou in harta pe baza 
        // servicului adaugat in <input-group-input>
        addServiceToMap(map, featureServiceInput.val());
    });

    function startUpMap(map, featureServiceUrl){
        // Creare layer cluster
        var clusterLayer = L.esri.Cluster.featureLayer({
            url: featureServiceUrl
        }).addTo(map);

        clusterLayer.query().bounds(function (error, latlngbounds) {
            map.fitBounds(latlngbounds);
        });

        // Creare layer heatmap
        var heatmapLayer = L.esri.Heat.featureLayer({
            url: featureServiceUrl,
            radius: 30,
            gradient: {
                '0.2': '#ffffb2',
                '0.4': '#fd8d3c',
                '0.6': '#fd8d3c',
                '0.8': '#f03b20',
                '1': '#bd0026'
            }
        });

        // Eveniment click buton cluster
        btnCluster.on("click", () => {
            if (map.hasLayer(heatmapLayer) == true) {
                btnHeatMap.removeClass('active');
                map.removeLayer(heatmapLayer);
                clusterLayer.addTo(map);
            }
        });

        // Eveniment click buton heatmap
        btnHeatMap.on('click', () => {
            if (map.hasLayer(clusterLayer) == true) {
                btnCluster.removeClass('active');
                map.removeLayer(clusterLayer);
                heatmapLayer.addTo(map);
            }
        });
    }
    
    // Functie adaugare layer nou in harta
    function addServiceToMap(map, newServiceUrl) {
        var index = 0
        map.eachLayer(function (layer) {
            if (index > 0){
                map.removeLayer(layer);
            }
            index++;
        });
        startUpMap(map, newServiceUrl);
    }
});