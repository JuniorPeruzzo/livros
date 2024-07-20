class ProductsEvents {
	clickSaveButtonProduct() {
		const button = document.getElementById("saveButton");

		button.addEventListener("click", (event) => {
			debugger;
			let nome = document.getElementById("name");
			let situacao = document.getElementById("situation");
			let descricao = document.getElementById("description");
			let unidade = document.getElementById("unit");
			let preco = document.getElementById("price");
			let estoque = document.getElementById("stock");

			if (nome.value === "" && preco.value === "") {
				Swal.fire({
					title: "Atenção!",
					text: "Você precisa informar um nome e um preço para o livro",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			if (nome.value === "") {
				Swal.fire({
					title: "Atenção!",
					text: "Você precisa informar um nome para o livro",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			if (preco.value === "") {
				event.preventDefault();
				Swal.fire({
					title: "Atenção!",
					text: "Você precisa informar um preço para o livro",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			if (preco.value <= 0) {
				event.preventDefault();
				Swal.fire({
					title: "Atenção!",
					text: "O valor do livro precisa ser maior que zero",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			let formData = new FormData();
			formData.append("nome", nome.value);
			formData.append("descricao", descricao.value);
			formData.append("preco", preco.value);
			formData.append("unidadeMedida", unidade.value);
			formData.append("situacao", situacao.value);
			formData.append("estoque", estoque.value);

			let productID = getProductIdFromUrl();

			if (productID) {
				fetch("cadastrarProduto.php?idProductUpdate=" + productID, {
					method: "POST",
					body: formData,
				})
					.then((response) => response.json())
					.then((responseBody) => {
						if (responseBody.type === "success") {
							Swal.fire({
								title: "Sucesso!",
								text: responseBody.message,
								icon: "success",
								confirmButtonText: "Ok",
							}).then((result) => {
								if (result.value) {
									window.location.href = "produtos.php";
								}
							});
						} else if (responseBody.type === "error") {
							event.preventDefault();
							Swal.fire({
								title: "Erro!",
								text: responseBody.message,
								icon: "warning",
								confirmButtonText: "Ok",
							});
						}

						return responseBody;
					})
					.catch((err) => {
						console.log("Não foi possível realizar a requisição: ", err);
					});
			} else {
				fetch("cadastrarProduto.php", {
					method: "POST",
					body: formData,
				})
					.then((response) => response.json())
					.then((responseBody) => {
						if (responseBody.type === "success") {
							Swal.fire({
								title: "Sucesso!",
								text: responseBody.message,
								icon: "success",
								confirmButtonText: "Ok",
							}).then((result) => {
								if (result.value) {
									window.location.href = "produtos.php";
								}
							});
						} else if (responseBody.type === "error") {
							event.preventDefault();
							Swal.fire({
								title: "Erro!",
								text: responseBody.message,
								icon: "warning",
								confirmButtonText: "Ok",
							});
						}

						return responseBody;
					})
					.catch((err) => {
						console.log("Não foi possível realizar a requisição: ", err);
					});
			}
		});
	}
}

window.onload = function () {
	var events = new ProductsEvents();
	events.clickSaveButtonProduct();
};

//Controle de atualização de livros

function getProductIdFromUrl() {
	const params = new URLSearchParams(window.location.search);
	return params.get("id");
}

function fetchProductById(id) {
	let nome = document.getElementById("name");
	let situacao = document.getElementById("situation");
	let descricao = document.getElementById("description");
	let unidade = document.getElementById("unit");
	let preco = document.getElementById("price");
	let estoque = document.getElementById("stock");

	fetch("cadastrarProduto.php?idProduct=" + id, {
		method: "GET",
	})
		.then((response) => response.json())
		.then((responseBody) => {
			if (responseBody.totalRecords > 0) {
				let data = responseBody.data;

				nome.value = data.nome;
				situacao.value = data.situacao;
				descricao.value = data.descricao;
				unidade.value = data.unidadeMedida;
				preco.value = data.preco;
				estoque.value = data.estoque;
			}
		})
		.catch((err) => {
			console.log("Não foi possível realizar a requisição: ", err);
		});
}

fetchProductById(getProductIdFromUrl());
