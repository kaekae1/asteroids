<?php

// -> fetch von nasa API
function fetchAsteroidData() {
    $today = date('Y-m-d');
    $url = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" . $today ."&end_date=" . $today . "&api_key=2nlh4N1NrlfzeUSql6thonQcZWuLxCsidPCwhqie";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

// -> daten laden
$data = fetchAsteroidData();

// -> testen
/*echo '<pre>';
print_r($data);
echo '</pre>';*/

// -> daten zurückgeben
return $data;