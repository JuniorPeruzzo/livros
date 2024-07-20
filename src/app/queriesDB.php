<?php

require_once('connectionDB.php');

class QueriesDB {
    private $conn;

    function __construct() {
        $connectionDB = new ConnectionDB;
        $this->conn = $connectionDB->connect();
    }

    function __destruct() {
        $this->closeConnection();
    }

    function insert(string $query, array $params): int {
        $insert = $this->conn->prepare($query);
        $insert->execute($params);
        $id = $this->conn->lastInsertId();

        return $id;
    }

    function update(string $query, array $params) {
        $update = $this->conn->prepare($query);
        $success = $update->execute($params);

        return $success;
    }

    function getAll(string $params): array {
        $fetched = $this->conn->query($params);
        $dados = $fetched->fetchAll();

        return $dados;
    }

    function getById(string $params): array {
        $fetched = $this->conn->query($params);
        $dados = $fetched->fetch();

        return $dados;
    }

    function delete(string $params) {
        $delete = $this->conn->prepare($params);
        $delete->execute();
    }

    function closeConnection(): void {
        $this->conn = null;
    }
}
