/*async function getAll(){
    const url = 'https://asteroids.kaekae.ch/backend/api/getAll.php';
try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data); // gibt die Daten der API in der Konsole aus
} catch (error) {
    console.error(error)
}
}

getAll();*/

let astro_data;
let astro_data_all;
let astro_data_nah;
let astro_data_weit;
const grenze = 40000000;
async function getByDate(date){
    const url = `https://asteroids.kaekae.ch/backend/api/getByDate.php?date=${date}`;
try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data); // gibt die Daten der API in der Konsole aus
    distancepicker.disabled = false;
    astro_data =  data;
    astro_data_all = astro_data.length;
    astro_data_nah = 0;
    astro_data_weit = 0;
    astro_data.forEach((asteroid) => {
        if(asteroid.distance_km <= grenze){
            astro_data_nah ++;
        } else {
            astro_data_weit ++;
        }
    })
} catch (error) {
    console.error(error)
}
}

const datepicker = document.querySelector('#datepicker');
datepicker.addEventListener('change', function(){
    const date = datepicker.value;
    getByDate(date);

    //console.log(date);
})




const distancepicker = document.querySelector('#distancepicker');
distancepicker.addEventListener('change', function(){
    const distance = distancepicker.value;
    console.log(distance);
    if(distance == "nah") console.log(astro_data_nah);
    if(distance == "weit") console.log(astro_data_weit);
    if(distance == "all") console.log(astro_data_all);
    
})
