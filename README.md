# Dominica Reisroute Kaart

Deze interactieve kaart toont de reisroutes voor een vierdaagse reis (11-14 april) in Dominica.

## Functionaliteiten

- Visualiseert reisroutes per dag met verschillende kleuren
- Toont bezienswaardigheden en stops als genummerde markers
- Optie om alle routes tegelijk weer te geven
- Klikbare markers met informatie over elke locatie
- Responsive ontwerp voor diverse schermgroottes

## Installatie

1. Download of kloon deze repository naar je computer
2. Open `index.html` in je webbrowser

## Google Maps API Key

**Belangrijk**: Om de kaart correct te laten werken moet je je eigen Google Maps API key invoeren:

1. Ga naar de [Google Cloud Console](https://console.cloud.google.com/)
2. Maak een project aan of selecteer een bestaand project
3. Activeer de "Maps JavaScript API" en "Directions API"
4. Maak een API-sleutel aan
5. Open `index.html` en vervang `YOUR_API_KEY` met je eigen API-sleutel

```html
<script src="https://maps.googleapis.com/maps/api/js?key=JOUW_API_SLEUTEL" defer></script>
```

## Aanpassen van de reisgegevens

De reisgegevens zijn gedefinieerd in `data.js`. Je kunt de locaties, routes en beschrijvingen aanpassen door dit bestand te bewerken:

1. Open `data.js` in een teksteditor
2. Zoek de `reisdata` variabele
3. Pas de coördinaten, namen en beschrijvingen aan voor jouw reis

## Problemen oplossen

Als de routes niet correct worden weergegeven:

- Controleer of je Google Maps API-sleutel geldig is en de Directions API actief is
- Als de DirectionsService niet werkt, valt de toepassing terug op eenvoudige rechte lijnen tussen de waypoints
- Controleer de JavaScript-console voor eventuele foutmeldingen

## Credits

Ontwikkeld voor een 4-daagse reis naar Dominica. Gebruik voor persoonlijke doeleinden. 