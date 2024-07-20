<?php
include('../app/configProdutos.php');

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/reset.css">
    <link rel="stylesheet" href="assets/css/produtos.css">
    <link rel="icon" href="./assets/img/favicon.png" type="image/png">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>Livros</title>
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
        <span>Livros</span>
    </div>

    <main>
        <div class="filters">
            <input type="search" placeholder="Nome do livro" id="product_name" class="filter__name">
            <select class="filter__situation" id="situation">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
            </select>
            <select class="filter__orderBy" id="orderBy">
                <option value="" default>Ordenar por</option>
                <option value="nome">Nome</option>
                <option value="preco">Preço</option>
            </select>
            <button id="filterButton" type="submit" class="filter__button">Filtrar</button>
        </div>

        <div class="register">
            <button class="register__newProduct"><a href="cadastrarProduto.php">Novo Livro</a></button>
            <button class="register__deleteProduct">Excluir</button>
        </div>

        <div class="product__list">
            <table class="products__table">
                <thead class="invisible">
                    <tr>
                        <th><input class="select__product" type="checkbox" id="selectAll"></th>
                        <th>ID</th>
                        <th>Titulo</th>
                        <th>Preço</th>
                        <th>Situação</th>
                        <th>Estoque</th>
                    </tr>
                </thead>
                <tbody class="products_table__body">
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
    <script type="text/javascript" src="assets/js/produtos.js"></script>

</body>

</html>