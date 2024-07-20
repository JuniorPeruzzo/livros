class ProductsView {
	getProductData() {
		fetchAndDisplayData();
		cleanStorage();
	}

	displayProductData(data) {
		const tbody = document.querySelector(".products_table__body");
		tbody.innerHTML = "";

		data.forEach((element) => {
			let situacaoExibicao = "";

			if (element.situacao === "A") {
				situacaoExibicao = "Ativo";
			} else {
				situacaoExibicao = "Inativo";
			}

			tbody.innerHTML += `
            <tr class="tr_products" data-id="${element.id}">
                <td><input class="select__products" type="checkbox" data-id="${element.id}"></td>
                <td>${element.id}</td>
                <td class="product_name">${element.nome}</td>
                <td>R$ ${element.preco.toString().replace(".", ",")}</td>
                <td>${situacaoExibicao}</td>
                <td>${element.estoque}</td>
            </tr>
            `;
		});
	}

	displayEmptyData() {
		const tbody = document.querySelector(".products_table__body");
		tbody.innerHTML = "";

		tbody.innerHTML = `Nenhum registro encontrado.`;
	}
}

window.onload = function () {
	let eventsView = new ProductsView();
	eventsView.getProductData();
};

//Controle de exclusão de livros

let checkboxAllProducts = document.querySelector(".select__product");

checkboxAllProducts.addEventListener("click", () => {
	let checkboxProducts = document.querySelectorAll(".select__products");
	if (checkboxAllProducts.checked) {
		checkboxProducts.forEach((checkbox) => {
			checkbox.checked = true;
		});
	} else {
		checkboxProducts.forEach((checkbox) => {
			checkbox.checked = false;
		});
	}
});

let deleteButton = document.querySelector(".register__deleteProduct");

deleteButton.addEventListener("click", (event) => {
	let selectedProducts = [];
	let checkboxProducts = document.querySelectorAll(".select__products");

	checkboxProducts.forEach((checkbox) => {
		const id = checkbox.getAttribute("data-id");
		if (checkbox.checked) {
			if (!selectedProducts.includes(id)) {
				selectedProducts.push(id);
			}
		}
	});

	if (selectedProducts.length > 0) {
		Swal.fire({
			title: "Tem certeza que deseja excluir os livros selecionados?",
			text: "Esta ação não pode ser desfeita!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sim, excluir!",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				let existsSale = false;

				const deletePromises = selectedProducts.map((id) => {
					return fetch("produtos.php?id=" + id, {
						method: "DELETE",
					})
						.then((response) => response.json())
						.then((responseBody) => {
							if ((responseBody.type = "error")) {
								existsSale = true;
								event.preventDefault();
								Swal.fire({
									title: "Erro!",
									text: responseBody.message,
									icon: "warning",
									confirmButtonText: "Ok",
								});
								return false;
							}
						})
						.catch((err) => {
							console.error("Erro ao deletar livros:", err);
						});
				});

				Promise.all(deletePromises).then(() => {
					if (!existsSale) {
						Swal.fire("Excluído!", "Os livros foram excluídos com sucesso.", "success").then(() => {
							window.location.reload();
						});
					}
				});
			}
		});
	} else {
		console.log("Nenhum livro selecionado para deletar.");
	}
});

//Controle de atualização de livros

let table = document.querySelector(".products__table");

table.addEventListener("click", (event) => {
	let tr = event.target.closest("tr.tr_products");

	if (tr) {
		let td = event.target;
		if (!td.classList.contains("select__products")) {
			saveParamsToLocalStorage();
			let productId = tr.getAttribute("data-id");
			window.location.href = "cadastrarProduto.php?id=" + productId;
		}
	}
});

//Controle de filtros e paginação de livros

const firstPage = document.getElementById("first");
const lastPage = document.getElementById("last");
const nextPage = document.getElementById("next");
const prevPage = document.getElementById("prev");
const filterButton = document.getElementById("filterButton");
const selectPagesNumber = document.getElementById("pagesNumber");
const situation = document.getElementById("situation");
const orderBy = document.getElementById("orderBy");

const productsPerPage = 10;
let currentPage = 1;
let otherParams = "situation=ativo";
let totalPages = 0;

filterButton.addEventListener("click", () => {
	let productName = document.getElementById("product_name").value;

	let selectedOption = situation.options[situation.selectedIndex];
	let situationValue = selectedOption.value;

	let orderByOption = orderBy.options[orderBy.selectedIndex];
	let orderByValue = orderByOption.value;

	otherParams = "";

	if (productName.trim() !== "") {
		otherParams += "search=" + encodeURIComponent(productName) + "&";
	}

	if (orderByValue.trim() !== "") {
		otherParams += "orderBy=" + encodeURIComponent(orderByValue) + "&";
	}

	if (situationValue.trim() !== "") {
		otherParams += "situation=" + encodeURIComponent(situationValue);
	}

	currentPage = 1;
	fetchAndDisplayData();
});

firstPage.addEventListener("click", () => {
	if (currentPage !== 1) {
		currentPage = 1;
		fetchAndDisplayData();
	}
});

lastPage.addEventListener("click", () => {
	if (currentPage !== totalPages) {
		currentPage = totalPages;
		fetchAndDisplayData();
	}
});

nextPage.addEventListener("click", () => {
	const nextPageNumber = currentPage + 1;
	if (nextPageNumber <= totalPages) {
		currentPage = nextPageNumber;
		fetchAndDisplayData();
	}
});

prevPage.addEventListener("click", () => {
	const prevPageNumber = currentPage - 1;
	if (prevPageNumber >= 1) {
		currentPage = prevPageNumber;
		fetchAndDisplayData();
	}
});

function updatePageNumbers() {
	selectPagesNumber.innerHTML = "";

	for (let i = 1; i <= totalPages; i++) {
		const option = document.createElement("option");
		option.value = i;
		option.text = i;
		selectPagesNumber.appendChild(option);
	}

	selectPagesNumber.value = currentPage;

	selectPagesNumber.addEventListener("change", () => {
		let situationValue = selectPagesNumber.value;

		currentPage = situationValue;
		fetchAndDisplayData();
	});
}

function fetchAndDisplayData() {
	storedFilters = getFiltersFromLocalStorage();
	const productName = document.getElementById("product_name");

	if (Object.values(storedFilters).length !== 0 && storedFilters.currentPage !== null) {
		currentPage = storedFilters.currentPage;
		otherParams = `search=${encodeURIComponent(storedFilters.productName || "")}&orderBy=${encodeURIComponent(
			storedFilters.orderBy || ""
		)}&situation=${encodeURIComponent(storedFilters.situation || "ativo")}`;

		selectPagesNumber.value = storedFilters.currentPage;
		situation.value = storedFilters.situation;
		orderBy.value = storedFilters.orderBy;
		productName.value = storedFilters.productName;
	}

	const params = `page=${currentPage}&${otherParams}&perPage=${productsPerPage}`;
	fetch(`produtos.php?${params}`, {
		method: "GET",
	})
		.then((response) => response.json())
		.then((responseBody) => {
			const productsView = new ProductsView();

			if (responseBody.totalRecords > 0) {
				productsView.displayProductData(responseBody.data);
				totalPages = responseBody.perPage;
			} else {
				productsView.displayEmptyData();
				totalPages = 0;
			}

			updatePageNumbers();
		})
		.catch((err) => {
			console.log("Não foi possível realizar a requisição: ", err);
		});
}

//Controle de filtros e paginação no localStorage

const storageFilterKey = "filters";
const storagePageKey = "currentPage";

function saveParamsToLocalStorage() {
	const situation = document.getElementById("situation").value;
	const productName = document.getElementById("product_name").value;
	const orderBy = document.getElementById("orderBy").value;

	const filters = {
		situation,
		productName,
		orderBy,
	};

	localStorage.setItem(storageFilterKey, JSON.stringify(filters));
	localStorage.setItem(storagePageKey, JSON.stringify(currentPage));
}

function getFiltersFromLocalStorage() {
	const filterStorage = JSON.parse(localStorage.getItem(storageFilterKey));
	const currentPageStorage = JSON.parse(localStorage.getItem(storagePageKey));

	return { currentPage: currentPageStorage, ...filterStorage };
}

function cleanStorage() {
	localStorage.removeItem(storageFilterKey);
	localStorage.removeItem(storagePageKey);
}
