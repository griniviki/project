// Проста типізація елементів DOM
const odoStartInput = document.getElementById('odo-start') as HTMLInputElement;
const odoEndInput = document.getElementById('odo-end') as HTMLInputElement;
const fuelStartInput = document.getElementById('fuel-start') as HTMLInputElement;
const fuelRefueledInput = document.getElementById('fuel-refueled') as HTMLInputElement;
const fuelEndInput = document.getElementById('fuel-end') as HTMLInputElement;
const fuelConsumedSpan = document.getElementById('fuel-consumed') as HTMLSpanElement;
const routeRowsContainer = document.getElementById('route-rows') as HTMLTableSectionElement;
const addRowBtn = document.getElementById('add-row-btn') as HTMLButtonElement;

// Функція перерахунку пального
function recalculateFuel(): void {
    const start = parseFloat(fuelStartInput.value) || 0;
    const refueled = parseFloat(fuelRefueledInput.value) || 0;
    const end = parseFloat(fuelEndInput.value) || 0;

    // Формула: Витрата = Старт + Заправка - Кінець
    const consumed = start + refueled - end;
    fuelConsumedSpan.textContent = consumed >= 0 ? consumed.toFixed(2) : 'Помилка';
}

// Функція динамічного додавання рядків маршруту
let rowCount = 0;
function addRouteRow(address = '', purpose = '', distance = 0): void {
    rowCount++;
    const row = document.createElement('tr');
    row.className = "border-b border-gray-200 text-gray-700";
    row.innerHTML = `
        <td class="p-2 border border-gray-300 text-center font-medium">${rowCount}</td>
        <td class="p-2 border border-gray-300"><input type="text" class="w-full focus:outline-none" value="${address}" placeholder="вул. Хрещатик 1, Київ"></td>
        <td class="p-2 border border-gray-300"><input type="text" class="w-full focus:outline-none" value="${purpose}" placeholder="Доставка товару"></td>
        <td class="p-2 border border-gray-300"><input type="number" class="w-full text-right focus:outline-none distance-input" value="${distance || ''}" placeholder="0"></td>
    `;
    routeRowsContainer.appendChild(row);

    // Слухач для автооновлення кілометражу (опціонально)
    row.querySelector('.distance-input')?.addEventListener('input', updateOdometerFromRoutes);
}

// Примітивна логіка: оновлюємо одометр на основі суми кілометрів із таблиці
function updateOdometerFromRoutes(): void {
    const distanceInputs = document.querySelectorAll('.distance-input') as NodeListOf<HTMLInputElement>;
    let totalDistance = 0;
    distanceInputs.forEach(input => {
        totalDistance += parseFloat(input.value) || 0;
    });

    const startOdo = parseFloat(odoStartInput.value) || 0;
    odoEndInput.value = (startOdo + totalDistance).toString();
}

// Ініціалізація та слухачі подій
[fuelStartInput, fuelRefueledInput, fuelEndInput].forEach(input => {
    input.addEventListener('input', recalculateFuel);
});

addRowBtn.addEventListener('click', () => addRouteRow());

// Створимо перші 2 дефолтні рядки при завантаженні
document.addEventListener('DOMContentLoaded', () => {
    addRouteRow('Склад №1 (вул. Польова)', 'Виїзд на маршрут', 0);
    addRouteRow('Офіс (вул. Центральна)', 'Передача документів', 150);
    recalculateFuel();
    
    // Встановимо сьогоднішню дату за дефолтом
    (document.getElementById('doc-date') as HTMLInputElement).valueAsDate = new Date();
});
