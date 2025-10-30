// Warten bis DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM-Elemente selektieren
    const datepicker = document.querySelector('#datepicker');
    const distancepicker = document.querySelector('#distancepicker');
    const goButton = document.querySelector('.star-btn'); // GEÄNDERT: Klasse statt ID
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
            
            // Asteroiden visualisieren (kommt in Phase 3)
            renderAsteroids(data, distance);
            
        } catch (error) {
            console.error('Fehler beim Laden der Daten:', error);
            resultCount.textContent = 'Fehler beim Laden der Daten';
        }
    }




        // Visualisierungs-Funktion
    function renderAsteroids(data, distance) {
        // Container leeren, aber Erde behalten
        const asteroids = asteroidContainer.querySelectorAll('.asteroid');
        asteroids.forEach(asteroid => asteroid.remove());
        
        // Keine Asteroiden gefunden
        if (data.length === 0) {
            return;
        }
        
        // Container-Dimensionen
        const containerWidth = asteroidContainer.offsetWidth;
        const containerHeight = asteroidContainer.offsetHeight;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const earthRadius = 50; // Radius der Erde in px
        const minDistance = earthRadius + 30; // Mindestabstand zur Erde
        
        // Jeden Asteroid platzieren
        data.forEach((asteroid) => {
            // Neues Asteroid-Element erstellen
            const asteroidDiv = document.createElement('div');
            asteroidDiv.className = 'asteroid';
            
            // Farbklasse basierend auf Distanz zuweisen
            const distanceKm = parseFloat(asteroid.distance_km);
            if (distanceKm < 50000000) {
                asteroidDiv.classList.add('close');
            } else if (distanceKm < 100000000) {
                asteroidDiv.classList.add('medium');
            } else {
                asteroidDiv.classList.add('far');
            }
            
            // Größe basierend auf Durchmesser (optional)
            const avgDiameter = (parseFloat(asteroid.mindiameter) + parseFloat(asteroid.maxdiameter)) / 2;
            const size = Math.min(Math.max(avgDiameter / 100, 8), 30); // zwischen 8 und 30px
            asteroidDiv.style.width = size + 'px';
            asteroidDiv.style.height = size + 'px';
            
            // Zufällige Position finden (nicht zu nah an der Erde)
            let posX, posY, distanceFromCenter;
            let attempts = 0;
            do {
                posX = Math.random() * (containerWidth - size);
                posY = Math.random() * (containerHeight - size);
                
                // Distanz zum Erdmittelpunkt berechnen
                const dx = (posX + size/2) - centerX;
                const dy = (posY + size/2) - centerY;
                distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
                
                attempts++;
            } while (distanceFromCenter < minDistance && attempts < 50);
            
            // Position setzen
            asteroidDiv.style.left = posX + 'px';
            asteroidDiv.style.top = posY + 'px';
            
            // Tooltip mit Infos (optional)
            asteroidDiv.title = `Distanz: ${Math.round(distanceKm).toLocaleString()} km\nDurchmesser: ${avgDiameter.toFixed(2)} km`;
            
            // Zum Container hinzufügen
            asteroidContainer.appendChild(asteroidDiv);
        });
    }


});