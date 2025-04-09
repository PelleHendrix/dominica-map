# Dominica Reisroute App

Een interactieve kaart-applicatie voor het plannen van een reis naar Dominica.

## Functies
- Interactieve Google Maps integratie
- Dagindeling van activiteiten
- Gedetailleerde informatie over locaties
- Responsief ontwerp voor desktop, tablet en mobiel gebruik

## Mobiel gebruik
Deze applicatie is volledig geoptimaliseerd voor gebruik op mobiele apparaten. Je kunt het op de volgende manieren mobiel gebruiken:

1. **Via een online link**: Bezoek de GitHub Pages URL (indien gehost)
2. **Als webapp**: Voeg de website toe aan je startscherm op iOS of Android voor een app-achtige ervaring

## Lokale installatie
Om de applicatie lokaal te draaien:

1. Clone de repository
2. Open index.html in een webbrowser

## GitHub Pages
Deze applicatie is ook beschikbaar via GitHub Pages op:
[https://PelleHendrix.github.io/dominica-map](https://PelleHendrix.github.io/dominica-map)

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

## Installatie

1. Clone de repository:
   ```
   git clone <repository-url>
   cd dominica-map
   ```

2. Maak een `.env` bestand aan in de hoofdmap met uw Google Maps API sleutel:
   ```
   # .env bestand
   GOOGLE_MAPS_API_KEY=jouw_google_maps_api_sleutel_hier
   ```

   > **Let op**: Het `.env` bestand wordt niet meegenomen in Git voor veiligheidsredenen. Zorg ervoor dat je je API-sleutel niet deelt of publiceert.

3. Open `index.html` in een webbrowser.

## Functies

- Interactieve kaart met reisroutes per dag
- Gedetailleerde locatie-informatie met reistijden en afstanden
- Kleurgecodeerde activiteiten
- Responsive ontwerp voor verschillende schermformaten

## Ontwikkeling

### Projectstructuur
- `index.html` - Hoofdpagina
- `style.css` - Stijlen
- `script.js` - JavaScript code
- `data.js` - Reisdata en configuratie
- `.env` - Omgevingsbestand voor gevoelige informatie (niet in Git)

### API sleutel instellen
Om de Google Maps API te gebruiken, moet je je eigen API-sleutel instellen in het `.env` bestand:

1. Maak een Google Cloud Platform account aan
2. Maak een project en activeer de Maps JavaScript API
3. Maak een API sleutel 
4. Voeg de sleutel toe aan je `.env` bestand

## Licentie

Dit project is beschikbaar onder de MIT-licentie. 