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
let driveDistances = {}; // Om afstanden tussen locaties op te slaan
let placesService; // Places API service

// Wacht tot de pagina en Google Maps zijn geladen
function initializeMap() {
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
    
    // Setup event listeners
    setupEventListeners();
}

// Wacht tot de pagina is geladen
document.addEventListener('DOMContentLoaded', function() {
    // Controleer of Google Maps API is geladen
    if (typeof google === 'undefined') {
        console.error('Google Maps API is niet geladen');
        document.getElementById('map').innerHTML = 
            '<div style="padding: 20px; text-align: center;">' +
            '<p>Er is een fout opgetreden bij het laden van Google Maps.</p>' +
            '<p>Vernieuw de pagina om het opnieuw te proberen.</p>' +
            '</div>';
        return;
    }
    
    // Initialiseer de kaart
    initializeMap();
});

// Functie om het .env bestand te lezen en Google Maps te laden
async function loadGoogleMapsFromEnv() {
    try {
        const response = await fetch('/.env');
        const text = await response.text();
        
        // Eenvoudige parser voor .env bestand
        const config = {};
        text.split('\n').forEach(line => {
            if (line.startsWith('#') || line.trim() === '') return;
            const [key, value] = line.split('=');
            if (key && value) {
                config[key.trim()] = value.trim();
            }
        });
        
        // Laad Google Maps alleen als het nog niet geladen is
        if (typeof google === 'undefined') {
            await loadGoogleMapsScript(config.GOOGLE_MAPS_API_KEY);
        }
        
        // Initialiseer de kaart
        initMap();
    } catch (error) {
        console.error("Kan het .env bestand niet laden:", error);
        document.getElementById('map').innerHTML = 
            '<div style="padding: 20px; text-align: center;">' +
            '<p>Er is een fout opgetreden bij het laden van de Google Maps configuratie.</p>' +
            '<p>Zorg ervoor dat je een geldig .env bestand hebt met je Google Maps API key.</p>' +
            '</div>';
        throw new Error('Google Maps API key niet gevonden');
    }
}

// Functie om Google Maps API script dynamisch te laden
function loadGoogleMapsScript(apiKey) {
    return new Promise((resolve, reject) => {
        // Maak een script element aan
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        
        // Voeg een globale callback toe die Promise zal resolveren
        window.initMapCallback = function() {
            resolve();
            delete window.initMapCallback;
        };
        
        // Error handler
        script.onerror = function() {
            reject(new Error('Google Maps script failed to load.'));
        };
        
        // Voeg script toe aan DOM
        document.head.appendChild(script);
    });
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
    
    // Markers toevoegen en route tekenen
    addMarkers(data.waypoints, data.color, day);
    
    // Teken de route
    if (data.route && data.route.length > 1) {
        if (data.route.length <= 10) {
            calculateRouteSegments(data.route, day, data.color);
        } else {
            // Teken een simpele route als er meer dan 10 punten zijn (limitations van Directions API)
            drawSimpleRoute(data.route, data.color);
        }
    }
    
    // Zoom naar de dag
    zoomToFit(data.waypoints);
    
    // Bereken rijtijden voor segments
    if (data.waypoints.length > 1) {
        calculateSegmentTimes(data.waypoints, day);
    }
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
            addMarkers(data.waypoints, data.color, day);
            
            // Route tekenen
            drawRoute(data.waypoints, data.color, day);
            
            // Verzamel alle waypoints voor zoom
            allWaypoints = allWaypoints.concat(data.waypoints);
        }
    });
    
    // Zoom om heel Dominica te tonen in plaats van alleen de routes
    zoomToDominica();
}

// Zoom aanpassen om heel Dominica in beeld te brengen
function zoomToDominica() {
    // Definieer de bounds van Dominica met extra ruimte
    const dominicaBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(15.10, -61.55), // Zuidwest (verruimd)
        new google.maps.LatLng(15.70, -61.20) // Noordoost (verruimd)
    );
    
    // Pas de kaart aan om Dominica te tonen
    map.fitBounds(dominicaBounds);
    
    // Voeg een kleine padding toe voor betere visualisatie
    map.fitBounds(dominicaBounds, { top: 30, right: 30, bottom: 30, left: 30 });
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
    
    // Google Maps-knop toevoegen
    const googleMapsButton = document.createElement('button');
    googleMapsButton.className = 'google-maps-button';
    googleMapsButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" style="margin-right: 8px;">
            <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
        </svg>
        Open in Google Maps`;
    googleMapsButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Voorkom dat de klik doorgaat naar de parent elementen
        openInGoogleMaps(day);
    });
    
    // Container voor de Google Maps-knop
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'google-maps-button-container';
    buttonContainer.appendChild(googleMapsButton);
    
    groupElement.appendChild(buttonContainer);
    
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
        
        // Google Maps-knop toevoegen
        const googleMapsButton = document.createElement('button');
        googleMapsButton.className = 'google-maps-button';
        googleMapsButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" style="margin-right: 8px;">
                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
            </svg>
            Open in Google Maps`;
        googleMapsButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Voorkom dat de klik doorgaat naar de parent elementen
            openInGoogleMaps(day);
        });
        
        // Container voor de Google Maps-knop
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'google-maps-button-container';
        buttonContainer.appendChild(googleMapsButton);
        
        groupElement.appendChild(buttonContainer);
        
        // Voeg alle locaties toe
        data.waypoints.forEach((point, index) => {
            const locationItem = createLocationItem(point, index, day);
            groupElement.appendChild(locationItem);
        });
        
        locationsList.appendChild(groupElement);
    });
}

// Functie om locatie-items in de lijst te maken
function createLocationItem(point, index, day) {
    const item = document.createElement('div');
    item.className = 'location-item';
    item.dataset.day = day;
    item.dataset.index = index;
    
    // Bepaal de kleur (of standaard)
    let color = reisdata[day].color;
    // Gebruik de activiteitskleur als deze beschikbaar is
    if (point.activityType && ACTIVITY_COLORS[point.activityType]) {
        color = ACTIVITY_COLORS[point.activityType];
    }
    
    // Locatie-indicator met nummer
    const indicator = document.createElement('div');
    indicator.className = 'location-indicator';
    indicator.style.backgroundColor = color;
    indicator.textContent = (index + 1).toString();
    item.appendChild(indicator);
    
    // Informatie container
    const info = document.createElement('div');
    info.className = 'location-info';
    
    // Locatienaam
    const name = document.createElement('div');
    name.className = 'location-name';
    name.textContent = point.name;
    info.appendChild(name);
    
    // Locatiebeschrijving
    if (point.description) {
        const description = document.createElement('div');
        description.className = 'location-description';
        description.textContent = point.description;
        info.appendChild(description);
    }
    
    // Activiteitstype toevoegen als badge
    if (point.activityType) {
        const activityBadge = document.createElement('div');
        activityBadge.className = 'activity-badge';
        activityBadge.style.backgroundColor = ACTIVITY_COLORS[point.activityType] || '#999';
        activityBadge.textContent = point.activityType.charAt(0).toUpperCase() + point.activityType.slice(1);
        info.appendChild(activityBadge);
    }
    
    // Informatie over rijtijd naar volgende locatie (later in te vullen)
    if (index < reisdata[day].waypoints.length - 1) {
        const driveTimeElement = document.createElement('div');
        driveTimeElement.className = 'drive-time';
        driveTimeElement.id = `drive-time-${day}-${index}`;
        driveTimeElement.innerHTML = '<i class="fas fa-car"></i> Berekenen...';
        info.appendChild(driveTimeElement);
    }
    
    item.appendChild(info);
    
    // Voeg Google Maps link toe indien aanwezig
    if (point.directMapLink) {
        const mapLink = document.createElement('a');
        mapLink.href = point.directMapLink;
        mapLink.className = 'map-link';
        mapLink.target = '_blank';
        mapLink.innerHTML = '<i class="fas fa-map-marked-alt"></i>';
        mapLink.title = 'Bekijk in Google Maps';
        item.appendChild(mapLink);
    }
    
    // Event listener om de locatie te highlighten
    item.addEventListener('click', () => {
        highlightLocation(item);
    });
    
    return item;
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
        
        // Voeg een directe link toe aan de infoWindow als die bestaat
        let directLinkHtml = '';
        if (point.directMapLink) {
            directLinkHtml = `
                <div style="margin-top: 8px;">
                    <a href="${point.directMapLink}" target="_blank" style="color: #4285F4; text-decoration: none; display: flex; align-items: center; font-size: 12px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#4285F4" style="margin-right: 4px;">
                            <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                        </svg>
                        Directe link naar locatie
                    </a>
                </div>
            `;
        }
        
        // Maak een gecodeerde zoekquery voor Google
        const searchQuery = encodeURIComponent(`${point.name} dominica`);
        const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
        
        const infoContent = `
            <div class="info-window" style="padding: 8px; min-width: 200px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); border-radius: 4px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div style="font-size: 16px; font-weight: bold;">${point.name}</div>
                    <div class="custom-close-button" onclick="window.closeCurrentInfoWindow()">×</div>
                </div>
                <div style="font-size: 13px; color: #444;">${point.description || ''}</div>
                ${directLinkHtml}
                <div style="margin-top: 8px; text-align: center;">
                    <a href="${googleSearchUrl}" target="_blank" style="color: white; text-decoration: none; display: inline-block; background-color: #4CAF50; padding: 4px 8px; border-radius: 4px; font-size: 13px; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
                        Google zoeken
                    </a>
                </div>
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

// Functie om markers toe te voegen
function addMarkers(waypoints, defaultColor, day) {
    waypoints.forEach((point, index) => {
        // Gebruik activiteitskleur indien beschikbaar, anders de dagkleur
        let color = defaultColor;
        if (point.activityType && ACTIVITY_COLORS[point.activityType]) {
            color = ACTIVITY_COLORS[point.activityType];
        }
        
        // Maak een custom marker icon
        const markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 14,
            labelOrigin: new google.maps.Point(0, 0)
        };
        
        // Maak een custom label
        const label = {
            text: (index + 1).toString(),
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold'
        };
        
        // Marker toevoegen met label
        const marker = new google.maps.Marker({
            position: { lat: point.lat, lng: point.lng },
            map: map,
            icon: markerIcon,
            label: label,
            title: point.name,
            optimized: false, // Nodig voor betere z-index stacking
            zIndex: 1000 + index
        });
        
        // InfoWindow toevoegen aan marker
        marker.addListener('click', () => {
            // Sluit bestaande infoWindow
            infoWindow.close();
            
            // Maak HTML voor infoWindow
            const searchQuery = encodeURIComponent(`${point.name} dominica`);
            const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
            
            let contentString = `
                <div class="info-window" style="padding: 8px; min-width: 200px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); border-radius: 4px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <div style="font-size: 16px; font-weight: bold;">${point.name}</div>
                        <div class="custom-close-button" onclick="window.closeCurrentInfoWindow()">×</div>
                    </div>`;
            
            if (point.description) {
                contentString += `<div style="font-size: 13px; color: #444;">${point.description}</div>`;
            }
            
            if (point.activityType) {
                contentString += `
                    <div style="display: inline-block; padding: 2px 6px; border-radius: 3px; color: white; font-size: 11px; margin: 5px 0; background-color: ${ACTIVITY_COLORS[point.activityType] || '#999'}">
                        ${point.activityType.charAt(0).toUpperCase() + point.activityType.slice(1)}
                    </div>`;
            }
            
            if (point.directMapLink) {
                contentString += `
                    <div style="margin: 5px 0;">
                        <a href="${point.directMapLink}" target="_blank" style="color: #4285F4; text-decoration: none; display: flex; align-items: center; font-size: 12px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#4285F4" style="margin-right: 4px;">
                                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                            </svg>
                            Directe link naar locatie
                        </a>
                    </div>`;
            }
            
            contentString += `
                <div style="margin-top: 8px; text-align: center;">
                    <a href="${googleSearchUrl}" target="_blank" style="color: white; text-decoration: none; display: inline-block; background-color: #4CAF50; padding: 4px 8px; border-radius: 4px; font-size: 13px; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
                        Google zoeken
                    </a>
                </div>
            </div>`;
            
            // Open InfoWindow op de marker
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
            
            // Highlight de bijbehorende locatie in de lijst
            highlightLocationByMarker(day, index);
        });
        
        // Marker toevoegen aan de array
        markers.push(marker);
        
        // Marker koppelen aan locatie-item
        markerMapping[`${day}-${index}`] = marker;
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
    driveDistances[day] = [];
    
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
    driveDistances[day] = [];
    
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
                        // Sla de afstand op
                        driveDistances[day][index] = route.legs[0].distance.text;
                        
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
    const driveDistance = driveDistances[day][index];
    
    // Alleen als we de rijtijd hebben (deze functie kan meerdere keren worden aangeroepen)
    if (driveTime && locationItems[index]) {
        // Verwijder bestaande rijtijd-element indien aanwezig
        const existingDriveTime = locationItems[index].querySelector('.drive-time');
        if (existingDriveTime) {
            existingDriveTime.remove();
        }
        
        // Voeg rijtijd en afstand toe aan het huidige item (als indicator naar het volgende punt)
        const driveTimeElement = document.createElement('div');
        driveTimeElement.className = 'drive-time';
        driveTimeElement.innerHTML = `<span>→ ${driveTime} (${driveDistance}) naar volgend punt</span>`;
        
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

// Functie om een route in Google Maps te openen
function openInGoogleMaps(day) {
    const waypoints = reisdata[day].waypoints;
    if (!waypoints || waypoints.length < 2) return;
    
    // Start- en eindpunt
    const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
    const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;
    
    // Tussenpunten (maximaal 8 extra stops in Google Maps URL)
    let waypointsStr = '';
    // Google Maps ondersteunt max. 10 punten inclusief origin en destination
    // We selecteren strategisch verdeelde punten als er meer dan 8 tussenstops zijn
    if (waypoints.length > 2) {
        const maxStops = Math.min(8, waypoints.length - 2);
        const interval = (waypoints.length - 2) / maxStops;
        
        const selectedWaypoints = [];
        for (let i = 0; i < maxStops; i++) {
            const index = Math.min(1 + Math.floor(i * interval), waypoints.length - 2);
            selectedWaypoints.push(`${waypoints[index].lat},${waypoints[index].lng}`);
        }
        
        waypointsStr = '&waypoints=' + selectedWaypoints.join('|');
    }
    
    // Bouw de Google Maps URL
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsStr}&travelmode=driving`;
    
    // Open in nieuw tabblad
    window.open(url, '_blank');
} 