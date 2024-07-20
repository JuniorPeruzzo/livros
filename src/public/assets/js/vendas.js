class SalesView {
	getSaleData() {
		fetchAndDisplayDataSales();
		cleanStorage();
	}

	displaySaleData(data) {
		const tbody = document.querySelector(".sales_table__body");
		tbody.innerHTML = "";

		data.forEach((element) => {
			data = new Date(element.dataVenda);
			let formattedData = data.toLocaleDateString("pt-BR", { timeZone: "UTC" });

			tbody.innerHTML += `
            <tr class="tr_sales" data-id="${element.id}">
                <td><input class="select__sale" type="checkbox" data-id="${element.id}"></td>
                <td>${element.id}</td>
                <td class="customer_name">${element.nomeCliente}</td>
                <td>${formattedData}</td>
                <td>R$ ${element.totalComDesconto.toString().replace(".", ",")}</td>
            </tr>
            `;
		});
	}

	displayEmptyData() {
		const tbody = document.querySelector(".sales_table__body");
		tbody.innerHTML = "";

		tbody.innerHTML = `Nenhum registro encontrado.`;
	}
}

window.onload = function () {
	let eventsView = new SalesView();
	eventsView.getSaleData();
};

function fetchAndDisplayDataSales() {
	storedFilters = getFiltersFromLocalStorage();
	const customerName = document.getElementById("customer_name");

	if (Object.values(storedFilters).length !== 0 && storedFilters.currentPage !== null) {
		currentPage = storedFilters.currentPage;

		if (storedFilters.customerName) {
			otherParams += `search=${encodeURIComponent(storedFilters.customerName)}&`;
		}
		if (storedFilters.startDate) {
			otherParams += `startDate=${encodeURIComponent(storedFilters.startDate)}&`;
		}
		if (storedFilters.endDate) {
			otherParams += `endDate=${encodeURIComponent(storedFilters.endDate)}&`;
		}
		if (storedFilters.salesOrderBy) {
			otherParams += `orderBy=${encodeURIComponent(storedFilters.salesOrderBy)}&`;
		}

		selectPagesNumber.value = storedFilters.currentPage;
		startDate.value = storedFilters.startDate;
		endDate.value = storedFilters.endDate;
		salesOrderBy.value = storedFilters.salesOrderBy;
		customerName.value = storedFilters.customerName;
	}

	const params = `page=${currentPage}&${otherParams}&perPage=${salesPerPage}`;
	fetch(`vendas.php?${params}`, {
		method: "GET",
	})
		.then((response) => response.json())
		.then((responseBody) => {
			const salesView = new SalesView();

			if (responseBody.totalRecords > 0) {
				salesView.displaySaleData(responseBody.data);
				totalPages = responseBody.perPage;
			} else {
				salesView.displayEmptyData();
				totalPages = 0;
			}

			updatePageNumbers();
		})
		.catch((err) => {
			console.log("Não foi possível realizar a requisição: ", err);
		});
}

//Controle de atualização de vendas

let salesTable = document.querySelector(".sales__table");

salesTable.addEventListener("click", (event) => {
	let tr = event.target.closest("tr.tr_sales");

	if (tr) {
		let td = event.target;
		if (!td.classList.contains("select__sale")) {
			saveParamsToLocalStorage();
			let saleId = tr.getAttribute("data-id");
			window.location.href = "cadastrarVenda.php?id=" + saleId;
		}
	}
});

//Controle de exclusão de vendas

let checkboxAllSales = document.querySelector(".select__sales");

checkboxAllSales.addEventListener("click", () => {
	let checkboxSales = document.querySelectorAll(".select__sale");
	if (checkboxAllSales.checked) {
		checkboxSales.forEach((checkbox) => {
			checkbox.checked = true;
		});
	} else {
		checkboxSales.forEach((checkbox) => {
			checkbox.checked = false;
		});
	}
});

let deleteButton = document.querySelector(".sales_register__deleteSale");

deleteButton.addEventListener("click", (event) => {
	let selectedSales = [];
	let checkboxSales = document.querySelectorAll(".select__sale");

	checkboxSales.forEach((checkbox) => {
		const id = checkbox.getAttribute("data-id");
		if (checkbox.checked) {
			if (!selectedSales.includes(id)) {
				selectedSales.push(id);
			}
		}
	});

	if (selectedSales.length > 0) {
		Swal.fire({
			title: "Tem certeza que deseja excluir as vendas selecionadas?",
			text: "Esta ação não pode ser desfeita!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sim, excluir!",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				const deletePromises = selectedSales.map((id) => {
					return fetch("vendas.php?id=" + id, {
						method: "DELETE",
					})
						.then((response) => response.json())
						.then((responseBody) => {
							if ((responseBody.type = "error")) {
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
					Swal.fire("Excluído!", "As vendas foram excluídas com sucesso.", "success").then(() => {
						window.location.reload();
					});
				});
			}
		});
	} else {
		console.log("Nenhuma venda foi selecionada para deletar.");
	}
});

// Controle de filtros de vendas

const firstPage = document.getElementById("first");
const lastPage = document.getElementById("last");
const nextPage = document.getElementById("next");
const prevPage = document.getElementById("prev");
const selectPagesNumber = document.getElementById("pagesNumber");
const filterButton = document.getElementById("filtersButton");
const salesOrderBy = document.getElementById("salesOrderBy");
const startDate = document.getElementById("start-date");
const endDate = document.getElementById("end-date");

const salesPerPage = 10;
let currentPage = 1;
let otherParams = "";
let totalPages = 0;

filterButton.addEventListener("click", () => {
	let customerName = document.getElementById("customer_name").value;

	let orderByOption = salesOrderBy.options[salesOrderBy.selectedIndex];
	let orderByValue = orderByOption.value;

	otherParams = "";

	if (customerName.trim() !== "") {
		otherParams += "search=" + encodeURIComponent(customerName) + "&";
	}

	if (orderByValue.trim() !== "") {
		otherParams += "orderBy=" + encodeURIComponent(orderByValue) + "&";
	}

	if (startDate.value.trim() !== "") {
		otherParams += "startDate=" + encodeURIComponent(startDate.value) + "&";
	}

	if (endDate.value.trim() !== "") {
		otherParams += "endDate=" + encodeURIComponent(endDate.value);
	}

	if (startDate.value.trim() !== "" && endDate.value.trim() === "") {
		Swal.fire({
			title: "Atenção!",
			text: "Você precisa informar uma data final para a consulta",
			icon: "warning",
			confirmButtonText: "Ok",
		});
	}

	if (startDate.value.trim() === "" && endDate.value.trim() !== "") {
		Swal.fire({
			title: "Atenção!",
			text: "Você precisa informar uma data inicial para a consulta",
			icon: "warning",
			confirmButtonText: "Ok",
		});
	}

	currentPage = 1;
	fetchAndDisplayDataSales();
});

firstPage.addEventListener("click", () => {
	if (currentPage !== 1) {
		currentPage = 1;
		fetchAndDisplayDataSales();
	}
});

lastPage.addEventListener("click", () => {
	if (currentPage !== totalPages) {
		currentPage = totalPages;
		fetchAndDisplayDataSales();
	}
});

nextPage.addEventListener("click", () => {
	const nextPageNumber = currentPage + 1;
	if (nextPageNumber <= totalPages) {
		currentPage = nextPageNumber;
		fetchAndDisplayDataSales();
	}
});

prevPage.addEventListener("click", () => {
	const prevPageNumber = currentPage - 1;
	if (prevPageNumber >= 1) {
		currentPage = prevPageNumber;
		fetchAndDisplayDataSales();
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
		fetchAndDisplayDataSales();
	});
}

//Controle de filtros e paginação de vendas no localStorage

const storageFilterKey = "filters";
const storagePageKey = "currentPage";

function saveParamsToLocalStorage() {
	const customerName = document.getElementById("customer_name").value;
	const startDate = document.getElementById("start-date").value;
	const endDate = document.getElementById("end-date").value;
	const salesOrderBy = document.getElementById("salesOrderBy").value;

	const filters = {
		customerName,
		startDate,
		endDate,
		salesOrderBy,
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
