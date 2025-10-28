// Initialize the map centered on Luxembourg
const luxembourgBounds = L.latLngBounds(
    [49.4, 5.7],  // Southwest corner
    [50.2, 6.6]   // Northeast corner
);

const map = L.map('map', {
    minZoom: 8,
    maxZoom: 12,
    maxBounds: luxembourgBounds,
}).setView([49.6, 6.1], 10);

// Predefined markers for each option
const markers = {};

let selection = {'gender': 'Total', 'age': '60 years or over'};

let geojsonLayer;
let geojsonData;
let popRatioData;

async function fetchArray(filename) {
    try {
        const response = await fetch(filename);
        const csvData = await response.text();
        
        // Split into lines and remove empty lines
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
            throw new Error('CSV file is empty');
        }
        
		function removeQuotes(str) {
			return str.replace(/^['"`]|['"`]$/g, '');
		}

        // Extract headers
        const headers = lines[0].split(';').map(header => removeQuotes(header.trim()));
        
        // Create array of result objects
        const results = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(';').map(value => removeQuotes(value.trim()));
            const result = {};
            
            headers.forEach((header, index) => {
                result[header] = removeQuotes(values[index] || '');
            });
            
			
            results.push(result);
        }
        
        return results;
        
    } catch (error) {
        console.error('Error reading CSV file:', error.message);
        return [];
    }
}

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
const hebergementIcon = L.icon({
    iconUrl: 'icons/icon_1_accommodation.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const logementEncadreIcon = L.icon({
    iconUrl: 'icons/icon_2_supervised.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const centreJourIcon = L.icon({
    iconUrl: 'icons/icon_3_daycentre.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const aktivPlusIcon = L.icon({
    iconUrl: 'icons/icon_4_aktivplus.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const telealarmIcon = L.icon({
    iconUrl: 'icons/icon_7_telealarm.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const activitiesIcon = L.icon({
    iconUrl: 'icons/icon_8_activities.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});

fetchArray('assets/pharmacies_latlon.csv').then(pharmacies => {
    console.log('Pharmacies array:', pharmacies);
    console.log(`Total pharmacies: ${pharmacies.length}`);
	pharm_markers = [];
	pharmacies.forEach(pharmacy => {
		pharm_markers.push(L.marker([pharmacy['lat'], pharmacy['lon']]).bindPopup(pharmacy['name']).setIcon(pharmacyIcon));
	});
	markers['pharmacies'] = pharm_markers;
	//pharm_markers.forEach(marker => marker.addTo(map)); //the pharmacy markers should not be selected by default
});

fetchArray('assets/hospitals_latlon.csv').then(hospitals => {
    hospital_markers = [];
	hospitals.forEach(hospital => {
		hospital_markers.push(L.marker([hospital['lat'], hospital['lon']]).bindPopup(hospital['name']).setIcon(hospitalIcon));
	});
	markers['hospitals'] = hospital_markers;
});

fetchArray('assets/hebergements_latlon.csv').then(hebergements => {
    heb_markers = [];
	hebergements.forEach(hebergement => {
		heb_markers.push(L.marker([hebergement['lat'], hebergement['lon']]).bindPopup(hebergement['name']).setIcon(hebergementIcon));
	});
	markers['hebergements'] = heb_markers;
});

fetchArray('assets/centresJour_latlon.csv').then(centresJour => {
    jour_markers = [];
	centresJour.forEach(centreJour => {
		jour_markers.push(L.marker([centreJour['lat'], centreJour['lon']]).bindPopup(centreJour['Nom']).setIcon(centreJourIcon));
	});
	markers['centresJour'] = jour_markers;
});

fetchArray('assets/aktivPlus_latlon.csv').then(aktivesPlus => {
    aktivPlus_markers = [];
	aktivesPlus.forEach(aktivPlus => {
		aktivPlus_markers.push(L.marker([aktivPlus['lat'], aktivPlus['lon']]).bindPopup(aktivPlus['Nom']).setIcon(aktivPlusIcon));
	});
	markers['aktivesPlus'] = aktivPlus_markers;
});

fetchArray('assets/activities_latlon.csv').then(activities => {
    act_markers = [];
	activities.forEach(activity => {
		act_markers.push(L.marker([activity['lat'], activity['lon']]).bindPopup(activity['Nom']).setIcon(activitiesIcon));
	});
	markers['activities'] = act_markers;
});

fetchArray('assets/alarmes_latlon.csv').then(alarmes => {
    alarm_markers = [];
	alarmes.forEach(alarm => {
		alarm_markers.push(L.marker([alarm['lat'], alarm['lon']]).bindPopup(alarm['Nom']).setIcon(telealarmIcon));
	});
	markers['alarmes'] = alarm_markers;
});

fetchArray('assets/logementsEncadres_latlon.csv').then(logementsEncadres => {
    log_markers = [];
	logementsEncadres.forEach(logementEncadre => {
		log_markers.push(L.marker([logementEncadre['lat'], logementEncadre['lon']]).bindPopup(logementEncadre['Nom']).setIcon(logementEncadreIcon));
	});
	markers['logementsEncadres'] = log_markers;
});

//updateMarkerIcons(markers.hospitals, hospitalIcon);

 
fetchArray('assets/population_statec.csv').then(pop_ratios => {popRatioData = pop_ratios});

// Add OpenStreetMap tile layer
// Minimal positron style
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 10,
    minZoom: 8
}).addTo(map);

function getColorByValue(ratio) {
  // White: #FFFFFF, Red: #FF0000
  const g = Math.floor(255 * (1 - ratio)).toString(16).padStart(2, '0');
  return `#ff${g}${g}`;
}

// Style function for GeoJSON features
function style(id_to_index, feature, min, max) {
	fillColor = '#888888';
	if (id_to_index && feature) {		
		//console.log(feature.properties['LAU2']);
		id = parseInt(feature.properties['LAU2']);
		index = id_to_index[id]
		//console.log(id, index)
		if (!isNaN(index)) {
			//console.log(getColorByValue((index-min)*1.0/(max-min)), min, max);
			fillColor = getColorByValue((index-min)*1.0/(max-min));
		};
	}; 
	return {
			color: '#3388ff', //'#3388ff'
			weight: 2,
			fillOpacity: 0.5,
			fillColor: fillColor
		};
}

// Hover effect
function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#ff7800', //'#ff7800'
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
//Object.values(markers).flat().forEach(marker => marker.addTo(map));

// Checkbox event listeners
document.getElementById('mark_hebergement').addEventListener('change', function(e) {
    markers.hebergements.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

document.getElementById('mark_logementEncadre').addEventListener('change', function(e) {
    markers.logementsEncadres.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});
document.getElementById('mark_centreJour').addEventListener('change', function(e) {
    markers.centresJour.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});
document.getElementById('mark_aktivPlus').addEventListener('change', function(e) {
    markers.aktivesPlus.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});
document.getElementById('mark_activities').addEventListener('change', function(e) {
    markers.activities.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});
document.getElementById('mark_alarme').addEventListener('change', function(e) {
    markers.alarmes.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

document.getElementById('mark_hospitals').addEventListener('change', function(e) {
    markers.hospitals.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

//document.getElementById('radio_gender').checked = true;

document.getElementById('mark_pharmacies').addEventListener('change', function(e) {
    markers.pharmacies.forEach(marker => {
        if (e.target.checked) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

// Function to update the visualization with a different property
function updateVisualization(propertyName, propertyValue) {
    if (!geojsonData) return;
	if (!popRatioData) return;
   
    
    selection[propertyName]= propertyValue;
   
    // Remove existing layer
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }
   
    
// Calculate min and max values from your data
	//function getFilteredMinMax(selection, data, propertyName) {
    let min = Infinity;
    let max = -Infinity;
	id_to_index = {};
	
	popRatioData.forEach(pop_data => {
		const value = parseFloat(pop_data['ratio']);
		if (selection['gender'].toLowerCase() == pop_data['sex'].toLowerCase() &&
			selection['age'].toLowerCase()== pop_data['age_class'].toLowerCase() && 
			!isNaN(pop_data['ratio'])) {
			min = Math.min(min, value);
			max = Math.max(max, value);
			id_to_index[parseInt(pop_data['geo_id'])]=value;
		}
	});
   
    console.log(min, max, id_to_index);
    // Add new layer with updated colors
    geojsonLayer = L.geoJSON(geojsonData, {
        style: (feature) => style(id_to_index, feature, min, max),
        onEachFeature: onEachFeature
    }).addTo(map);
   
   /*
    // Update legend
    map.eachLayer(layer => {
        if (layer instanceof L.Control && layer.getContainer().className.includes('legend')) {
            map.removeControl(layer);
        }
    });
    //addLegend(minMax, propertyName);*/
};
 
// Add event listeners to all radio buttons
document.querySelectorAll('input[name="radio_gender"]').forEach(radio => {
  radio.addEventListener('change', function(e) 
  {updateVisualization('gender', e.target.value)});
});

// Load and display the GeoJSON file
fetch('assets/LIMADM_COMMUNES.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load GeoJSON file');
        }
        return response.json();
    })
    .then(data => {
		geojsonData = data;
        // Add GeoJSON layer to map
        geojsonLayer = L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
        
        // Fit map bounds to show all features
        //map.fitBounds(geojsonLayer.getBounds());

        const bounds = geojsonLayer.getBounds();
        map.setMaxBounds(bounds.pad(0.1)); // pad adds 10% buffer
        map.fitBounds(bounds);
        map.minZoom = 8;
        map.maxZoom = 10;

        updateVisualization('gender', 'Total')
        console.log('GeoJSON loaded successfully');
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error);
        alert('Error loading communes data. Please check that assets/communes.json exists.');
    });