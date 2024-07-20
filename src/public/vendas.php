<?php
include('../app/configVendas.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/reset.css">
    <link rel="stylesheet" href="assets/css/vendas.css">
    <link rel="icon" href="./assets/img/favicon.png" type="image/png">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>Vendas</title>
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
        <span>Vendas</span>
    </div>

    <main>
        <div class="sales_filters">
            <input type="search" placeholder="Nome do cliente" id="customer_name" class="sales_filters__name">
            <select class="sales_filters__orderBy" id="salesOrderBy">
                <option value="" default>Ordenar Por</option>
                <option value="totalComDesconto">Valor total</option>
            </select>
            <label for="start-date">Data inicial:</label>
            <input class="sales_filters__date" type="date" id="start-date">

            <label for="end-date">Data final:</label>
            <input class="sales_filters__date" type="date" id="end-date">

            <button id="filtersButton" type="submit" class="sales_filters__button">Filtrar</button>
        </div>

        <div class="sales_register">
            <button class="sales_register__newSale"><a href="cadastrarVenda.php">Nova venda</a></button>
            <button class="sales_register__deleteSale">Excluir</button>
        </div>

        <div class="sales_list">
            <table class="sales__table">
                <thead>
                    <tr>
                        <th><input class="select__sales" type="checkbox" id="selectAllSales"></th>
                        <th>Número</th>
                        <th>Nome do cliente</th>
                        <th>Data</th>
                        <th>Valor total</th>
                    </tr>
                </thead>
                <tbody class="sales_table__body">
                </tbody>
            </table>
        </div>
        <div class="pagination">
            <ul>
                <li><a id="first" class="prev">Primeira</a></li>
                <li><a id="prev" class="prev">&#60;</a></li>
                <li>
                    <select id="pagesNumber" class="page-number">
                    </select>
                </li>
                <li><a id="next" class="next">&#62;</a></li>
                <li><a id="last" class="next">Última</a></li>
            </ul>
        </div>
    </main>
    <script type="text/javascript" src="assets/js/vendas.js"></script>
</body>

</html>