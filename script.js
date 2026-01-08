document.addEventListener('DOMContentLoaded', function () {
    const datepicker = document.querySelector('#datepicker');
    const distancepicker = document.querySelector('#distancepicker');
    const goButton = document.querySelector('.star-btn');
    const resultCount = document.querySelector('#result-count');

    const today = new Date().toISOString().split('T')[0];
    datepicker.max = today;

    distancepicker.disabled = true;
    goButton.disabled = true;

    datepicker.addEventListener('change', function () {
        if (datepicker.value) {
            distancepicker.disabled = false;
        } else {
            distancepicker.disabled = true;
        }
        checkGoButton();
    });

    distancepicker.addEventListener('change', function () {
        checkGoButton();
    });

    function checkGoButton() {
        const dateSelected = datepicker.value !== '';
        const distanceSelected = distancepicker.value !== 'select';
        goButton.disabled = !(dateSelected && distanceSelected);
    }

    goButton.addEventListener('click', function () {
        const date = datepicker.value;
        const distance = distancepicker.value;
        getByDateAndDistance(date, distance);
    });

    async function getByDateAndDistance(date, distance) {
        const url = `https://asteroids.kaekae.ch/backend/api/getByDateAndDistance.php?date=${date}&distance=${distance}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                resultCount.textContent = `Fehler: ${data.error || 'Unbekannter Fehler'}`;
                return;
            }

            if (data.error) {
                resultCount.textContent = `Fehler: ${data.error}`;
                return;
            }

            console.log('Asteroiden:', data);
            resultCount.textContent = `${data.length} Asteroiden gefunden`;

        } catch (error) {
            console.error('Fehler beim Laden der Daten:', error);
            resultCount.textContent = 'Fehler beim Laden der Daten';
        }
    }
});
