<?php

require_once('../app/queriesDB.php');

function registerDataProductdb(array $dados): array {
    $queryDB = new QueriesDB();
    $query = 'INSERT INTO produtos (nome, descricao, preco, unidadeMedida, situacao, estoque) 
            VALUES (?, ?, ?, ?, ?, ?)';
    $values = [
        $dados['nome'],
        $dados['descricao'],
        $dados['preco'],
        $dados['unidadeMedida'],
        $dados['situacao'],
        $dados['estoque']
    ];

    $execute = $queryDB->insert($query, $values);

    return ['id' => $execute];
}

function updateProductById(array $dados, int $id): bool {
    $queryDB = new QueriesDB();
    $query = 'UPDATE produtos 
    SET nome = ?, descricao = ?, preco = ?, unidadeMedida = ?, situacao = ?, estoque = ?
    WHERE id = ?';
    $values = [
        $dados['nome'],
        $dados['descricao'],
        $dados['preco'],
        $dados['unidadeMedida'],
        $dados['situacao'],
        $dados['estoque'],
        $id
    ];

    $success = $queryDB->update($query, $values);

    return $success;
}

function getProductsDatadb(array $queryParams, string $situation, int $page, int $productsPerPage): array {
    $queryDB = new QueriesDB();
    $query = "SELECT *, (SELECT COUNT(*) FROM produtos WHERE situacao = '$situation'";

    foreach ($queryParams as $param => $value) {
        if ($param === 'name') {
            $query .= " AND nome LIKE '%$value%'";
        }
    }

    $query .= ") AS totalRecords FROM produtos WHERE situacao = '$situation'";

    foreach ($queryParams as $param => $value) {
        if ($param === 'name') {
            $query .= " AND nome LIKE '%$value%'";
        }
        if ($param === 'orderBy') {
            $query .= " ORDER BY $value";
        }
    }

    $offset = ($page - 1) * $productsPerPage;
    $query .= " LIMIT $offset, $productsPerPage";

    $dados = $queryDB->getAll($query);
    $totalRecords = 0;

    if (!empty($dados)) {
        $totalRecords =  $dados[0]['totalRecords'];
    }

    $perPage = ceil($totalRecords / $productsPerPage);

    return [
        'perPage' => $perPage,
        'totalRecords' => $totalRecords,
        'data' => $dados
    ];
}

function getProductByNamedb(string $name): array {

    $queryDB = new QueriesDB();
    $query = "SELECT * FROM produtos WHERE nome = '$name'";

    $dados = $queryDB->getAll($query);

    return $dados;
}

function getProductByIdDb(int $id): array {
    $queryDB = new QueriesDB();
    $dados = $queryDB->getById('SELECT * FROM produtos WHERE id = ' . $id);

    return $dados;
}

function checkSaleItem(int $id): array {
    $queryDB = new QueriesDB();
    $dados = $queryDB->getAll('SELECT * FROM venda_item WHERE idProduto = ' . $id);

    return $dados;
}

function deleteProductsdb(int $id) {
    $queryDB = new QueriesDB();
    $queryDB->delete('DELETE FROM produtos WHERE id = ' . $id);
}
