<?php

// -> daten laden
$data = include('extract.php');

// -> aktuelles datum 
$today = date('Y-m-d');

// -> alle asteroiden
$asteroids = $data['near_earth_objects'][$today];

// -> daten aufbereiten
$transformed_data = []; 
foreach($asteroids as $asteroid) {
    $transformed_data[] = [
        'distance_km' => round($asteroid['close_approach_data'][0]['miss_distance']['kilometers']),
        'mindiameter' => round($asteroid['estimated_diameter']['meters']['estimated_diameter_min']),
        'maxdiameter' => round($asteroid['estimated_diameter']['meters']['estimated_diameter_max']),
    ];
}

// -> testen

/*echo '<pre>';
print_r($transformed_data);
echo '</pre>';*/

// -> daten zurückgeben
return $transformed_data;