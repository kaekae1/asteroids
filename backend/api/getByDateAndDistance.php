<?php
// datenbank zugangsdaten einbinden
require_once '../config.php';

header('Content-Type: application/json');

// --> verbinden mit datenbank
try {
    //--> login datenbank
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // GET-Parameter validieren
    if (!isset($_GET['date']) || !isset($_GET['distance'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Parameter: date und distance erforderlich']);
        exit;
    }
    
    $date = $_GET['date'];
    $distance = $_GET['distance'];
    
    // Datum validieren (Format YYYY-MM-DD)
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültiges Datumsformat. Erwartet: YYYY-MM-DD']);
        exit;
    }
    
    // Distanz validieren
    $validDistances = ['all', 'medium', 'close'];
    if (!in_array($distance, $validDistances)) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültiger Distanzwert. Erlaubt: all, medium, close']);
        exit;
    }
    
    // SQL-Query basierend auf Distanzfilter aufbauen
    $sql = "SELECT * FROM asteroids WHERE DATE(timestamp) = :date";
    
    if ($distance === 'medium') {
        $sql .= " AND distance_km < 100000000";
    } elseif ($distance === 'close') {
        $sql .= " AND distance_km < 50000000";
    }
    // bei 'all' keine zusätzliche Bedingung
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['date' => $date]);
    $results = $stmt->fetchAll();
    
    //--> daten als json zurückgeben
    echo json_encode($results);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Verbindung zur Datenbank konnte nicht hergestellt werden: ' . $e->getMessage()]);
}
?>
