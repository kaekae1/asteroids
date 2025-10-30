<?php

// -> datenbank zugangsdaten einbinden
require_once '../config.php';


header('Content-Type: application/json');

// --> verbinden mit datenbank
try {
    //--> login datenbank
    $pdo = new PDO($dsn, $username, $password, $options);

    $date = $_GET['date'];

    $sql = "SELECT * FROM asteroids WHERE DATE(timestamp) = :date";
    $stmt = $pdo->prepare($sql); 
    $stmt->execute(['date' => $date]);
    $results = $stmt->fetchAll();

    //--> daten als json zurückgeben
    echo json_encode($results);

} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}