
// ✅ With generics (concise, typed, with null check)
const banking_box = document.querySelector<HTMLElement>("section");
if (!banking_box) {
  throw new Error("Section element not found");
}
// // ✅ With runtime narrowing (instanceof)
// const el = document.querySelector("section");
// if (el instanceof HTMLElement) {
  // const banking_box = el;
// }

// ⚠️ If you know the element must exist (non‑null assertion, but risky)
// const bankbox = document.querySelector<HTMLElement>("section")!;


// Replace as HTMLInputElement with querySelector<HTMLInputElement>() or instanceof checks
// Always guard against null before using .value
// Trim user input before regex validation
// Guard against missing DOM elements in renderTransactions

// 1. Описуємо інтерфейс для даних форми
interface CardDetails {
    card_number: string;
    name: string;
    expiry_date: string;
    cvv: string;
    amount: number;
}
// union type для статусу платежу
type TransactionStatus = 'success' | 'failed';
// Transaction description and  handling
interface TransactionDescription {
    id: number;
    name: string;
    status: TransactionStatus;
    expiry_date: string; 
    // cvv: string; // dont save
    amount: number;
    card_number: string;
}

// Проста типізована функція бере значення з полів 
// форми за їхніми id та повертає об'єкт правильного типу
// producer: reads from DOM elements & returns a typed pbject
function getFormData(): CardDetails {
    // Знаходимо елементи на сторінці
    // const cardInput = document.querySelector("#card_number") as HTMLInputElement;
    // use generic querySelector<HTMLInputElement>() or runtime narrowing
    const cardInput = document.querySelector<HTMLInputElement>("#card_number");
    const nameInput = document.querySelector<HTMLInputElement>("#name");
    const expiryDateInput = document.querySelector<HTMLInputElement>("#expiry_date");
    const cvvInput = document.querySelector<HTMLInputElement>("#cvv");
    const amountInput = document.querySelector<HTMLInputElement>("#amount");

    // ✅ Null check: make sure elements exist
    if (!cardInput || !nameInput || !expiryDateInput || !cvvInput || !amountInput) {
        throw new Error("One or more form inputs not found");
    }

    // // ✅ Runtime narrowing: confirm each is actually an input
    if (
        !(cardInput instanceof HTMLInputElement) ||
        !(nameInput instanceof HTMLInputElement) ||
        !(expiryDateInput instanceof HTMLInputElement) ||
        !(cvvInput instanceof HTMLInputElement) ||
        !(amountInput instanceof HTMLInputElement) 
    ) {
        throw new Error("One or more elements are not input fields");
    }
    // ✅ Safe to use .value now

    // Зчитуємо значення та одразу формуємо об'єкт потрібного типу
    // ✅ Trim values to avoid regex failing on trailing spaces
    const data: CardDetails = {
        //card_number: cardInput.value,
        card_number: cardInput.value.trim(),
        name: nameInput.value.trim(),
        expiry_date: expiryDateInput.value.trim(),
        cvv: cvvInput.value.trim(),
        amount: Number(amountInput.value)
    }
return data;
};

// Helper: check expiry date format and validity
function isValidExpiryDate(expiry: string): boolean {
  const [mm, yy] = expiry.split("/");
  if (!mm || !yy) return false;

  const month = +mm;              // convert to number
  const year = 2000 + +yy;        // convert YY → YYYY
  const expiryDate = new Date(year, month, 0); // last day of month

  return expiryDate >= new Date();
}

// consumer
function formValidation(data: CardDetails): boolean {
    let isValid = true;
    let errorMessage = "";
    // Check if the 'name' field is empty or only spaces
    if (!data.name || data.name.trim() === "") {
        isValid = false;  // mark as invalid
        errorMessage += "Type in your name.\n";   // add error message
    } 
    if (!data.card_number || !/^\d{16}$/.test(data.card_number)) {
        isValid = false;
        errorMessage += "Input 16 digits.\n";
    }
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
        isValid = false;
        errorMessage += "Amount should be more than 0";
    } // If the user types "123 " (with a trailing space), regex fails. Fix by trimming
    if (!data.cvv || !/^\d{3}$/.test(data.cvv.trim())) {
        isValid = false;
        errorMessage += "CVV must be 3 digits.\n";
    }
    if (!isValidExpiryDate(data.expiry_date.trim())) {
        isValid = false;
        errorMessage += "Card has expired or date is invalid.\n";
    }
    // If invalid, show an alert with the error(s)
    if (!isValid) {
        alert(errorMessage);
    } // Return true if valid, false if not
    return isValid;
}

//  Генерація статусу
function chooseStatus(): TransactionStatus {
    return Math.random() > 0.5 
        ? 'success'
        : 'failed';
}

 // Як це викликати при оплаті
const form = document.querySelector<HTMLFormElement>("#paymentForm");
if (!form) {
    alert("Form element not found!");
} else {
    form.addEventListener("submit", (event) => { // "submit", function(event) {
        event.preventDefault();
        const formData = getFormData();
        if (!formValidation(formData)) return;
    // Mask card number before saving
    const lastFour = formData.card_number.slice(-4);
    const maskedCard = "**** **** **** " + lastFour;

    const transaction: TransactionDescription = {
        id: Date.now(),
        name: formData.name,
        status: chooseStatus(),
        expiry_date: formData.expiry_date,
        // cvv: formData.cvv, // Dont save cvv
        amount: formData.amount,
        card_number: maskedCard   // <-- save masked version
    };

    // Зберігаємо масив транзакцій
    const transactions: TransactionDescription[] = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Оновлюємо таблицю
    renderTransactions();
    // Очистити поля після відправки
    form.reset();
});
}

function renderTransactions() {
    const table = document.querySelector<HTMLTableElement>("#transactionsTable");
    if (!table) return;
    table.innerHTML = "";

    const headerRow = document.createElement("tr");
    ["ID", "Name", "Status", "Expiry Date", "Amount", "Card"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
//function renderTransactions() {
    //const table = document.querySelector("#transactionsTable") as HTMLTableElement;

    // Очистити таблицю
    //table.innerHTML = "";

    // Створити рядок заголовків
    //const headerRow = document.createElement("tr");

    //const idHeader = document.createElement("th");
    //idHeader.textContent = "ID";
    //headerRow.appendChild(idHeader);

    //const nameHeader = document.createElement("th");
    //nameHeader.textContent = "Name";
    //headerRow.appendChild(nameHeader);
    //table.appendChild(headerRow);


    // Витягнути транзакції з LocalStorage


    const transactions: TransactionDescription[] = JSON.parse(localStorage.getItem("transactions") || "[]");     
    transactions.sort((a, b) => b.amount - a.amount);
    transactions.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === "success" ? -1 : 1;
    });

    transactions.forEach(tx => {
        // ID cell
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.textContent = String(tx.id).slice(-4);
        row.appendChild(idCell);
        // Name cell
        const nameCell = document.createElement("td");
        nameCell.textContent = tx.name; // безпечне вставлення
        row.appendChild(nameCell);
        // Status cell
        const statusCell = document.createElement("td");
        statusCell.textContent = tx.status; // безпечне вставлення
        row.appendChild(statusCell);

        const expiryDateCell = document.createElement("td");
        expiryDateCell.textContent = tx.expiry_date;
        row.appendChild(expiryDateCell);

        // const cvvCell = document.createElement("td");
        // cvvCell.textContent = "***";
        // row.appendChild(cvvCell);

        const amountCell = document.createElement("td");
        amountCell.textContent = String(tx.amount);
        row.appendChild(amountCell);

        const cardCell = document.createElement("td");
        // Mask card number: show only last 4 digits
        // Ensure card_number is treated as a string
        const lastFour = String(tx.card_number).slice(-4);
        cardCell.textContent = lastFour;
        row.appendChild(cardCell);


        table.appendChild(row);
        

    });
}

// Викликати при завантаженні сторінки
renderTransactions();

