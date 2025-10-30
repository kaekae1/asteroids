<?php

// -> daten laden
$data = include('transform.php');

// -> datenbank zugangsdaten einbinden
require_once '../config.php';

// -> verbindung mit der datenbank
try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $sql = "INSERT INTO asteroids (distance_km, mindiameter, maxdiameter) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    foreach($data as $asteroid) {
        $stmt->execute([
            $asteroid['distance_km'],
            $asteroid['mindiameter'],
            $asteroid['maxdiameter'],
        ]);
    }

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}