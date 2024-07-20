<?php
include('../app/configVendas.php');
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/reset.css">
    <link rel="stylesheet" href="assets/css/cadastrarVenda.css">
    <link rel="icon" href="./assets/img/favicon.png" type="image/png">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>Cadastro de Venda</title>
</head>

<body>
    <header>
        <nav>
            <ul>
                <li><a href="produtos.php">Livros</a></li>
                <li><a href="vendas.php">Vendas</a></li>
            </ul>
        </nav>
    </header>

    <div class="breadcrumb">
        <a>...</a> &#62;
        <span><a href="vendas.php">Vendas</a></span> &#62;
        <span>Cadastro de Venda</span>
    </div>

    <main>
        <form class="sale_fields">
            <div>
                <label for="customerName">Nome do cliente<span>*</span></label>
                <input class="sale_fields__customerName" type="text" id="customerName" required>

                <label for="saleDate">Data</label>
                <input class="sale_fields__date" type="date" id="saleDate">
            </div>

            <div class="sale_fields__productsTable">
                <table>
                    <thead>
                        <tr>
                            <th>Livros</th>
                            <th>Quantidade</th>
                            <th>Preço Un.</th>
                        </tr>
                    </thead>
                    <tbody id="saleProducts" class="sale__products">
                    </tbody>
                </table>
            </div>

            <div class="sale_fields__newProduct">
                <select class="sale_fields__selectProduct" id="selectProduct">
                </select>
                <button id="addProduct" class="sale_fields__addProduct" type="button"> + Incluir Item</button>
            </div>

            <div class="sale_fields__values">
                <label for="subtotal">Subtotal</label>
                <input class="sale_fields__subtotal" type="number" id="subtotal" disabled>

                <label for="discount">Desconto(%)</label>
                <input class="sale_fields__discount" type="number" id="discount">

                <label for="totalPrice">Preço Total</label>
                <input class="sale_fields__totalPrice" type="number" id="totalPrice" disabled>
            </div>

            <div class="sale_buttons">
                <button type="button" class="sale_cancel"><a href="vendas.php">Cancelar</a></button>
                <button id="saveSaleButton" type="button">Salvar</button>
            </div>
        </form>
    </main>
    <script type="text/javascript" src="assets/js/cadastrarVendas.js"></script>
</body>

</html>