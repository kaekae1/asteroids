const datepicker = document.querySelector('#datepicker')
const distancepicker = document.querySelector('#distancepicker')
const goButton = document.querySelector('.star-btn')
const resultCount = document.querySelector('#result-count')
const leftButton = document.querySelector('#left-btn')
const rightButton = document.querySelector('#right-btn')

function checkGoButton() {
  const dateSelected = datepicker.value !== ''
  const distanceSelected = distancepicker.value !== ''
  goButton.disabled = !(dateSelected && distanceSelected)
}

function updateArrowButtons() {
  if (!distancepicker.value) {
    leftButton.style.display = 'none'
    rightButton.style.display = 'none'
    return
  }

  if (distancepicker.value === 'all') {
    leftButton.style.display = 'none'
    rightButton.style.display = 'block'
    rightButton.textContent = '<50 MIO. KM'
  } else if (distancepicker.value === 'close') {
    leftButton.style.display = 'block'
    rightButton.style.display = 'none'
    leftButton.textContent = 'ALL'
  } else {
    leftButton.style.display = 'none'
    rightButton.style.display = 'none'
  }
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
  updateArrowButtons()

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
  if (distance === 'all') return 'nearly'
  else if (distance === 'medium') return 'by less than 100 Mio. km'
  return ''
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

    const dateLabel = localizeDate(date)

    let text = ''
    if (distance === 'all') {
      text = `ASTEROIDS said hi on ${dateLabel}`
    } else if (distance === 'medium') {
      text = `ASTEROIDS missed us by less than 100 Mio. km on ${dateLabel}`
    } else {
      text = `ASTEROIDS on ${dateLabel}`
    }


    if (distance === 'all') {
      resultCount.innerHTML = `
    <div class="result-top">
      <div class="result-num">${data.length}</div>
      <div class="result-title">ASTEROIDS</div>
    </div>

    <div class="result-middle"></div>

    <div class="result-bottom">
      <div class="result-line">said hi on</div>
      <div class="result-line result-caps">${dateLabel}</div>
    </div>
  `
    } else if (distance === 'close') {
      resultCount.innerHTML = `
    <div>
      <div class="result-top">
        <div class="result-num">${data.length}</div>
        <div class="result-title" data-text="ASTEROIDS">ASTEROIDS</div>
      </div>

      <div class="result-middle">
        <div class="result-line">missed us by</div>
        <div class="result-line result-caps">LESS THAN 50 MIO. KM</div>
      </div>
    </div>

    <div class="result-bottom">
      <div class="result-line">on</div>
      <div class="result-line result-caps">${dateLabel}</div>
    </div>
  `
    } else {
      // fallback (sollte eigentlich nie passieren)
      resultCount.textContent = `${data.length} asteroids on ${dateLabel}`
    }

  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error)
    resultCount.textContent = 'Fehler beim Laden der Daten'
  }
}

function getYesterdayISO() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}


document.addEventListener('DOMContentLoaded', function () {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = getYesterdayISO()
  datepicker.max = today
  datepicker.value = yesterday
  distancepicker.value = ''
  checkGoButton()
  updateArrowButtons()

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

    datepicker.value = getYesterdayISO()
    distancepicker.value = ''

    checkGoButton()
    updateArrowButtons()
  })




  distancepicker.addEventListener('change', function () {
    checkGoButton()
  })

  leftButton.addEventListener('click', function () {
    distancepicker.value = 'all'
    updateArrowButtons()
    getByDateAndDistance(datepicker.value, distancepicker.value)
  })

  rightButton.addEventListener('click', function () {
    distancepicker.value = 'close'
    updateArrowButtons()
    getByDateAndDistance(datepicker.value, distancepicker.value)
  })





  goButton.addEventListener('click', function () {
    const date = datepicker.value
    const distance = distancepicker.value
    loadSecondPage()
    getByDateAndDistance(date, distance)
  })
})
