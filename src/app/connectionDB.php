<?php

class ConnectionDB {

    public $conn;

    function connect() {
        $host = 'livros-mysql';
        $database = 'livros';
        $username = 'root';
        $password = 'livros1234';

        try {
            $qs = "mysql:host=$host;dbname=$database";
            $this->conn = new PDO($qs, $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            return $this->conn;
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }
}