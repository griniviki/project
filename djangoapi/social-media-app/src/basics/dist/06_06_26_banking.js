"use strict";
const banking_box = document.querySelector("section");
if (!banking_box) {
    throw new Error("Section element not found");
}
function getFormData() {
    const cardInput = document.querySelector("#card_number");
    const nameInput = document.querySelector("#name");
    const expiryDateInput = document.querySelector("#expiry_date");
    const cvvInput = document.querySelector("#cvv");
    const amountInput = document.querySelector("#amount");
    if (!cardInput || !nameInput || !expiryDateInput || !cvvInput || !amountInput) {
        throw new Error("One or more form inputs not found");
    }
    if (!(cardInput instanceof HTMLInputElement) ||
        !(nameInput instanceof HTMLInputElement) ||
        !(expiryDateInput instanceof HTMLInputElement) ||
        !(cvvInput instanceof HTMLInputElement) ||
        !(amountInput instanceof HTMLInputElement)) {
        throw new Error("One or more elements are not input fields");
    }
    const data = {
        card_number: cardInput.value.trim(),
        name: nameInput.value.trim(),
        expiry_date: expiryDateInput.value.trim(),
        cvv: cvvInput.value.trim(),
        amount: Number(amountInput.value)
    };
    return data;
}
;
function isValidExpiryDate(expiry) {
    const [mm, yy] = expiry.split("/");
    if (!mm || !yy)
        return false;
    const month = +mm;
    const year = 2000 + +yy;
    const expiryDate = new Date(year, month, 0);
    return expiryDate >= new Date();
}
function formValidation(data) {
    let isValid = true;
    let errorMessage = "";
    if (!data.name || data.name.trim() === "") {
        isValid = false;
        errorMessage += "Type in your name.\n";
    }
    if (!data.card_number || !/^\d{16}$/.test(data.card_number)) {
        isValid = false;
        errorMessage += "Input 16 digits.\n";
    }
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
        isValid = false;
        errorMessage += "Amount should be more than 0";
    }
    if (!data.cvv || !/^\d{3}$/.test(data.cvv.trim())) {
        isValid = false;
        errorMessage += "CVV must be 3 digits.\n";
    }
    if (!isValidExpiryDate(data.expiry_date.trim())) {
        isValid = false;
        errorMessage += "Card has expired or date is invalid.\n";
    }
    if (!isValid) {
        alert(errorMessage);
    }
    return isValid;
}
function chooseStatus() {
    return Math.random() > 0.5
        ? 'success'
        : 'failed';
}
const form = document.querySelector("#paymentForm");
if (!form) {
    alert("Form element not found!");
}
else {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = getFormData();
        if (!formValidation(formData))
            return;
        const lastFour = formData.card_number.slice(-4);
        const maskedCard = "**** **** **** " + lastFour;
        const transaction = {
            id: Date.now(),
            name: formData.name,
            status: chooseStatus(),
            expiry_date: formData.expiry_date,
            amount: formData.amount,
            card_number: maskedCard
        };
        const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
        form.reset();
    });
}
function renderTransactions() {
    const table = document.querySelector("#transactionsTable");
    if (!table)
        return;
    table.innerHTML = "";
    const headerRow = document.createElement("tr");
    ["ID", "Name", "Status", "Expiry Date", "Amount", "Card"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.sort((a, b) => b.amount - a.amount);
    transactions.sort((a, b) => {
        if (a.status === b.status)
            return 0;
        return a.status === "success" ? -1 : 1;
    });
    transactions.forEach(tx => {
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.textContent = String(tx.id).slice(-4);
        row.appendChild(idCell);
        const nameCell = document.createElement("td");
        nameCell.textContent = tx.name;
        row.appendChild(nameCell);
        const statusCell = document.createElement("td");
        statusCell.textContent = tx.status;
        row.appendChild(statusCell);
        const expiryDateCell = document.createElement("td");
        expiryDateCell.textContent = tx.expiry_date;
        row.appendChild(expiryDateCell);
        const amountCell = document.createElement("td");
        amountCell.textContent = String(tx.amount);
        row.appendChild(amountCell);
        const cardCell = document.createElement("td");
        const lastFour = String(tx.card_number).slice(-4);
        cardCell.textContent = lastFour;
        row.appendChild(cardCell);
        table.appendChild(row);
    });
}
renderTransactions();
//# sourceMappingURL=06_06_26_banking.js.map