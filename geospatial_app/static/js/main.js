document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([25, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let currentGeoJsonLayer = null;
    const layerSelect = document.getElementById('layer-select');

    function loadLayer(layerName) {
        if (!layerName) {
            console.warn("No layer name provided to loadLayer function.");
            return;
        }

        // Remove previous layer if exists
        if (currentGeoJsonLayer) {
            map.removeLayer(currentGeoJsonLayer);
            currentGeoJsonLayer = null;
        }

        fetch(`/api/data/${layerName}`)
            .then(response => {
                if (!response.ok) {
                    // If layer not found (404), backend returns JSON error
                    if (response.status === 404) {
                        return response.json().then(err => {
                           throw new Error(`Layer "${layerName}" not found: ${err.error}`);
                        });
                    }
                    throw new Error(`Network response was not ok for layer "${layerName}": ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                currentGeoJsonLayer = L.geoJSON(data, {
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.popupContent) {
                            layer.bindPopup(feature.properties.popupContent);
                        } else if (feature.properties) {
                            let popupText = '<pre>' + JSON.stringify(feature.properties, null, 2) + '</pre>';
                            layer.bindPopup(popupText);
                        }
                    }
                }).addTo(map);
            })
            .catch(error => {
                console.error(`Error fetching or displaying GeoJSON data for layer "${layerName}":`, error);
                alert(`Could not load layer: ${layerName}. ${error.message}`);
            });
    }

    // Event listener for layer selection
    layerSelect.addEventListener('change', function () {
        loadLayer(this.value);
    });

    // Load the initial default layer
    if (layerSelect.value) { // ensure there's a default selected value
        loadLayer(layerSelect.value);
    } else {
        console.warn("No default layer selected in the dropdown.");
        // Optionally load a hardcoded default if select is empty e.g. loadLayer('sample_points');
    }

    const downloadButton = document.getElementById('download-button');

    function downloadGeoJson(geoJsonData, filename) {
        if (!geoJsonData) {
            alert("No data available to download.");
            return;
        }
        const jsonString = JSON.stringify(geoJsonData, null, 2); // Pretty print JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadButton.addEventListener('click', function () {
        const selectedLayerName = layerSelect.value;
        if (currentGeoJsonLayer && selectedLayerName) {
            // Ensure currentGeoJsonLayer is not just a layer group but has toGeoJSON method
            if (typeof currentGeoJsonLayer.toGeoJSON === 'function') {
                const geoJsonData = currentGeoJsonLayer.toGeoJSON();
                downloadGeoJson(geoJsonData, selectedLayerName + '.geojson');
            } else {
                alert("Cannot export the current layer to GeoJSON. Data might be empty or in an unexpected format.");
                console.warn("currentGeoJsonLayer does not have toGeoJSON method", currentGeoJsonLayer);
            }
        } else {
            alert("No layer is currently loaded or selected to download.");
        }
    });
});
