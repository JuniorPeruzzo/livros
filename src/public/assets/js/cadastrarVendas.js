class SaleEvents {
	clickSaveButtonSale() {
		const button = document.getElementById("saveSaleButton");

		button.addEventListener("click", (event) => {
			let nomeCliente = document.getElementById("customerName");
			let dataVenda = document.getElementById("saleDate");
			let percentualDesconto = document.getElementById("discount");

			const saleItemsData = [];

			const rows = saleProducts.querySelectorAll("tr");
			rows.forEach((row) => {
				const idProduto = row.dataset.id;
				const priceInput = row.querySelector(".td__input[type='text']");
				const amountInput = row.querySelector(".td__input[type='number']");
				const preco = parseFloat(priceInput.value);
				const quantidade = parseInt(amountInput.value, 10);

				saleItemsData.push({ idProduto, quantidade, preco });
			});

			let isValid = true;
			let errorMessage = "";

			saleItemsData.forEach((product) => {
				if (product.quantidade <= 0) {
					isValid = false;
					errorMessage = "Você precisa informar uma quantidade valida para os livros";
					return false;
				}
				if (product.preco <= 0) {
					isValid = false;
					errorMessage = "O preço dos livros precisa ser informado";
					return false;
				}
			});

			if (!isValid) {
				Swal.fire({
					title: "Atenção!",
					text: errorMessage,
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			if (percentualDesconto.value < 0 || percentualDesconto.value > 100) {
				Swal.fire({
					title: "Atenção!",
					text: "O desconto da venda precisa ser uma porcentagem entre 0 e 100",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			if (customerName.value.trim() === "" && saleItemsData.length === 0) {
				Swal.fire({
					title: "Atenção!",
					text: "Você precisa informar o nome do cliente e pelo menos um livro na venda",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			if (customerName.value.trim() === "") {
				Swal.fire({
					title: "Atenção!",
					text: "Você precisa informar o nome do cliente",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			if (saleItemsData.length === 0) {
				Swal.fire({
					title: "Atenção!",
					text: "Você precisa inserir pelo menos um livro na venda",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			if (saleDate.value === null || saleDate.value === undefined || saleDate.value.trim() === "") {
				Swal.fire({
					title: "Atenção!",
					text: "Você precisa informar a data da venda",
					icon: "warning",
					confirmButtonText: "Ok",
				});
				return false;
			}

			let formData = new FormData();
			formData.append("nomeCliente", nomeCliente.value);
			formData.append("dataVenda", dataVenda.value);
			formData.append("percentualDesconto", percentualDesconto.value);
			formData.append("vendaItem", JSON.stringify(saleItemsData));

			let saleId = getSaleIdFromUrl();
			if (saleId) {
				fetch("cadastrarVenda.php?idSaleUpdate=" + saleId, {
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
									window.location.href = "vendas.php";
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
				fetch("cadastrarVenda.php?saleRegister=true", {
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
									window.location.href = "vendas.php";
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

	getProductsSaleList() {
		const selectSaleProduct = document.getElementById("selectProduct");

		fetch("cadastrarVenda.php?situation=a", {
			method: "GET",
		})
			.then((response) => response.json())
			.then((responseBody) => {
				if (responseBody.totalRecords > 0) {
					selectSaleProduct.innerHTML = "";

					responseBody.data.forEach((item) => {
						selectSaleProduct.innerHTML += `<option value="${item.id}" data-preco="${item.preco}">${item.nome}</option>`;
					});
				}
			});
	}
}

window.onload = function () {
	var events = new SaleEvents();
	events.clickSaveButtonSale();
	events.getProductsSaleList();
};

document.addEventListener("DOMContentLoaded", () => {
	const saleDate = document.getElementById("saleDate");

	const currentDate = new Date();
	currentDate.setHours(currentDate.getHours() - 3);

	const formattedDate = currentDate.toISOString().slice(0, 10);
	saleDate.value = formattedDate;
});

//Controle de itens da venda

const addSaleProduct = document.getElementById("addProduct");
const saleProducts = document.getElementById("saleProducts");

addSaleProduct.addEventListener("click", () => {
	const selectedOption = selectProduct.options[selectProduct.selectedIndex];
	const productName = selectedOption.textContent;
	const productId = selectedOption.value;
	const productPrice = selectedOption.getAttribute("data-preco");

	if (productId) {
		const existingRow = saleProducts.querySelector(`tr[data-id="${productId}"]`);

		if (existingRow) {
			const productAmountInput = existingRow.querySelector(".td__input");
			const currentAmount = parseInt(productAmountInput.value, 10);
			productAmountInput.value = currentAmount + 1;
		} else {
			const productAmout = 1;

			const newRow = document.createElement("tr");
			newRow.dataset.id = productId;

			newRow.innerHTML += `
            <td>${productName}</td>
            <td><input id="productAmout" class="td__input" type="number" value="${productAmout}" min="1"></td>
            <td><input id="productPrice" class="td__input" type="text" value="${productPrice
							.toString()
							.replace(".", ",")}"></td>
            <td><button id="deleteSaleProduct" class="sale_fields__deleteProduct">Excluir</button></td>
            `;

			saleProducts.appendChild(newRow);
		}
	}
	updateSaleValues();
});

saleProducts.addEventListener("click", (event) => {
	if (event.target.classList.contains("sale_fields__deleteProduct")) {
		const productDelete = event.target.closest("tr");
		if (productDelete) {
			productDelete.remove();
		}
		updateSaleValues();
	}

	const priceInput = document.querySelectorAll(".td__input[type='text']");
	const amountInput = document.querySelectorAll(".td__input[type='number']");

	priceInput.forEach((itemPrice) => {
		itemPrice.addEventListener("blur", updateSaleValues);
	});

	amountInput.forEach((itemAmout) => {
		itemAmout.addEventListener("blur", updateSaleValues);
	});
});

//Controle de valores da venda

function calculateSubtotal() {
	const rows = saleProducts.querySelectorAll("tr");
	let subtotal = 0;

	rows.forEach((row) => {
		const priceInput = row.querySelector(".td__input[type='text']");
		const amountInput = row.querySelector(".td__input[type='number']");
		const price = parseFloat(priceInput.value);
		const quantity = parseInt(amountInput.value, 10);
		subtotal += price * quantity;
	});

	return subtotal;
}

function calculateTotalPrice() {
	const subtotal = calculateSubtotal();
	const discountInput = document.getElementById("discount");
	const discount = parseFloat(discountInput.value) || 0;
	const totalPrice = subtotal - (subtotal * discount) / 100;

	return totalPrice;
}

function updateSaleValues() {
	const subtotalInput = document.getElementById("subtotal");
	const totalPriceInput = document.getElementById("totalPrice");

	const subtotal = calculateSubtotal();
	const totalPrice = calculateTotalPrice();

	subtotalInput.value = subtotal.toFixed(2);
	totalPriceInput.value = totalPrice.toFixed(2);
}

const discountSale = document.getElementById("discount");

discountSale.addEventListener("input", () => {
	updateSaleValues();
});

// Controle de atualização de vendas

function getSaleIdFromUrl() {
	const params = new URLSearchParams(window.location.search);
	return params.get("id");
}

function fetchSaleById(id) {
	let nomeCliente = document.getElementById("customerName");
	let dataVenda = document.getElementById("saleDate");
	let subtotal = document.getElementById("subtotal");
	let percentualDesconto = document.getElementById("discount");
	let totalComDesconto = document.getElementById("totalPrice");

	fetch("cadastrarVenda.php?saleId=" + id, {
		method: "GET",
	})
		.then((response) => response.json())
		.then((responseBody) => {
			if (responseBody.totalRecords > 0) {
				const data = responseBody.data[0];

				nomeCliente.value = data.nomeCliente;
				dataVenda.value = data.dataVenda;
				subtotal.value = data.subtotal;
				percentualDesconto.value = data.percentualDesconto;
				totalComDesconto.value = data.totalComDesconto;

				let items = responseBody.data.items;

				items.forEach((item) => {
					const productName = item.nomeProduto;
					const productAmount = item.quantidade;
					const productPrice = item.preco;

					const newRow = document.createElement("tr");
					newRow.dataset.id = item.idProduto;

					newRow.innerHTML += `
                        <td>${productName}</td>
                        <td><input id="productAmout" class="td__input" type="number" value="${productAmount}" min="1"></td>
                        <td><input id="productPrice" class="td__input" type="text" value="${productPrice}"></td>
                        <td><button id="deleteSaleProduct" class="sale_fields__deleteProduct">Excluir</button></td>
                    `;

					saleProducts.appendChild(newRow);
				});
			}
		})
		.catch((err) => {
			console.log("Não foi possível realizar a requisição: ", err);
		});
}

fetchSaleById(getSaleIdFromUrl());
