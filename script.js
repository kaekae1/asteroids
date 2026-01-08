const datepicker = document.querySelector('#datepicker')
const distancepicker = document.querySelector('#distancepicker')
const goButton = document.querySelector('.star-btn')
const resultCount = document.querySelector('#result-count')
const leftButton = document.querySelector('#left-btn')
const rightButton = document.querySelector('#right-btn')

function checkGoButton() {
  const dateSelected = datepicker.value !== ''
  const distanceSelected = distancepicker.value !== 'select'
  goButton.disabled = !(dateSelected && distanceSelected)
}

function loadSecondPage() {
  // Move the image to the top third of the current poage
  const earthImage = document.getElementById('earth-overlay')
  const dataText = document.getElementById('data-text')

  if (earthImage) {
    earthImage.style.transform = 'translateY(-60%)'
  }

  // remove the first section
  const firstSection = document.getElementById('search')
  if (firstSection) {
    firstSection.style.display = 'none'
  }

  // hide the left button initially
  leftButton.style.display = 'none'

  // show the second page results container
  document.getElementById('results').style.display = 'block'
}

function showfFirstPage() {
  // Move the image back to the center of the current poage
  const earthImage = document.getElementById('earth-overlay')
  if (earthImage) {
    earthImage.style.transform = 'translateY(-50%)'
  }

  // show the first section
  const firstSection = document.getElementById('search')
  if (firstSection) {
    firstSection.style.display = 'block'
  }

  // hide the second page results container
  document.getElementById('results').style.display = 'none'
}

function localizeDate(dateString) {
  return new Date(dateString).toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function localizeDistance(distance) {
  if (distance == 'all') return 'Alle Entfernungen'
  else if (distance == 'medium') return 'Weniger als 100 Mio. km'
  else if (distance == 'close') return 'Weniger als 50 Mio. km'
}

async function getByDateAndDistance(date, distance) {
  console.log('get by date and distance', date, distance)
  const url = `https://asteroids.kaekae.ch/backend/api/getByDateAndDistance.php?date=${date}&distance=${distance}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    console.log('data', data)

    if (!response.ok) {
      resultCount.textContent = `Fehler: ${data.error || 'Unbekannter Fehler'}`
      return
    }

    if (data.error) {
      resultCount.textContent = `Fehler: ${data.error}`
      return
    }

    if (data.length === 0) {
      resultCount.textContent = 'Keine Asteroiden gefunden'
      return
    }

    resultCount.innerHTML = `
        <span class="bigger">${data.length}</span>
        Asteroiden gefunden am ${localizeDate(date)} bei ${localizeDistance(
      distance,
    )}`
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error)
    resultCount.textContent = 'Fehler beim Laden der Daten'
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const today = new Date().toISOString().split('T')[0]
  datepicker.max = today
  datepicker.value = '2026-01-06'
  distancepicker.value = 'all'

  datepicker.addEventListener('change', function () {
    if (datepicker.value) {
      distancepicker.disabled = false
    } else {
      distancepicker.disabled = true
    }
    checkGoButton()
  })

  document.getElementById('rst-btn').addEventListener('click', function () {
    showfFirstPage()
    resultCount.textContent = ''
  })

  distancepicker.addEventListener('change', function () {
    checkGoButton()
  })

  leftButton.addEventListener('click', function () {
    rightButton.style.display = 'block'
    if (distancepicker.value === 'close') {
      distancepicker.value = 'medium'
    } else if (distancepicker.value === 'medium') {
      distancepicker.value = 'all'
      leftButton.style.display = 'none'
    }

    getByDateAndDistance(datepicker.value, distancepicker.value)
  })
  rightButton.addEventListener('click', function () {
    leftButton.style.display = 'block'
    if (distancepicker.value === 'all') {
      distancepicker.value = 'medium'
    } else if (distancepicker.value === 'medium') {
      distancepicker.value = 'close'
      rightButton.style.display = 'none'
    }

    getByDateAndDistance(datepicker.value, distancepicker.value)
  })

  goButton.addEventListener('click', function () {
    const date = datepicker.value
    const distance = distancepicker.value
    loadSecondPage()
    getByDateAndDistance(date, distance)
  })
})
