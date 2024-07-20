CREATE SCHEMA IF NOT EXISTS `livros` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `livros`;

CREATE TABLE IF NOT EXISTS `livros`.`produtos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `preco` DECIMAL(11,2) NOT NULL,
    `unidadeMedida` VARCHAR(255) NULL,
    `situacao` CHAR(1) NOT NULL, 
	PRIMARY KEY (`id`));

ALTER TABLE produtos ADD estoque INT;

CREATE TABLE IF NOT EXISTS `livros`.`vendas` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nomeCliente` VARCHAR(255) NOT NULL,
    `dataVenda` DATE NOT NULL,
    `subtotal` DECIMAL (11,2) NOT NULL,
    `percentualDesconto` INT NOT NULL,
    `totalComDesconto` DECIMAL(11,2) NOT NULL,
	PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `livros`.`venda_item` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`idVenda` INT NOT NULL,
    `idProduto` INT NOT NULL,
    `quantidade` INT NOT NULL,
    `preco` DECIMAL(11,2) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (idVenda) REFERENCES vendas (id),
    FOREIGN KEY (idProduto) REFERENCES produtos (id));

ALTER TABLE venda_item
    DROP FOREIGN KEY venda_item_ibfk_1,
    ADD FOREIGN KEY (idVenda) REFERENCES vendas(id) ON DELETE CASCADE;
