<?php

// -> datenbank zugangsdaten einbinden
require_once '../config.php';


header('Content-Type: application/json');

// --> verbinden mit datenbank
try {
    //--> login datenbank
    $pdo = new PDO($dsn, $username, $password, $options);

    $today = date('Y-m-d');

    $sql = "SELECT * FROM asteroids WHERE DATE(timestamp) = :today";
    $stmt = $pdo->prepare($sql); 
    $stmt->execute(['today' => $today]);
    $results = $stmt->fetchAll();

    //--> daten als json zurückgeben
    echo json_encode($results);

} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}