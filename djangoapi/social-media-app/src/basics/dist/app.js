"use strict";
const odoStartInput = document.getElementById('odo-start');
const odoEndInput = document.getElementById('odo-end');
const fuelStartInput = document.getElementById('fuel-start');
const fuelRefueledInput = document.getElementById('fuel-refueled');
const fuelEndInput = document.getElementById('fuel-end');
const fuelConsumedSpan = document.getElementById('fuel-consumed');
const routeRowsContainer = document.getElementById('route-rows');
const addRowBtn = document.getElementById('add-row-btn');
function recalculateFuel() {
    const start = parseFloat(fuelStartInput.value) || 0;
    const refueled = parseFloat(fuelRefueledInput.value) || 0;
    const end = parseFloat(fuelEndInput.value) || 0;
    const consumed = start + refueled - end;
    fuelConsumedSpan.textContent = consumed >= 0 ? consumed.toFixed(2) : 'Помилка';
}
let rowCount = 0;
function addRouteRow(address = '', purpose = '', distance = 0) {
    var _a;
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
    (_a = row.querySelector('.distance-input')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', updateOdometerFromRoutes);
}
function updateOdometerFromRoutes() {
    const distanceInputs = document.querySelectorAll('.distance-input');
    let totalDistance = 0;
    distanceInputs.forEach(input => {
        totalDistance += parseFloat(input.value) || 0;
    });
    const startOdo = parseFloat(odoStartInput.value) || 0;
    odoEndInput.value = (startOdo + totalDistance).toString();
}
[fuelStartInput, fuelRefueledInput, fuelEndInput].forEach(input => {
    input.addEventListener('input', recalculateFuel);
});
addRowBtn.addEventListener('click', () => addRouteRow());
document.addEventListener('DOMContentLoaded', () => {
    addRouteRow('Склад №1 (вул. Польова)', 'Виїзд на маршрут', 0);
    addRouteRow('Офіс (вул. Центральна)', 'Передача документів', 150);
    recalculateFuel();
    document.getElementById('doc-date').valueAsDate = new Date();
});
//# sourceMappingURL=app.js.map