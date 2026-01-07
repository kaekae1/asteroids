<?php
require_once '../config.php';

header('Content-Type: application/json');

try {
    // Datenbank-Verbindung
    $pdo = new PDO($dsn, $username, $password, $options);

    // Parameter prüfen
    if (!isset($_GET['date']) || !isset($_GET['distance'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Parameter: date und distance erforderlich']);
        exit;
    }

    $date = $_GET['date'];
    $distance = $_GET['distance'];

    // Datum validieren (YYYY-MM-DD)
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungueltiges Datumsformat. Erwartet: YYYY-MM-DD']);
        exit;
    }

    // Distanz validieren
    $validDistances = ['all', 'medium', 'close'];
    if (!in_array($distance, $validDistances, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungueltiger Distanzwert. Erlaubt: all, medium, close']);
        exit;
    }

    // Basis-SQL
    $sql = "SELECT * FROM asteroids WHERE DATE(timestamp) = :date";

    // Distanzfilter
    if ($distance === 'medium') {
        $sql .= " AND distance_km < 100000000";
    } elseif ($distance === 'close') {
        $sql .= " AND distance_km < 50000000";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['date' => $date]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Verbindung zur Datenbank konnte nicht hergestellt werden: ' . $e->getMessage()]);
}
