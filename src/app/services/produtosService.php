<?php

$method = $_SERVER['REQUEST_METHOD'];



if ($method === 'POST') {
    function registerProduct(): void {
        $nome = $_POST['nome'];
        $descricao = $_POST['descricao'];
        $preco = $_POST['preco'];
        $unidadeMedida = $_POST['unidadeMedida'];
        $situacao = $_POST['situacao'];
        $estoque = intval($_POST['estoque']);

        if (!empty($nome) && !empty($situacao) && !empty($preco) && $preco > 0) {

            $existingProducts = getProductByNamedb($nome);
            if (count($existingProducts) > 0 && (!isset($_GET['idProductUpdate']) || $existingProducts[0]['id'] !== $_GET['idProductUpdate'])) {
                echo json_encode([
                    'type' => 'error',
                    'message' => 'Um livro com o mesmo nome já existe.'
                ]);
                exit();
            }

            $productData = [
                'nome' => $nome,
                'descricao' => $descricao,
                'preco' => $preco,
                'unidadeMedida' => $unidadeMedida,
                'situacao' => $situacao,
                'estoque' => $estoque
            ];
            if (isset($_GET['idProductUpdate'])) {
                updateProductById($productData, $_GET['idProductUpdate']);
            } else {
                registerDataProductdb($productData);
            }
        } else {
            echo json_encode([
                'type' => 'error',
                'message' => 'Todos os requisitos precisam ser atendidos'
            ]);
        }

        echo json_encode([
            'type' => 'success',
            'message' => 'Seu livro foi salvo com sucesso'
        ]);
        exit();
    }
    registerProduct();
}

if ($method === 'GET' && isset($_GET['situation'])) {
    function getProducts(): void {
        $queryParams = [];
        $currentPage = $_GET['page'];
        $situation = " ";

        if ($_GET['situation'] == 'ativo') {
            $situation = "A";
        } else {
            $situation = "I";
        }

        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $queryParams['name'] = $_GET['search'];
        }

        if (isset($_GET['orderBy']) && !empty($_GET['orderBy'])) {
            $queryParams['orderBy'] = $_GET['orderBy'];
        }

        $data = getProductsDatadb($queryParams, $situation, $currentPage,  $_GET['perPage']);

        echo json_encode([
            'perPage' => $data['perPage'],
            'totalRecords' => $data['totalRecords'],
            'data' => $data['data']
        ]);
        exit();
    }

    getProducts();
}

if ($method === 'GET' && isset($_GET['idProduct'])) {
    function getProductById(): void {
        if (!empty($_GET['idProduct'])) {
            $idProduct = intval($_GET['idProduct']);
            $data = getProductByIdDb($idProduct);
            $totalRecords = count($data);
        }

        echo json_encode([
            'totalRecords' => $totalRecords,
            'data' => $data
        ]);
        exit();
    }

    getProductById();
}

if ($method === 'DELETE' && isset($_GET['id'])) {
    function deleteProduct(): void {

        if (!empty($_GET['id'])) {
            $existsSales = checkSaleItem($_GET['id']);
            $totalRecords = count($existsSales);

            if ($totalRecords == 0) {
                deleteProductsdb($_GET['id']);
            } else {
                $sales = "";
                foreach ($existsSales as $existsSale) {
                    $sales .= ", " . $existsSale['idVenda'];
                }
                echo json_encode([
                    'type' => 'error',
                    'message' => 'O livro id ' . $_GET['id'] . ' não pode ser excluido, pois esta vinculado a(os) pedido(s) de venda ' . $sales
                ]);
                exit();
            }
        }

        echo json_encode([
            'type' => 'success',
            'message' => 'Os livros foram excluídos com sucesso'
        ]);
    }
    deleteProduct();
}
