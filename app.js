// Initialize the map centered on Luxembourg
const map = L.map('map').setView([49.6, 6.1], 10);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// Style function for GeoJSON features
function style(feature) {
    return {
        color: '#3388ff',
        weight: 2,
        fillOpacity: 0.3,
        fillColor: '#3388ff'
    };
}

// Hover effect
function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#ff7800',
        fillOpacity: 0.5
    });
    layer.bringToFront();
}

function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}

// Click handler - display properties in popup
function onEachFeature(feature, layer) {
    // Add hover effects
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
    
    // Add click popup with feature properties
    if (feature.properties) {
        let popupContent = '<div>';
        for (const [key, value] of Object.entries(feature.properties)) {
            popupContent += `<p><strong>${key}:</strong> ${value}</p>`;
        }
        popupContent += '</div>';
        layer.bindPopup(popupContent);
    }
}

// Variable to store the GeoJSON layer
let geojsonLayer;

// Load and display the GeoJSON file
fetch('assets/LIMADM_COMMUNES.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load GeoJSON file');
        }
        return response.json();
    })
    .then(data => {
        // Add GeoJSON layer to map
        geojsonLayer = L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
        
        // Fit map bounds to show all features
        map.fitBounds(geojsonLayer.getBounds());
        
        console.log('GeoJSON loaded successfully');
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error);
        alert('Error loading communes data. Please check that assets/communes.json exists.');
    });
