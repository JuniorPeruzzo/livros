<?php

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    function registerSale(): void {
        $nomeCliente = $_POST['nomeCliente'];
        $dataVenda = $_POST['dataVenda'];
        $percentualDesconto = $_POST['percentualDesconto'];
        $saleItems = json_decode($_POST['vendaItem'], true);

        $subtotalSale = 0;

        foreach ($saleItems as $saleItem) {
            $subtotalSale +=  $saleItem['preco'] * $saleItem['quantidade'];
        }

        if (!empty($nomeCliente) && !empty($dataVenda) && !empty($saleItems) && (intval($percentualDesconto) >= 0 && intval($percentualDesconto) < 100)) {

            $totalSalePrice = $subtotalSale - ($subtotalSale * intval($percentualDesconto)) / 100;

            $saleData = [
                'nomeCliente' => $nomeCliente,
                'dataVenda' => $dataVenda,
                'subtotal' => $subtotalSale,
                'percentualDesconto' => $percentualDesconto,
                'totalComDesconto' => $totalSalePrice
            ];

            if (isset($_GET['idSaleUpdate'])) {
                updateSaledb($saleData, $_GET['idSaleUpdate']);
                updateSaleItemsdb($saleItems, $_GET['idSaleUpdate']);
            } else {
                $saleId = registerSaledb($saleData);

                if ($saleId) {

                    foreach ($saleItems as $saleItem) {
                        $saleItemData = [
                            'idVenda' => $saleId,
                            'idProduto' => $saleItem['idProduto'],
                            'quantidade' => $saleItem['quantidade'],
                            'preco' => $saleItem['preco']
                        ];

                        registerSaleItemsdb($saleItemData);
                        stockControl($saleItem['quantidade'], $saleItem['idProduto']);
                    }
                }
            }
        } else {
            echo json_encode([
                'type' => 'error',
                'message' => 'Todos os requisitos precisam ser atendidos'
            ]);
        }

        echo json_encode([
            'type' => 'success',
            'message' => 'Venda salva com sucesso'
        ]);
        exit();
    }
    registerSale();
}

if ($method === 'GET' && isset($_GET['situation']) && $_GET['situation'] == "a") {
    function getProductsSale(): void {

        $data = getProductsSaledb($_GET['situation']);
        $totalRecords = count($data);

        echo json_encode([
            'totalRecords' => $totalRecords,
            'data' => $data
        ]);
        exit();
    }

    getProductsSale();
}


if ($method === 'GET' && isset($_GET['page'])) {
    function getSales(): void {
        $queryParams = [];
        $currentPage = $_GET['page'];

        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $queryParams['name'] = $_GET['search'];
        }

        if (isset($_GET['startDate']) && isset($_GET['endDate'])) {
            $queryParams['startDate'] = $_GET['startDate'];
            $queryParams['endDate'] = $_GET['endDate'];
        }

        if (isset($_GET['orderBy'])) {
            $queryParams['orderBy'] = $_GET['orderBy'];
        }


        $data = getSalesDatadb($queryParams, $currentPage, $_GET['perPage']);

        echo json_encode([
            'perPage' => $data['perPage'],
            'totalRecords' => $data['totalRecords'],
            'data' => $data['data']
        ]);
        exit();
    }

    getSales();
}

if ($method === 'GET' && isset($_GET['saleId'])) {
    function getSaleData(): void {

        if (!empty($_GET['saleId'])) {
            $saleId = intval($_GET['saleId']);
            $dataSale = getSaleDatadb($saleId);
            $dataSaleItems = getSaleItemsdb($saleId);
            $data = $dataSale;
            $data['items'] = $dataSaleItems;
            $totalRecords = count($data);
        }

        echo json_encode([
            'totalRecords' => $totalRecords,
            'data' => $data
        ]);
        exit();
    }

    getSaleData();
}

if ($method === 'DELETE' && isset($_GET['id'])) {
    function deleteSale(): void {

        if (!empty($_GET['id'])) {
            deleteSalesdb($_GET['id']);
        }

        echo json_encode([
            'type' => 'success',
            'message' => 'As vendas foram excluídas com sucesso'
        ]);
    }
    deleteSale();
}
