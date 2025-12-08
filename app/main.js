require(['dojo/domReady!'], function () {
  var url =
    'https://services6.arcgis.com/MLuUQwq7FiARivuF/arcgis/rest/services/Incidente/FeatureServer/0';

  // Selectie blutoane
  var btnCluster = $('#btnCluster');
  var btnHeatMap = $('#btnHeatMap');
  var featureServiceInput = $('.input-group-input');
  // Adaugare text in <input-group-input>
  featureServiceInput.val(featureServiceInput.val() + url);
  // Setare focus la sfarsit <input-group-input>
  featureServiceInput.focus().val(featureServiceInput.val());
  var addServiceBtn = $('#addServiceBtn');

  // Creare obiect harta

  const accessToken =
    'AAPTxy8BH1VEsoebNVZXo8HurFLeIkfyPzGMTuhTfG3fTYoqon4_UtF_J1GyxKbYdD3YpbRVa-VuGyzo9WCbAuS7irfOZAZRMlRYIHuMHZrhjTLOwX8Ox0x0S_-pxiCqKDHTOd4mhkFQzFxzeANK-xEHi6YBsecwnoyLYdZeMT6t4UVFOjiLwfXYo4UiRwBGXHXSS9SG8ex2cUabOXkBuc4HJVnM6YkD8N-UBatUF9YbBd0.AT1_XUbl024p';
  const basemapEnum = 'arcgis/outdoor'; // arcgis/navigation, arcgis/imagery, open/osm-style, etc.

  const map = L.map('mainDiv', {
    minZoom: 2,
    maxZoom: 10,
  }).setView([25, -30], 2);

  // Display a style with the Esri Leaflet plugin
  L.esri.Vector.vectorBasemapLayer(basemapEnum, {
    token: accessToken,
  }).addTo(map);

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

  function startUpMap(map, featureServiceUrl) {
    // Creare layer cluster
    var clusterLayer = L.esri.Cluster.featureLayer({
      url: featureServiceUrl,
    }).addTo(map);

    clusterLayer.query().bounds(function (error, latlngbounds) {
      map.fitBounds(latlngbounds);
    });

    // Creare layer heatmap
    var heatmapLayer = L.esri.Heat.featureLayer({
      url: featureServiceUrl,
      radius: 30,
      gradient: {
        0.2: '#ffffb2',
        0.4: '#fd8d3c',
        0.6: '#fd8d3c',
        0.8: '#f03b20',
        1: '#bd0026',
      },
    });

    // Eveniment click buton cluster
    btnCluster.on('click', () => {
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
    var index = 0;
    map.eachLayer(function (layer) {
      if (index > 0) {
        map.removeLayer(layer);
      }
      index++;
    });
    startUpMap(map, newServiceUrl);
  }
});
