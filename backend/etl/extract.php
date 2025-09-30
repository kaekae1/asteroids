<?php

function fetchAsteroidsData() {
    $url = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-09-22&end_date=2025-09-22&api_key=2nlh4N1NrlfzeUSql6thonQcZWuLxCsidPCwhqie";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

/*echo '<pre>';
 var_dump (fetchAsteroidsData());
echo '</pre>';*/


return fetchAsteroidsData();
?>