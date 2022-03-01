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
	if (+event.target.value && +event.target.value > 0) {
		howNumber = event.target.value;
	} else {
		inputHow.value = "";
		alert("Введите числовое значение, больше 0!");
	}
};

const onButtonAddClick = async () => {
	if (whereText.trim().length !== 0 && howNumber !== null) {
		dataPost("POST", "http://localhost:8000/newTicket", {
			text: whereText,
			cost: howNumber,
		})
			.then((data) => {
				render();
			})
			.catch((err) => {
				console.log("Error!");
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
	let now = new Date();
	inputDate.min = `${now.getFullYear()}-${now.getMonth() - 1}-${now.getDate()}`;
	inputDate.max = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
	inputDate.addEventListener("change", (Event) => {
		editDate = Event.target.value;
	});

	const inputCost = document.createElement("input");
	inputCost.value = cost;
	inputCost.addEventListener("change", (event) => {
		editCost = event.target.value;
	});

	const editSendButton = document.createElement("button");
	editSendButton.innerText = "Edit All";
	editSendButton.onclick = () => {
		if (
			editText.trim().length !== 0 &&
			editCost !== 0 &&
			editDate.trim().length !== 0
		) {
			if (+editCost && +editCost > 0) {
				dataPost("PATCH", "http://localhost:8000/updateTicket", {
					id: _id,
					text: editText,
					cost: editCost,
					date: editDate,
				})
					.then((data) => {
						render();
					})
					.catch((err) => {
						console.log("Error!");
					});
			} else alert("Введите числовое значение");
		} else alert("Введите данные");
	};
	const cancelButton = document.createElement("button");
	cancelButton.innerText = "Cancel";
	cancelButton.onclick = () => render();

	container.appendChild(inputText);
	container.appendChild(inputCost);
	container.appendChild(inputDate);
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

const ondblclickBlock = (id, data, type) => {
	let divBoxData = document.getElementById(`${type}=${id}`);
	let divBox = document.getElementById(`div_${type}=${id}`);
	while (divBox.firstChild) {
		divBox.removeChild(divBox.firstChild);
	}
	switch (type) {
		case "text":
			let editText = data;
			const inputText = document.createElement("input");
			inputText.value = editText;
			inputText.id = `${type}=${id}`;

			const handleClick1 = (Event) => {
				if (Event.target.id != inputText.id) {
					render();
					document.removeEventListener("click", handleClick1);
				}
			}

			document.addEventListener("click", handleClick1);

			inputText.addEventListener("blur", (Event) => {
				editText = Event.target.value;
				if (editText.trim().length !== 0) {
					dataPost("PATCH", "http://localhost:8000/updateTicket", {
						id,
						text: editText,
					})
						.then((data) => {
							render();
						})
						.catch((err) => {
							console.error(err);
						});
				} else {
					inputText.value = data;
					alert("Введите текст!");
				}
			});
			divBox.appendChild(inputText);
			break;

		case "cost":
			let editCost = data;
			const inputCost = document.createElement("input");
			inputCost.value = editCost;
			inputCost.id = `${type}=${id}`;

			const handleClick2 = (Event) => {
				if (Event.target.id != inputCost.id) {
					render();
					document.removeEventListener("click", handleClick2);
				}
			}
			document.addEventListener("click", handleClick2);

			inputCost.addEventListener("blur", (Event) => {
				editCost = Event.target.value;
				if (+editCost && editCost > 0) {
					dataPost("PATCH", "http://localhost:8000/updateTicket", {
						id,
						cost: editCost,
					})
						.then((data) => {
							render();
						})
						.catch((err) => {
							console.error(err);
						});
				} else {
					inputCost.value = data;
					alert("Ведите верное числовое значение!");
				}
			});
			divBox.appendChild(inputCost);
			break;

		case "date":
			let editDate = `${data.slice(8, 10)}-${data.slice(5, 7)}-${data.slice(0, 4)}`;

			const inputDate = document.createElement("input");
			inputDate.type = "date";
			let now = new Date();
			inputDate.min = `${now.getFullYear()}-${now.getMonth() - 2
				}-${now.getDate()}`;
			inputDate.max = `${now.getFullYear()}-${now.getMonth() + 1
				}-${now.getDate()}`;
			inputDate.value = data.slice(0, 10);
			inputDate.id = `${type}=${id}`;

			const handleClick3 = (Event) => {
				if (Event.target.id != inputDate.id) {
					render();
					document.removeEventListener("click", handleClick3);
				}
			}

			document.addEventListener("click", handleClick3);

			inputDate.addEventListener("blur", (Event) => {
				editDate = Event.target.value;
				if (editDate.trim().length !== 0) {
					dataPost("PATCH", "http://localhost:8000/updateTicket", {
						id,
						date: editDate,
					})
						.then((data) => {
							render();
						})
						.catch((err) => {
							console.error(err);
						});
				} else {
					inputText.value = data;
					alert("Введите правильную дату!");
				}
			});
			divBox.appendChild(inputDate);
			break;
	}
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
	const UserSpending = resultUserSpending.data;
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

		const divInfoBlock = document.createElement("div");
		divInfoBlock.className = "div-info-block";

		const divTextBlock = document.createElement("div");
		divTextBlock.className = "div-text-block";
		const textBlock = document.createElement("p");
		textBlock.innerText = `${index + 1}) ${text}`;
		divTextBlock.id = `div_text=${_id}`;
		textBlock.id = `text=${_id}`;
		textBlock.ondblclick = () => ondblclickBlock(_id, text, "text");

		divTextBlock.appendChild(textBlock);
		divInfoBlock.appendChild(divTextBlock);

		const divDateBlock = document.createElement("div");
		divDateBlock.className = "div-date-block";
		const dateBlock = document.createElement("p");
		dateBlock.innerText = `${date.slice(8, 10)}-${date.slice(5, 7)}-${date.slice(0, 4)}`;
		divDateBlock.id = `div_date=${_id}`;
		dateBlock.id = `date=${_id}`;
		dateBlock.ondblclick = () => ondblclickBlock(_id, date, "date");

		const divCostBlock = document.createElement("div");
		divCostBlock.className = "div-cost-block";
		const costBlock = document.createElement("p");
		costBlock.innerText = `${cost} руб.`;
		divCostBlock.id = `div_cost=${_id}`;
		costBlock.id = `cost=${_id}`;
		costBlock.ondblclick = () => ondblclickBlock(_id, cost, "cost");

		divDateBlock.appendChild(dateBlock);
		divInfoBlock.appendChild(divDateBlock);
		divCostBlock.appendChild(costBlock);
		divInfoBlock.appendChild(divCostBlock);
		container.appendChild(divInfoBlock);
		contentBlock.appendChild(container);

		const divImgBlock = document.createElement("div");
		divImgBlock.className = "div-img-block";

		const ticketEdit = document.createElement("img");
		ticketEdit.src = "edit.png";
		ticketEdit.onclick = () => onClickEdit(index, ticketArray);
		divImgBlock.appendChild(ticketEdit);
		divInfoBlock.appendChild(divImgBlock);

		const ticketDelete = document.createElement("img");
		ticketDelete.src = "delete.png";
		ticketDelete.onclick = () => onClickDelete(_id);
		divImgBlock.appendChild(ticketDelete);
		divInfoBlock.appendChild(divImgBlock);
	});
};