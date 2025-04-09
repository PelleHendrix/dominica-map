# Reisplanning Dominica

Een interactieve kaart voor het plannen van een reis naar Dominica.

## Functies

- Interactieve Google Maps-kaart van Dominica
- Dagplanning met verschillende locaties
- Details over elke bestemming
- Route-informatie en rijtijden tussen locaties

## Installatie en gebruik

### Lokaal gebruik
1. Clone deze repository
2. Maak een `.env` bestand aan in de hoofdmap met de volgende inhoud:
   ```
   GOOGLE_MAPS_API_KEY=jouw_google_maps_api_sleutel
   ```
3. Open het project met een lokale server, bijvoorbeeld:
   ```
   npx http-server
   ```
4. Ga naar `http://localhost:8080` in je browser

### Online gebruik (GitHub Pages)
De applicatie vraagt bij het eerste gebruik om je Google Maps API-sleutel. Deze wordt veilig opgeslagen in de lokale opslag van je browser en wordt nooit gedeeld met de server of opgeslagen in de code.

**Belangrijk**: Je moet een geldige Google Maps API-sleutel hebben met de volgende API's ingeschakeld:
- Maps JavaScript API
- Places API
- Directions API

## API-sleutel veiligheid

Voor de veiligheid van je API-sleutel:
1. Beperk je API-sleutel in de Google Cloud Console tot specifieke websites/domeinen
2. Stel quotalimieten in voor je API-gebruik
3. Controleer regelmatig je API-gebruik in de Google Cloud Console

## Ontwikkelaarsnotities

- Het `.env` bestand is toegevoegd aan `.gitignore` en wordt nooit geüpload naar GitHub
- De API-sleutel wordt veilig opgeslagen in de localStorage van de browser voor hergebruik
- Voor lokale ontwikkeling wordt het `.env` bestand gebruikt
- Voor GitHub Pages wordt de API-sleutel uit localStorage gehaald of aan de gebruiker gevraagd

## Disclaimer

Dit is een persoonlijk project voor reisplanning. Gebruik de kaart en routebeschrijvingen als richtlijn, maar controleer altijd de actuele informatie voordat je op reis gaat.

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

## Ontwikkeling

### Projectstructuur
- `index.html` - Hoofdpagina
- `