document.addEventListener('DOMContentLoaded', function () {
    // DOM-Elemente selektieren
    const datepicker = document.querySelector('#datepicker');
    const distancepicker = document.querySelector('#distancepicker');
    const goButton = document.querySelector('.star-btn');
    const resultCount = document.querySelector('#result-count');
    const asteroidContainer = document.querySelector('#asteroid-container');

    // Heutiges Datum als max setzen
    const today = new Date().toISOString().split('T')[0];
    datepicker.max = today;

    // Initialzustand
    distancepicker.disabled = true;
    goButton.disabled = true;

    // Event: Datum geändert
    datepicker.addEventListener('change', function () {
        if (datepicker.value) {
            distancepicker.disabled = false;
        } else {
            distancepicker.disabled = true;
        }
        checkGoButton();
    });

    // Event: Distanz geändert
    distancepicker.addEventListener('change', function () {
        checkGoButton();
    });

    // GO-Button aktivieren / deaktivieren
    function checkGoButton() {
        const dateSelected = datepicker.value !== '';
        const distanceSelected = distancepicker.value !== 'select';
        goButton.disabled = !(dateSelected && distanceSelected);
    }

    // Event: GO-Button klick
    goButton.addEventListener('click', function () {
        const date = datepicker.value;
        const distance = distancepicker.value;
        getByDateAndDistance(date, distance);
    });

    // Daten vom Backend laden
    async function getByDateAndDistance(date, distance) {
        const url = `https://asteroids.kaekae.ch/backend/api/getByDateAndDistance.php?date=${date}&distance=${distance}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                // HTTP-Fehler (z.B. 500, 400)
                resultCount.textContent = `Fehler: ${data.error || 'Unbekannter Fehler'}`;
                return;
            }

            if (data.error) {
                // Fehler aus PHP
                resultCount.textContent = `Fehler: ${data.error}`;
                return;
            }

            console.log('Asteroiden:', data);
            resultCount.textContent = `${data.length} Asteroiden gefunden`;

            renderAsteroids(data);

        } catch (error) {
            console.error('Fehler beim Laden der Daten:', error);
            resultCount.textContent = 'Fehler beim Laden der Daten';
        }
    }

    // Visualisierung
    function renderAsteroids(data) {
        // alte Asteroiden löschen
        const oldAsteroids = asteroidContainer.querySelectorAll('.asteroid');
        oldAsteroids.forEach(a => a.remove());

        if (data.length === 0) {
            return;
        }

        const containerWidth = asteroidContainer.offsetWidth;
        const containerHeight = asteroidContainer.offsetHeight;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const earthRadius = 50;          // an deine Erde anpassen
        const minDistance = earthRadius + 30;

        data.forEach(asteroid => {
            const asteroidDiv = document.createElement('div');
            asteroidDiv.className = 'asteroid';

            const distanceKm = parseFloat(asteroid.distance_km);

            // Farbklassen
            if (distanceKm < 50000000) {
                asteroidDiv.classList.add('close');
            } else if (distanceKm < 100000000) {
                asteroidDiv.classList.add('medium');
            } else {
                asteroidDiv.classList.add('far');
            }

            // Grösse nach Durchmesser
            const avgDiameter = (parseFloat(asteroid.mindiameter) + parseFloat(asteroid.maxdiameter)) / 2;
            const size = Math.min(Math.max(avgDiameter / 100, 8), 30);
            asteroidDiv.style.width = size + 'px';
            asteroidDiv.style.height = size + 'px';

            // Zufällige Position, nicht zu nah an Erde
            let posX, posY, distanceFromCenter;
            let attempts = 0;
            do {
                posX = Math.random() * (containerWidth - size);
                posY = Math.random() * (containerHeight - size);

                const dx = (posX + size / 2) - centerX;
                const dy = (posY + size / 2) - centerY;
                distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

                attempts++;
            } while (distanceFromCenter < minDistance && attempts < 50);

            asteroidDiv.style.left = posX + 'px';
            asteroidDiv.style.top = posY + 'px';

            asteroidDiv.title = `Distanz: ${Math.round(distanceKm).toLocaleString()} km\nDurchmesser: ${avgDiameter.toFixed(2)} km`;

            asteroidContainer.appendChild(asteroidDiv);
        });
    }
});
