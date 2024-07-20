<?php
include('../app/configProdutos.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/reset.css">
    <link rel="stylesheet" href="assets/css/cadastrarProduto.css">
    <link rel="icon" href="./assets/img/favicon.png" type="image/png">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>Cadastro de Livros</title>
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
        <span><a href="produtos.php">Livros</a></span> &#62;
        <span>Cadastro de Livros</span>
    </div>

    <main>
        <form class="fields">
            <div class="fields__div">
                <label for="name">Titulo<span>*</span></label>
                <input class="field__name" type="text" id="name" required>

                <label for="situation">Situação<span>*</span></label>
                <select class="field__situation" id="situation" required>
                    <option value="A">Ativo</option>
                    <option value="I">Inativo</option>
                </select>
            </div>

            <label for="description">Descrição</label>
            <textarea class="field__description" id="description" rows="6"></textarea>

            <div class="fields__div">
                <label for="unit">Autor</label>
                <input class="field__unit" type="text" id="unit">

                <label for="price">Preço<span>*</span></label>
                <input class="field__price" type="number" id="price">

                <label for="stock">Estoque</label>
                <input class="field__stock" type="number" id="stock">
            </div>

            <div class="buttons">
                <button type="button" class="cancel"><a href="produtos.php">Cancelar</a></button>
                <button id="saveButton" type="button">Salvar</button>
            </div>
        </form>
    </main>
    <script type="text/javascript" src="assets/js/cadastrarProduto.js"></script>
</body>

</html>