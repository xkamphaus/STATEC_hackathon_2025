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
let minMaxLegend = [];

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
    iconSize: [30, 30],
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
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const logementEncadreIcon = L.icon({
    iconUrl: 'icons/icon_2_supervised.svg',
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const centreJourIcon = L.icon({
    iconUrl: 'icons/icon_3_daycentre.svg',
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const aktivPlusIcon = L.icon({
    iconUrl: 'icons/icon_4_aktivplus.svg',
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const telealarmIcon = L.icon({
    iconUrl: 'icons/icon_7_telealarm.svg',
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});
const activitiesIcon = L.icon({
    iconUrl: 'icons/icon_8_activities.svg',
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
});

function createPopup(dict) {
  let popupContent = '<div class="custom-popup-content">';
  function initCap(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };
    if (dict) {
		const showFirst = ['Nom', 'nom', 'Name', 'name'];
		const showNever = ['Section', 'Numero', 'Ville', 'Page', 'year', 'LAU2'];
		showFirst.forEach(key => {
			value = dict[key];
			if (value && value.length > 0)
			{
				popupContent += `<p><strong>${initCap(key)}:</strong> ${value}</p>`;
			};
		});
        for (const [key, value] of Object.entries(dict)) {
			if (!value || value.length == 0 ||  ['lat', 'lon'].includes(key) || showFirst.includes(key) || showNever.includes(key)) {} else 
			{
				popupContent += `<p><strong>${initCap(key)}:</strong> ${value}</p>`;
			};
        }
    }
    popupContent += '</div>';
	return popupContent;
}

fetchArray('assets/pharmacies_latlon.csv').then(pharmacies => {
    console.log('Pharmacies array:', pharmacies);
    console.log(`Total pharmacies: ${pharmacies.length}`);
	pharm_markers = [];
	pharmacies.forEach(pharmacy => {
		pharm_markers.push(L.marker([pharmacy['lat'], pharmacy['lon']]).bindPopup(createPopup(pharmacy), {
            autoClose: false,    
            closeOnClick: true
        }).setIcon(pharmacyIcon));
	});
	markers['pharmacies'] = pharm_markers;
	//pharm_markers.forEach(marker => marker.addTo(map)); //the pharmacy markers should not be selected by default
});

fetchArray('assets/hospitals_latlon.csv').then(hospitals => {
    hospital_markers = [];
	hospitals.forEach(hospital => {
		hospital_markers.push(L.marker([hospital['lat'], hospital['lon']]).bindPopup(createPopup(hospital), {
            autoClose: false,    
            closeOnClick: true  
        }).setIcon(hospitalIcon));
	});
	markers['hospitals'] = hospital_markers;
});

fetchArray('assets/hebergements_latlon.csv').then(hebergements => {
    heb_markers = [];
	hebergements.forEach(hebergement => {
		heb_markers.push(L.marker([hebergement['lat'], hebergement['lon']]).bindPopup(createPopup(hebergement), {
            autoClose: false,   
            closeOnClick: true  
        }).setIcon(hebergementIcon));
	});
	markers['hebergements'] = heb_markers;
});

fetchArray('assets/centresJour_latlon.csv').then(centresJour => {
    jour_markers = [];
	centresJour.forEach(centreJour => {
		jour_markers.push(L.marker([centreJour['lat'], centreJour['lon']]).bindPopup(createPopup(centreJour), {
            autoClose: false,     
            closeOnClick: true 
        }).setIcon(centreJourIcon));
	});
	markers['centresJour'] = jour_markers;
});

fetchArray('assets/aktivPlus_latlon.csv').then(aktivesPlus => {
    aktivPlus_markers = [];
	aktivesPlus.forEach(aktivPlus => {
		aktivPlus_markers.push(L.marker([aktivPlus['lat'], aktivPlus['lon']]).bindPopup(createPopup(aktivPlus), {
            autoClose: false,     
            closeOnClick: true   
        }).setIcon(aktivPlusIcon));
	});
	markers['aktivesPlus'] = aktivPlus_markers;
});

fetchArray('assets/activities_latlon.csv').then(activities => {
    act_markers = [];
	activities.forEach(activity => {
		act_markers.push(L.marker([activity['lat'], activity['lon']]).bindPopup(createPopup(activity), {
            autoClose: false,      
            closeOnClick: true    
        }).setIcon(activitiesIcon));
	});
	markers['activities'] = act_markers;
});

fetchArray('assets/alarmes_latlon.csv').then(alarmes => {
    alarm_markers = [];
	alarmes.forEach(alarm => {
		alarm_markers.push(L.marker([alarm['lat'], alarm['lon']]).bindPopup(createPopup(alarm), {
            autoClose: false,      
            closeOnClick: true    
        }).setIcon(telealarmIcon));
	});
	markers['alarmes'] = alarm_markers;
});

fetchArray('assets/logementsEncadres_latlon.csv').then(logementsEncadres => {
    log_markers = [];
	logementsEncadres.forEach(logementEncadre => {
		log_markers.push(L.marker([logementEncadre['lat'], logementEncadre['lon']]).bindPopup(createPopup(logementEncadre), {
            autoClose: false,      
            closeOnClick: true    
        }).setIcon(logementEncadreIcon));
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
  // White: #FFFFFF, Red: #ffd500  #FF0000,   rgb(194,167,0)
  //const g = Math.floor(255 * (1 - ratio)).toString(16).padStart(2, '0');
  //return `#ff${g}${g}`;

  const r = Math.floor(255 - (255 - 223) * ratio);; // Red stays at 255
  const g = Math.floor(255 - (255 - 192) * ratio); // Green goes from 255 to 213
  const b = Math.floor(255 - 255 * ratio); // Blue goes from 255 to 0
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
			color: '#1a1a1a', //'#3388ff'
			weight: 0.5,
			fillOpacity: 1,
			fillColor: fillColor
		};
}

// Hover effect
function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#362eff', //'#2700af', //'#ff7800'
        fillOpacity: 1
    });
    layer.bringToFront();
}

function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
    // Create a custom popup container
    const customPopup = L.popup({
        closeButton: false,
        autoClose: false,
        closeOnEscapeKey: false,
        closeOnClick: false,
        className: 'custom-popup'
    });
    
    // Build popup content from feature properties
    let popupContent = '<div class="custom-popup-content">';
    if (feature.properties) {
        // Get the LAU2 ID to look up population ratio
        const lau2Id = parseInt(feature.properties['LAU2']);
        let ratioValue = 'N/A';
        
        if (popRatioData && !isNaN(lau2Id)) {
            const matchingData = popRatioData.find(pop_data => 
                parseInt(pop_data['geo_id']) === lau2Id &&
                selection['gender'].toLowerCase() === pop_data['sex'].toLowerCase() &&
                selection['age'].toLowerCase() === pop_data['age_class'].toLowerCase()
            );
            
            if (matchingData && matchingData['ratio']) {
                ratioValue = (parseFloat(matchingData['ratio'])).toFixed(2) + '%';
            }
        }
        
        // Add other properties
        for (const [key, value] of Object.entries(feature.properties)) {
            if (key !== 'LAU2') {
                popupContent += `<p><strong>${key}:</strong> ${value}</p>`;
            }
        }
        // Add population ratio
        popupContent += `<p><strong>Population Ratio:</strong> ${ratioValue}</p>`;
        
    }
    popupContent += '</div>';
    customPopup.setContent(popupContent);
    
    // Store reference to the custom popup
    layer.customPopup = customPopup;
    
    // Add hover effects - highlight remains untouched
    layer.on({
        mouseover: function(e) {
            highlightFeature(e); // Your existing highlight function
            
            // Show custom popup in upper left of map container
            if (!this.customPopup.isOpen()) {
                this.customPopup.setLatLng(e.latlng);
                this.customPopup.openOn(map);
                
                // Position in upper left corner of map container
                const popupElement = this.customPopup.getElement();
                if (popupElement) {
                    const mapContainer = map.getContainer();
                    const mapRect = mapContainer.getBoundingClientRect();
                    
                    popupElement.style.position = 'absolute';
                    popupElement.style.top = '10px';
                    popupElement.style.left = '10px';
                    popupElement.style.transform = 'none';
                    popupElement.style.margin = '0';
                    
                    // Ensure popup stays within map bounds
                    const popupRect = popupElement.getBoundingClientRect();
                    const maxLeft = mapRect.width - popupRect.width - 10;
                    const maxTop = mapRect.height - popupRect.height - 10;
                    
                    popupElement.style.left = Math.min(10, maxLeft) + 'px';
                    popupElement.style.top = Math.min(10, maxTop) + 'px';
                }
            }
        },
        mouseout: function(e) {
            resetHighlight(e); // Your existing reset function
            
            // Close the custom popup
            if (this.customPopup.isOpen()) {
                this.customPopup.remove();
            }
        }
    });
    
    // Close popup on zoom
    map.on('zoomstart', function() {
        if (layer.customPopup && layer.customPopup.isOpen()) {
            layer.customPopup.remove();
        }
    });
}

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

['mark_hebergement', 'mark_logementEncadre', 'mark_centreJour', 'mark_aktivPlus', 'mark_activities', 'mark_alarme', 'mark_hospitals', 'mark_pharmacies'].forEach(id => {
	document.getElementById(id).checked = false;
});

document.getElementById('radio_gender_total').checked = true;



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
	minMaxLegend = [min, max];
    // Add new layer with updated colors
    geojsonLayer = L.geoJSON(geojsonData, {
        style: (feature) => style(id_to_index, feature, min, max),
        onEachFeature: onEachFeature
    }).addTo(map);
       
    // UPDATE LEGEND HERE
    const legendMin = document.getElementById('legend-min');
    const legendMax = document.getElementById('legend-max');
    if (legendMin && legendMax) {
        legendMin.textContent = (min).toFixed(1) + '%';
        legendMax.textContent = (max).toFixed(1) + '%';
    }
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
        map.maxZoom = 9;

        updateVisualization('gender', 'Total')
        console.log('GeoJSON loaded successfully');
		
        // CREATE LEGEND HERE - around line 450
        window.legendControl = L.control({position: 'bottomleft'});
        
        window.legendControl.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'legend color-bar-legend');
            div.id = 'legend-container';
            
            const minPercent = (minMaxLegend[0]).toFixed(1);
            const maxPercent = (minMaxLegend[1]).toFixed(1);
            
            div.innerHTML = `
                <h4>Population Ratio</h4>
                <div class="color-bar">
                    <div class="color-gradient"></div>
                    <div class="color-labels">
                        <span id="legend-min">${minPercent}%</span>
                        <span id="legend-max">${maxPercent}%</span>
                    </div>
                </div>
            `;
            return div;
        };
        
        window.legendControl.addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error);
        alert('Error loading communes data. Please check that assets/communes.json exists.');
    });
	