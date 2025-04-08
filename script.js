// Globale variabelen
let map;
let markers = [];
let polylines = [];
let activeDay = 'day1';
let directionsService;
let directionsRenderers = {};
let infoWindow;
let activeLocationItem = null;
let markerMapping = {}; // Om markers te koppelen aan locatie-items
let driveTimes = {}; // Om rijtijden tussen locaties op te slaan
let placesService; // Places API service

// Map initialiseren wanneer het document is geladen
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
});

// Google Maps initialiseren
function initMap() {
    // Centrum van Dominica
    const dominicaCenter = { lat: 15.415, lng: -61.371 };
    
    // Map aanmaken
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: dominicaCenter,
        mapTypeId: 'terrain',
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    });
    
    // DirectionsService voor route berekening
    directionsService = new google.maps.DirectionsService();
    
    // PlacesService voor locatie opzoeken
    placesService = new google.maps.places.PlacesService(map);
    
    // InfoWindow voor marker details
    infoWindow = new google.maps.InfoWindow();
    
    // Corrigeer locaties waar nodig
    correctLocations();
    
    // Toon dag 1 standaard
    showDay(activeDay);
}

// Corrigeer locaties met behulp van Places API
function correctLocations() {
    // Lijst met locaties om te corrigeren en hun zoektermen
    const locationsToCorrect = [
        { day: 'day1', name: 'Salton Waterfalls', query: 'Salton Waterfalls Dominica' },
        { day: 'day2', name: 'Trafalgar Falls', query: 'Trafalgar Falls Dominica' },
        { day: 'day2', name: 'Emerald Pool', query: 'Emerald Pool Dominica' },
        { day: 'day3', name: 'Champagne Reef', query: 'Champagne Reef Dominica' },
        { day: 'day4', name: 'Indian River', query: 'Indian River Portsmouth Dominica' }
    ];
    
    // Corrigeer alle locaties in de lijst
    locationsToCorrect.forEach(location => {
        correctLocation(location.day, location.name, location.query);
    });
}

// Corrigeer een specifieke locatie
function correctLocation(day, locationName, query) {
    const request = {
        query: query,
        fields: ['name', 'geometry']
    };
    
    placesService.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            const place = results[0];
            const location = place.geometry.location;
            
            // Update de coördinaten in de reisdata
            if (reisdata[day] && reisdata[day].waypoints) {
                // Zoek de locatie in de waypoints
                const locationIndex = reisdata[day].waypoints.findIndex(point => 
                    point.name.includes(locationName));
                
                if (locationIndex !== -1) {
                    console.log(`${locationName} oorspronkelijke locatie:`, 
                        reisdata[day].waypoints[locationIndex].lat, 
                        reisdata[day].waypoints[locationIndex].lng);
                    
                    // Update de waypoint met de gevonden locatie
                    reisdata[day].waypoints[locationIndex].lat = location.lat();
                    reisdata[day].waypoints[locationIndex].lng = location.lng();
                    
                    console.log(`${locationName} bijgewerkte locatie:`, 
                        location.lat(), location.lng());
                    
                    // Update ook de route array als die bestaat
                    if (reisdata[day].route) {
                        const routeIndex = reisdata[day].route.findIndex((point, index) => 
                            index === locationIndex || 
                            (Math.abs(point.lat - reisdata[day].waypoints[locationIndex].lat) < 0.01 && 
                             Math.abs(point.lng - reisdata[day].waypoints[locationIndex].lng) < 0.01));
                        
                        if (routeIndex !== -1) {
                            reisdata[day].route[routeIndex].lat = location.lat();
                            reisdata[day].route[routeIndex].lng = location.lng();
                        }
                    }
                    
                    // Als de actieve dag deze dag is, herlaad dan de dag met de nieuwe coördinaten
                    if (activeDay === day) {
                        showDay(day);
                    }
                }
            }
        } else {
            console.warn(`Kan ${locationName} niet vinden via Places API:`, status);
        }
    });
}

// Event listeners voor knoppen
function setupEventListeners() {
    document.getElementById('day1').addEventListener('click', () => {
        setActiveButton('day1');
        showDay('day1');
    });
    
    document.getElementById('day2').addEventListener('click', () => {
        setActiveButton('day2');
        showDay('day2');
    });
    
    document.getElementById('day3').addEventListener('click', () => {
        setActiveButton('day3');
        showDay('day3');
    });
    
    document.getElementById('day4').addEventListener('click', () => {
        setActiveButton('day4');
        showDay('day4');
    });
    
    document.getElementById('all-days').addEventListener('click', () => {
        setActiveButton('all-days');
        showAllDays();
    });
}

// Activeer de juiste knop
function setActiveButton(buttonId) {
    const buttons = document.querySelectorAll('.controls button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}

// Verwijder alle markers en routes
function clearMap() {
    // Verwijder markers
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
    
    // Verwijder polylines
    polylines.forEach(polyline => {
        polyline.setMap(null);
    });
    polylines = [];
    
    // Verwijder directionsRenderers
    Object.values(directionsRenderers).forEach(renderer => {
        renderer.setMap(null);
    });
    directionsRenderers = {};
    
    // Reset marker mapping
    markerMapping = {};
    
    // Leeg de locatielijst
    const locationsList = document.getElementById('locations-list');
    locationsList.innerHTML = '';
}

// Toon een specifieke dag
function showDay(day) {
    clearMap();
    activeDay = day;
    const data = reisdata[day];
    
    // Controleer of data bestaat
    if (!data) return;
    
    // Vul de locatielijst
    populateLocationsList(day);
    
    // Voeg markers toe
    addMarkers(data.waypoints, data.color);
    
    // Teken route met Google Directions
    drawRoute(data.waypoints, data.color, day);
    
    // Zoom naar de route
    zoomToFit(data.waypoints);
}

// Toon alle dagen
function showAllDays() {
    clearMap();
    
    // Vul de locatielijst met alle dagen
    populateLocationsListAllDays();
    
    // Alle dagen doorlopen
    const days = ['day1', 'day2', 'day3', 'day4'];
    let allWaypoints = [];
    
    days.forEach(day => {
        const data = reisdata[day];
        if (data) {
            // Markers toevoegen
            addMarkers(data.waypoints, data.color);
            
            // Route tekenen
            drawRoute(data.waypoints, data.color, day);
            
            // Verzamel alle waypoints voor zoom
            allWaypoints = allWaypoints.concat(data.waypoints);
        }
    });
    
    // Zoom om alle routes te tonen
    zoomToFit(allWaypoints);
}

// Vul de locatielijst voor één dag
function populateLocationsList(day) {
    const locationsList = document.getElementById('locations-list');
    locationsList.innerHTML = '';
    
    const data = reisdata[day];
    if (!data) return;
    
    // Creëer een groep voor deze dag
    const groupElement = document.createElement('div');
    groupElement.className = 'location-group';
    
    // Groepsheader
    const headerElement = document.createElement('div');
    headerElement.className = 'location-group-header';
    
    // Kleurenstip voor de dag
    const colorDot = document.createElement('span');
    colorDot.className = 'color-dot';
    colorDot.style.backgroundColor = data.color;
    
    headerElement.appendChild(colorDot);
    headerElement.appendChild(document.createTextNode(data.title));
    
    groupElement.appendChild(headerElement);
    
    // Voeg alle locaties toe
    data.waypoints.forEach((point, index) => {
        const locationItem = createLocationItem(point, index, day);
        groupElement.appendChild(locationItem);
        
        // Als we al rijtijden hebben voor deze dag, update de UI
        if (driveTimes[day] && driveTimes[day][index]) {
            // Voeg een kleine vertraging toe om de DOM-update toe te staan
            setTimeout(() => {
                updateDriveTimeUI(day, index);
            }, 50);
        }
    });
    
    locationsList.appendChild(groupElement);
}

// Vul de locatielijst voor alle dagen
function populateLocationsListAllDays() {
    const locationsList = document.getElementById('locations-list');
    locationsList.innerHTML = '';
    
    const days = ['day1', 'day2', 'day3', 'day4'];
    
    days.forEach(day => {
        const data = reisdata[day];
        if (!data) return;
        
        // Creëer een groep voor deze dag
        const groupElement = document.createElement('div');
        groupElement.className = 'location-group';
        
        // Groepsheader
        const headerElement = document.createElement('div');
        headerElement.className = 'location-group-header';
        
        // Kleurenstip voor de dag
        const colorDot = document.createElement('span');
        colorDot.className = 'color-dot';
        colorDot.style.backgroundColor = data.color;
        
        headerElement.appendChild(colorDot);
        headerElement.appendChild(document.createTextNode(data.title));
        
        groupElement.appendChild(headerElement);
        
        // Voeg alle locaties toe
        data.waypoints.forEach((point, index) => {
            const locationItem = createLocationItem(point, index, day);
            groupElement.appendChild(locationItem);
        });
        
        locationsList.appendChild(groupElement);
    });
}

// Maak een locatie-item aan voor de lijst
function createLocationItem(point, index, day) {
    const locationItem = document.createElement('div');
    locationItem.className = 'location-item';
    locationItem.dataset.day = day;
    locationItem.dataset.index = index;
    
    // Titel
    const title = document.createElement('h3');
    title.textContent = `${index + 1}. ${point.name}`;
    
    // Beschrijving
    const description = document.createElement('p');
    description.textContent = point.description || '';
    
    locationItem.appendChild(title);
    locationItem.appendChild(description);
    
    // Klikgebeurtenisluisteraar
    locationItem.addEventListener('click', function() {
        highlightLocation(this);
    });
    
    return locationItem;
}

// Highlight een locatie wanneer erop wordt geklikt
function highlightLocation(locationItem) {
    // Verwijder actieve status van vorige item
    if (activeLocationItem) {
        activeLocationItem.classList.remove('active');
    }
    
    // Maak dit item actief
    locationItem.classList.add('active');
    activeLocationItem = locationItem;
    
    // Verkrijg de dag en index
    const day = locationItem.dataset.day;
    const index = parseInt(locationItem.dataset.index);
    
    // Vind de overeenkomende marker
    const markerKey = `${day}-${index}`;
    const marker = markerMapping[markerKey];
    
    if (marker) {
        // Open het infovenster met verbeterde stijl
        const point = reisdata[day].waypoints[index];
        const infoContent = `
            <div class="info-window" style="min-width: 250px; padding: 5px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">${point.name}</div>
                <div style="font-size: 14px;">${point.description || ''}</div>
            </div>`;
        
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
        
        // Toon het gebied rondom de locatie met betere context
        zoomToLocationWithContext(marker.getPosition(), day);
    }
}

// Zoom naar een locatie met betere context van het eiland
function zoomToLocationWithContext(position, day) {
    // Pas de kaart aan om te focussen op de locatie, maar met meer context
    map.panTo(position);
    
    // Bepaal het juiste zoomniveau op basis van de dag
    // Voor dagen met locaties die dicht bij elkaar liggen, zoom verder uit
    if (day === 'day1') {
        map.setZoom(11); // Noordoostkust
    } else if (day === 'day2') {
        map.setZoom(12); // Centraal gebied
    } else if (day === 'day3') {
        map.setZoom(11); // Zuidwestkust
    } else if (day === 'day4') {
        map.setZoom(10); // Noordkust (groter gebied)
    } else {
        // Standaard zoomniveau als geen specifieke dag is gespecificeerd
        map.setZoom(11);
    }
}

// Markers toevoegen aan de kaart
function addMarkers(waypoints, color) {
    // Controleer op dubbele coördinaten en vermijd overlappende markers
    const usedCoordinates = new Map(); // Gebruikt om dubbele locaties bij te houden
    
    waypoints.forEach((point, index) => {
        // Maak een unieke sleutel voor de coördinaten
        const coordKey = `${point.lat.toFixed(4)},${point.lng.toFixed(4)}`;
        
        // Controleer of deze coördinaten al een marker hebben
        if (usedCoordinates.has(coordKey)) {
            // Voeg een kleine offset toe aan de marker om overlap te voorkomen
            const offset = 0.0005 * (usedCoordinates.get(coordKey) + 1); // Verhoog offset voor elke duplicaat
            point.lat += offset;
            point.lng += offset;
            usedCoordinates.set(coordKey, usedCoordinates.get(coordKey) + 1);
        } else {
            usedCoordinates.set(coordKey, 0); // Eerste keer dat we deze coördinaat zien
        }
        
        // Grotere schaal voor rode markers (dag 1)
        const markerScale = color === DAY_COLORS.day1 ? 16 : 12;
        const fontSize = color === DAY_COLORS.day1 ? '16px' : '12px';
        const fontWeight = color === DAY_COLORS.day1 ? 'bold' : 'normal';
        
        const marker = new google.maps.Marker({
            position: { lat: point.lat, lng: point.lng },
            map: map,
            title: point.name,
            label: {
                text: (index + 1).toString(),
                color: 'white',
                fontSize: fontSize,
                fontWeight: fontWeight
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
                scale: markerScale
            }
        });
        
        // Sla marker-referentie op
        const markerKey = `${activeDay}-${index}`;
        markerMapping[markerKey] = marker;
        
        // InfoWindow toevoegen met verbeterde stijl
        marker.addListener('click', () => {
            const infoContent = `
                <div class="info-window" style="min-width: 250px; padding: 5px;">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">${point.name}</div>
                    <div style="font-size: 14px;">${point.description || ''}</div>
                </div>`;
            
            infoWindow.setContent(infoContent);
            infoWindow.open(map, marker);
            
            // Activeer bijbehorend locatie-item
            highlightLocationByMarker(activeDay, index);
            
            // Zoom naar de locatie met context
            zoomToLocationWithContext(marker.getPosition(), activeDay);
        });
        
        markers.push(marker);
    });
}

// Highlight een locatie-item op basis van een marker
function highlightLocationByMarker(day, index) {
    // Vind het locatie-item
    const locationItems = document.querySelectorAll('.location-item');
    
    locationItems.forEach(item => {
        if (item.dataset.day === day && parseInt(item.dataset.index) === index) {
            highlightLocation(item);
            
            // Scroll naar het item
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// Route tekenen tussen waypoints met Google Directions
function drawRoute(waypoints, color, day) {
    if (waypoints.length < 2) return;
    
    // DirectionsRenderer voor deze dag aanmaken
    if (!directionsRenderers[day]) {
        directionsRenderers[day] = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: color,
                strokeWeight: 5,
                strokeOpacity: 0.7
            }
        });
    }
    
    // DirectionsRenderer op de kaart zetten
    directionsRenderers[day].setMap(map);
    
    // Rijtijden opslaan voor deze dag
    driveTimes[day] = [];
    
    // Routes per segment berekenen om rijtijden te krijgen
    calculateRouteSegments(waypoints, day, color);
}

// Bereken routes per segment om rijtijden te krijgen
function calculateRouteSegments(waypoints, day, color) {
    if (waypoints.length < 2) return;
    
    // DirectionsRenderer voor deze dag aanmaken als nog niet bestaat
    if (!directionsRenderers[day]) {
        directionsRenderers[day] = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: color,
                strokeWeight: 5,
                strokeOpacity: 0.7
            }
        });
        directionsRenderers[day].setMap(map);
    }
    
    // Volledige route voor weergave
    const originFull = waypoints[0];
    const destinationFull = waypoints[waypoints.length - 1];
    const waypointsForFull = waypoints.slice(1, -1).map(point => {
        return {
            location: new google.maps.LatLng(point.lat, point.lng),
            stopover: true
        };
    });
    
    // Volledige route berekenen voor weergave
    const requestFull = {
        origin: new google.maps.LatLng(originFull.lat, originFull.lng),
        destination: new google.maps.LatLng(destinationFull.lat, destinationFull.lng),
        waypoints: waypointsForFull,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false
    };
    
    // Route berekenen en tonen
    directionsService.route(requestFull, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderers[day].setDirections(result);
            
            // Nu per segment de rijtijden berekenen
            calculateSegmentTimes(waypoints, day);
        } else {
            console.error(`Kan route niet berekenen: ${status}`);
            // Fallback naar eenvoudige polyline als directions mislukt
            drawSimpleRoute(waypoints, color);
        }
    });
}

// Bereken rijtijden per segment
function calculateSegmentTimes(waypoints, day) {
    driveTimes[day] = [];
    
    // Voor elk paar opeenvolgende waypoints een route berekenen
    for (let i = 0; i < waypoints.length - 1; i++) {
        const origin = waypoints[i];
        const destination = waypoints[i + 1];
        
        const request = {
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(destination.lat, destination.lng),
            travelMode: google.maps.TravelMode.DRIVING
        };
        
        // Gebruik een IIFE om de index te bewaren in de closure
        ((index) => {
            directionsService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    const route = result.routes[0];
                    if (route && route.legs && route.legs[0]) {
                        // Sla de rijtijd op
                        driveTimes[day][index] = route.legs[0].duration.text;
                        
                        // Update de UI voor dit segment
                        updateDriveTimeUI(day, index);
                    }
                }
            });
        })(i);
    }
}

// Update de UI met rijtijd informatie
function updateDriveTimeUI(day, index) {
    if (!driveTimes[day] || !driveTimes[day][index]) return;
    
    const locationItems = document.querySelectorAll(`.location-item[data-day="${day}"]`);
    const driveTime = driveTimes[day][index];
    
    // Alleen als we de rijtijd hebben (deze functie kan meerdere keren worden aangeroepen)
    if (driveTime && locationItems[index]) {
        // Verwijder bestaande rijtijd-element indien aanwezig
        const existingDriveTime = locationItems[index].querySelector('.drive-time');
        if (existingDriveTime) {
            existingDriveTime.remove();
        }
        
        // Voeg rijtijd toe aan het huidige item (als indicator naar het volgende punt)
        const driveTimeElement = document.createElement('div');
        driveTimeElement.className = 'drive-time';
        driveTimeElement.innerHTML = `<span>→ ${driveTime} rijden naar volgend punt</span>`;
        
        // Alleen toevoegen als het niet het laatste punt is
        if (index < locationItems.length - 1) {
            locationItems[index].appendChild(driveTimeElement);
        }
    }
}

// Eenvoudige polyline tekenen als fallback
function drawSimpleRoute(waypoints, color) {
    const path = waypoints.map(point => {
        return { lat: point.lat, lng: point.lng };
    });
    
    const polyline = new google.maps.Polyline({
        path: path,
        strokeColor: color,
        strokeOpacity: 0.7,
        strokeWeight: 5,
        map: map
    });
    
    polylines.push(polyline);
}

// Zoom aanpassen om alle markers te tonen
function zoomToFit(waypoints) {
    if (waypoints.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    
    waypoints.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });
    
    map.fitBounds(bounds);
    
    // Als er slechts één waypoint is, zoom minder ver in
    if (waypoints.length === 1) {
        map.setZoom(11);
    }
} 