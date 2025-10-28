// Initialize the map centered on Luxembourg
const map = L.map('map').setView([49.6, 6.1], 10);

// Predefined markers for each option
const markers = {
    hospitals: [
        //L.marker([49.61, 6.13]).bindPopup('Marker 1-1'),
		L.marker([49.618701, 6.101091]).bindPopup('Centre Hospitalier de Luxembourg (CHL)'),
		L.marker([49.853445, 6.09465]).bindPopup('Centre Hospitalier du Nord (CHdN)'),
		L.marker([49.632902, 6.176345]).bindPopup('Hôpital Kirchberg (HRS)'),
		L.marker([49.501616, 5.98207]).bindPopup('Centre Hospitalier Émile Mayrisch (CHEM)'),
		L.marker([49.633, 6.159]).bindPopup('Clinique Bohler (Hôpitaux Robert Schuman Group)'),
		L.marker([49.60389, 6.1289]).bindPopup('ZithaKlinik (Hôpitaux Robert Schuman Group)')

    ],
    pharmacies: [
        L.marker([49.59, 6.11]).bindPopup('Pharmacy 2-1'),
        L.marker([49.60, 6.09]).bindPopup('Pharmacy 2-2')
    ],
    option3: [
        L.marker([49.58, 6.12]).bindPopup('Marker 3-1'),
        L.marker([49.57, 6.14]).bindPopup('Marker 3-2')
    ]
};

function updateMarkerIcons(markerGroup, icon) {
    markerGroup.forEach(marker => {
        marker.setIcon(icon);
    });
}
const hospitalIcon = L.icon({
    iconUrl: 'icons/hospital.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const pharmacyIcon = L.icon({
    iconUrl: 'icons/pharmacy.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
updateMarkerIcons(markers.hospitals, hospitalIcon);
updateMarkerIcons(markers.pharmacies, pharmacyIcon);


// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// age_ratio

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


// Add all markers to map initially
Object.values(markers).flat().forEach(marker => marker.addTo(map));

// Checkbox event listeners
document.getElementById('mark_hospitals').addEventListener('change', function(e) {
    markers.hospitals.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

document.getElementById('mark_pharmacies').addEventListener('change', function(e) {
    markers.pharmacies.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

document.getElementById('mark_activities').addEventListener('change', function(e) {
    markers.option3.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

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
