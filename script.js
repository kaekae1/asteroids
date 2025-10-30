// DOM-Elemente selektieren
const datepicker = document.querySelector('#datepicker');
const distancepicker = document.querySelector('#distancepicker');
const goButton = document.querySelector('#star-btn'); // Annahme: dein GO-Button hat diese ID
const resultCount = document.querySelector('#result-count');
const asteroidContainer = document.querySelector('#asteroid-container');

// Initialisierung: max-Attribut vom Datepicker auf heute setzen
const today = new Date().toISOString().split('T')[0];
datepicker.max = today;

// GO-Button initial deaktivieren
goButton.disabled = true;

// Event-Listener für Datepicker
datepicker.addEventListener('change', function() {
    // Distanzfilter aktivieren, wenn Datum gewählt wurde
    if (datepicker.value) {
        distancepicker.disabled = false;
    }
    // Prüfen, ob GO-Button aktiviert werden kann
    checkGoButton();
});

// Event-Listener für Distanzfilter
distancepicker.addEventListener('change', function() {
    // Prüfen, ob GO-Button aktiviert werden kann
    checkGoButton();
});

// Funktion: GO-Button-Aktivierung prüfen
function checkGoButton() {
    const dateSelected = datepicker.value !== '';
    const distanceSelected = distancepicker.value !== 'select';
    
    // GO-Button aktivieren, wenn beide Filter gesetzt sind
    if (dateSelected && distanceSelected) {
        goButton.disabled = false;
    } else {
        goButton.disabled = true;
    }
}

// Event-Listener für GO-Button
goButton.addEventListener('click', function() {
    const date = datepicker.value;
    const distance = distancepicker.value;
    
    // Daten laden und visualisieren
    getByDateAndDistance(date, distance);
});

// Haupt-Funktion: Daten vom Backend laden
async function getByDateAndDistance(date, distance) {
    const url = `https://asteroids.kaekae.ch/backend/api/getByDateAndDistance.php?date=${date}&distance=${distance}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Prüfen, ob ein Fehler zurückgegeben wurde
        if (data.error) {
            resultCount.textContent = `Fehler: ${data.error}`;
            return;
        }
        
        console.log(data); // Für Debugging
        
        // Anzahl der Asteroiden anzeigen
        resultCount.textContent = `${data.length} Asteroiden gefunden`;
        
        // Asteroiden visualisieren
        renderAsteroids(data, distance);
        
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        resultCount.textContent = 'Fehler beim Laden der Daten';
    }
}
