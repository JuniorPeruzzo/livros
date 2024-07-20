<?php

require_once('../app/queriesDB.php');

function getProductsSaledb(): array {

    $queryDB = new QueriesDB();
    $query = "SELECT * FROM produtos WHERE situacao = 'A'";

    $dados = $queryDB->getAll($query);

    return $dados;
}

function registerSaledb(array $dados): int {
    $queryDB = new QueriesDB();
    $query = 'INSERT INTO vendas (nomeCliente, dataVenda, subtotal, percentualDesconto, totalComDesconto) 
            VALUES (?, ?, ?, ?, ?)';
    $values = [
        $dados['nomeCliente'],
        $dados['dataVenda'],
        $dados['subtotal'],
        $dados['percentualDesconto'],
        $dados['totalComDesconto']
    ];

    $execute = $queryDB->insert($query, $values);

    return $execute;
}

function registerSaleItemsdb(array $dados): array {
    $queryDB = new QueriesDB();
    $query = 'INSERT INTO venda_item (idVenda, idProduto, quantidade, preco) 
            VALUES (?, ?, ?, ?)';
    $values = [
        $dados['idVenda'],
        $dados['idProduto'],
        $dados['quantidade'],
        $dados['preco']
    ];

    $execute = $queryDB->insert($query, $values);

    return ['id' => $execute];
}

function getSalesDatadb(array $queryParams, int $currentPage, int $salesPerPage): array {
    $queryDB = new QueriesDB();
    $query = 'SELECT *, (SELECT COUNT(*) FROM vendas WHERE 1';


    foreach ($queryParams as $param => $value) {
        if ($param === 'name') {
            $query .= " AND nomeCliente LIKE '%$value%'";
        } else if ($param === 'startDate' && isset($queryParams['endDate'])) {
            $query .= " AND dataVenda BETWEEN '{$value}' AND '{$queryParams['endDate']}'";
        }
    }

    $query .= ') as totalRecords FROM vendas WHERE  1';

    foreach ($queryParams as $param => $value) {
        if ($param === 'name') {
            $query .= " AND nomeCliente LIKE '%$value%'";
        } else if ($param === 'startDate' && isset($queryParams['endDate'])) {
            $query .= " AND dataVenda BETWEEN '{$value}' AND '{$queryParams['endDate']}'";
        } else if ($param === 'orderBy') {
            $query .= " ORDER BY $value";
        }
    }

    $offset = ($currentPage - 1) * $salesPerPage;
    $query .= " LIMIT $offset, $salesPerPage";

    $dados = $queryDB->getAll($query);
    $totalRecords = 0;

    if (!empty($dados)) {
        $totalRecords =  $dados[0]['totalRecords'];
    }

    $perPage = ceil($totalRecords / $salesPerPage);

    return [
        'perPage' => $perPage,
        'totalRecords' => $totalRecords,
        'data' => $dados
    ];
}

function getSaleDatadb(int $saleId): array {
    $queryDB = new QueriesDB();
    $dados = $queryDB->getAll('SELECT
    v.id AS idVenda,
    v.nomeCliente,
    v.dataVenda,
    v.subtotal,
    v.percentualDesconto,
    v.totalComDesconto
    FROM vendas AS v
    WHERE v.id = ' . $saleId);

    return $dados;
}

function getSaleItemsdb(int $saleId): array {
    $queryDB = new QueriesDB();
    $dados = $queryDB->getAll('SELECT
    vi.idVenda,
    vi.idProduto,
    vi.quantidade,
    vi.preco,
    p.nome AS nomeProduto
    FROM venda_item AS vi
    JOIN produtos AS p ON vi.idProduto = p.id
    WHERE vi.idVenda = ' . $saleId);

    return $dados;
}

function deleteSalesdb(int $saleId): void {
    $queryDB = new QueriesDB();
    $queryDB->delete('DELETE FROM vendas WHERE id = ' . $saleId);
}

function updateSaledb(array $data, int $saleId): bool {
    $queryDB = new QueriesDB();
    $query = 'UPDATE vendas 
    SET nomeCliente = ?, dataVenda = ?, subtotal = ?, percentualDesconto = ?, totalComDesconto = ? 
    WHERE id = ?';
    $values = [
        $data['nomeCliente'],
        $data['dataVenda'],
        $data['subtotal'],
        $data['percentualDesconto'],
        $data['totalComDesconto'],
        $saleId
    ];

    $success = $queryDB->update($query, $values);

    return $success;
}

function updateSaleItemsdb(array $saleItems, int $saleId): bool {
    $queryDB = new QueriesDB();

    $checksItems = $queryDB->getAll('SELECT * FROM venda_item WHERE idVenda = ' . $saleId);

    foreach ($checksItems as $checksItem) {
        $productId = $checksItem['idProduto'];
        $productIdExists = false;

        foreach ($saleItems as $saleItem) {
            if ($saleItem['idProduto'] == $productId) {
                $productIdExists = true;
                break;
            }
        }

        if (!$productIdExists) {
            $previousQuantity = $checksItem['quantidade'];
            stockControl(0, $checksItem['idProduto'],  $previousQuantity);
            $queryDB->delete('DELETE FROM venda_item WHERE idProduto = ' . $productId . ' AND idVenda = ' . $saleId);
        }
    }

    foreach ($saleItems as $saleItem) {
        $quantidade = $saleItem['quantidade'];
        $preco = $saleItem['preco'];

        $checksItem = $queryDB->getAll('SELECT * FROM venda_item WHERE idProduto = ' . $saleItem['idProduto'] . ' AND idVenda = ' . $saleId);

        if ($checksItem) {
            $query = "UPDATE venda_item SET quantidade = ?, preco = ?
            WHERE idVenda = ?" .
                " AND idProduto = ?";
            $values = [$quantidade, $preco, $saleId, $saleItem['idProduto']];

            $previousQuantity = $checksItem[0]['quantidade'];

            if ($previousQuantity !== $quantidade) {
                stockControl($quantidade, $saleItem['idProduto'],  $previousQuantity);
            }

            $success = $queryDB->update($query, $values);
        } else {
            $newSaleItemData = [
                'idVenda' => $saleId,
                'idProduto' => $saleItem['idProduto'],
                'quantidade' => $quantidade,
                'preco' => $preco
            ];
            $newProduct = registerSaleItemsdb($newSaleItemData);
            stockControl($newSaleItemData['quantidade'],  $newSaleItemData['idProduto']);
            $success = !empty($newProduct) ? true : false;
        }
    }

    return $success;
}

function stockControl(int $quantitySold = 0, int $id, int $previousQuantity = 0) {
    $queryDB = new QueriesDB();

    if ($previousQuantity > 0) {
        $stock = $queryDB->getById('SELECT estoque FROM produtos WHERE id = ' . $id);

        $previousStock = intval($stock['estoque']) + $previousQuantity;

        $query = 'UPDATE produtos 
        SET estoque = ? 
        WHERE id = ?';
        $values = [
            $previousStock,
            $id
        ];

        $success = $queryDB->update($query, $values);
    }

    if ($quantitySold > 0) {
        $currentStock = $queryDB->getById('SELECT estoque FROM produtos WHERE id = ' . $id);

        $newStock = intval($currentStock['estoque']) - $quantitySold;

        $query = 'UPDATE produtos 
        SET estoque = ? 
        WHERE id = ?';
        $values = [
            $newStock,
            $id
        ];

        $success = $queryDB->update($query, $values);
    }

    return $success;
}
