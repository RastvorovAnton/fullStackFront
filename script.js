let whereText = null;
let howNumber = null;
let inputWhere = null;
let inputHow = null;

window.onload = () => {
	inputWhere = document.getElementById("input-where");
	inputHow = document.getElementById("input-how");
	inputWhere.addEventListener("change", updateWhereText);
	inputHow.addEventListener("change", updateHowText);
	render();
};

const dataPost = async (method = "", url = "", data = {}) => {
	const response = await fetch(url, {
		method,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify(data),
	});
	return response;
};

const updateWhereText = (event) => {
	whereText = event.target.value;
};

const updateHowText = (event) => {
	if (+event.target.value != 0) {
		howNumber = event.target.value;
	} else {
		inputHow.value = "";
		alert("Введите числовое значение больше 0!");
	}
};

const onButtonAddClick = async () => {
	if (whereText !== null && howNumber !== null) {
		dataPost("POST", "http://localhost:8000/newTicket", {
			text: whereText,
			cost: howNumber,
		})
			.then((data) => {
				render();
			})
			.catch((err) => {
				console.log(err);
			});
	} else alert("Введите данные!");
	whereText = null;
	howNumber = null;
	inputHow.value = "";
	inputWhere.value = "";
};

const onClickEdit = async (index, ticketArray) => {
	const { _id, text, cost, date } = ticketArray[index];
	let editText = text;
	let editCost = cost;
	let editDate = date;

	const container = document.getElementById(`ticket=${_id}`);
	container.className = "ticket-block edit-ticket-block";
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}

	const inputText = document.createElement("input");
	inputText.value = text;
	inputText.addEventListener("change", (event) => {
		editText = event.target.value;
	});

	const inputDate = document.createElement("input");
	inputDate.value = editDate.slice(0, 10);
	inputDate.type = "date";

	const inputCost = document.createElement("input");
	inputCost.value = cost;
	inputCost.addEventListener("change", (event) => {
		editCost = event.target.value;
	});

	inputDate.addEventListener("change", (event) => {
		editDate = event.target.value;
	});

	const editSendButton = document.createElement("button");
	editSendButton.innerText = "Edit";
	editSendButton.onclick = () => {
		if (
			editText.trim().length !== 0 &&
			editCost !== 0 &&
			editDate.trim().length !== 0
		) {
			if (+editCost) {
				dataPost("PATCH", "http://localhost:8000/updateTicket", {
					id: _id,
					text: editText,
					cost: editCost,
					date: editDate,
				}).then((data) => {
					render();
				})
					.catch((err) => {
						console.log(err);
					});
			} else alert("Введите числовое значение");
		} else alert("Введите данные");
	};

	const cancelButton = document.createElement("button");
	cancelButton.innerText = "Cancel";
	cancelButton.onclick = () => render();

	container.appendChild(inputText);
	container.appendChild(inputDate);
	container.appendChild(inputCost);
	container.appendChild(editSendButton);
	container.appendChild(cancelButton);
};

const onClickDelete = async (id) => {
	const resp = await fetch(`http://localhost:8000/deleteTicket?id=${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Access-Control-Allow-Origin": "*",
		},
	});
	render();
};

const render = async () => {
	const response = await fetch("http://localhost:8000/allTickets", {
		method: "GET",
	});

	const allUserSpending = await fetch(
		"http://localhost:8000/allUserSpending",
		{
			method: "GET",
		}
	);
	const result = await response.json();
	const ticketArray = result.data;

	const resultUserSpending = await allUserSpending.json();

	const contentBlock = document.getElementById("content-container");
	const totalWaste = document.getElementById("total-waste");

	totalWaste.innerText = `Итого: ${resultUserSpending.total} руб.`;
	while (contentBlock.firstChild) {
		contentBlock.removeChild(contentBlock.firstChild);
	}

	ticketArray.map((item, index) => {
		const { _id, text, cost, date } = item;
		const container = document.createElement("div");
		container.id = `ticket=${_id}`;
		container.className = "ticket-block";

		const ticketDelete = document.createElement("img");
		ticketDelete.src = "delete.png";
		ticketDelete.onclick = () => onClickDelete(_id);

		const divInfoBlock = document.createElement("div");
		divInfoBlock.className = "div-info-block";

		const divTextBlock = document.createElement("div");
		divTextBlock.className = "div-text-block";
		const textBlock = document.createElement("p");

		textBlock.addEventListener(
			"dblclick",
			 (doubleClick = (event) => {
				 onc = event.target.value;
				 render();
			 })
		);

		textBlock.innerText = `${index + 1}) ${text}`;
		divTextBlock.appendChild(textBlock);
		divInfoBlock.appendChild(divTextBlock);

		const divCostBlock = document.createElement("div");
		divCostBlock.className = "div-text-block";
		const costBlock = document.createElement("p");
		costBlock.ondblclick = () => onClickEdit(index, ticketArray)
		costBlock.innerText = `${cost} руб.`;

		const divDateBlock = document.createElement("div");
		divDateBlock.className = "div-date-block";
		const dateBlock = document.createElement("p");
		dateBlock.innerText = `${date.slice(8, 10)}-${date.slice(5, 7)}-${date.slice(0, 4)}`;
		dateBlock.ondblclick = () => onClickEdit(index, ticketArray)

		const divImgBlock = document.createElement("div");
		divImgBlock.className = "div-img-block";

		const ticketEdit = document.createElement("img");
		ticketEdit.src = "edit.png";
		ticketEdit.onclick = () => onClickEdit(index, ticketArray);

		divImgBlock.appendChild(ticketEdit);
		container.appendChild(divImgBlock);
		divImgBlock.appendChild(ticketDelete);
		divDateBlock.appendChild(dateBlock);
		divInfoBlock.appendChild(divDateBlock);
		divCostBlock.appendChild(costBlock);
		divInfoBlock.appendChild(divCostBlock);
		divInfoBlock.appendChild(divImgBlock)
		container.appendChild(divInfoBlock);
		contentBlock.appendChild(container);
	});
};