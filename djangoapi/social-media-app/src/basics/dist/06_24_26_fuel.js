"use strict";
var CellStatus;
(function (CellStatus) {
    CellStatus["Orange"] = "orange";
    CellStatus["Green"] = "green";
    CellStatus["Red"] = "red";
})(CellStatus || (CellStatus = {}));
const columns = ["Date", "Km before", "Km after", "Km diff", "Liters", "Refill", "FuelEndDay"];
function getElementOrThrow(selector) {
    const el = document.querySelector(selector);
    if (!el) {
        throw new Error(`Element not found: ${selector}`);
    }
    return el;
}
function setCellStatus(cell, status) {
    cell.classList.remove("cellUser", "cellCommon", "cellError");
    switch (status) {
        case CellStatus.Orange:
            cell.classList.add("cellUser");
            break;
        case CellStatus.Green:
            cell.classList.add("cellCommon");
            break;
        case CellStatus.Red:
            cell.classList.add("cellError");
            break;
    }
}
function createCell(type, placeholder, status, readOnly = false) {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.readOnly = readOnly;
    if (type === "number") {
        input.inputMode = "decimal";
    }
    setCellStatus(input, status);
    return input;
}
function generateRows(year, month) {
    const kmRow = getElementOrThrow("#kmRow");
    kmRow.innerHTML = "";
    const gridTemplate = "120px 100px 100px 100px 100px 100px 100px";
    const headerRow = document.createElement("div");
    headerRow.style.display = "grid";
    headerRow.style.gridTemplateColumns = gridTemplate;
    headerRow.style.fontWeight = "bold";
    headerRow.style.marginBottom = "8px";
    columns.forEach(text => {
        const cell = document.createElement("input");
        cell.value = text;
        cell.readOnly = true;
        cell.style.textAlign = "center";
        cell.style.fontWeight = "bold";
        cell.style.backgroundColor = "#f0f0f0";
        headerRow.appendChild(cell);
    });
    kmRow.appendChild(headerRow);
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyRecords = [];
    const prevFuelInput = createCell("number", "Fuel prev. month", CellStatus.Orange);
    kmRow.appendChild(prevFuelInput);
    for (let day = 1; day <= daysInMonth; day++) {
        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gridTemplateColumns = gridTemplate;
        row.style.gap = "5px";
        row.style.marginBottom = "5px";
        const formattedDay = String(day).padStart(2, "0");
        const formattedMonth = String(month).padStart(2, "0");
        const dateStr = `${formattedDay}.${formattedMonth}.${String(year).slice(-2)}`;
        const jsDate = new Date(year, month - 1, day);
        const isWeekend = jsDate.getDay() === 0 || jsDate.getDay() === 6;
        const dateField = createCell("text", "Date", CellStatus.Green, true);
        dateField.value = dateStr;
        const kmBefore = createCell("number", "Km before", CellStatus.Orange);
        const kmAfter = createCell("number", "Km after", CellStatus.Orange);
        const kmDiff = createCell("number", "Km diff", CellStatus.Green, true);
        const liters = createCell("number", "Liters", CellStatus.Green, true);
        const refill = createCell("number", "Refill", CellStatus.Orange);
        const fuelendday = createCell("number", "FuelEndDay", CellStatus.Green, true);
        row.appendChild(dateField);
        row.appendChild(kmBefore);
        row.appendChild(kmAfter);
        row.appendChild(kmDiff);
        row.appendChild(liters);
        row.appendChild(refill);
        row.appendChild(fuelendday);
        const record = {
            date: dateStr,
            isWeekend,
            kmBefore: 0,
            kmAfter: 0,
            kmDiff: 0,
            liters: 0,
            refill: 0,
            fuelendday: 0,
            status: CellStatus.Orange,
            validationErrors: []
        };
        function updateDiff() {
            const before = Number(kmBefore.value.replace(",", ".")) || 0;
            const after = Number(kmAfter.value.replace(",", ".")) || 0;
            const diff = after - before;
            const refillVal = Number(refill.value.replace(",", ".")) || 0;
            kmDiff.value = String(diff);
            liters.value = String(diff * 0.08);
            record.kmBefore = before;
            record.kmAfter = after;
            record.kmDiff = diff;
            record.liters = diff * 0.08;
            record.refill = refillVal;
            const prevFuel = day === 1
                ? Number(prevFuelInput.value.replace(",", ".")) || 0
                : dailyRecords[day - 2].fuelendday;
            record.fuelendday = prevFuel + refillVal - record.liters;
            fuelendday.value = String(record.fuelendday);
            setCellStatus(kmBefore, CellStatus.Orange);
            setCellStatus(kmAfter, CellStatus.Orange);
            setCellStatus(kmDiff, CellStatus.Green);
            setCellStatus(liters, CellStatus.Green);
            setCellStatus(refill, CellStatus.Orange);
            setCellStatus(fuelendday, CellStatus.Green);
            record.status = CellStatus.Orange;
            if (isWeekend && diff !== 0) {
                setCellStatus(kmBefore, CellStatus.Red);
                setCellStatus(kmAfter, CellStatus.Red);
                record.status = CellStatus.Red;
                record.validationErrors.push("Weekend mileage must be zero");
            }
            if (before <= 0 || after <= 0 || after < before) {
                setCellStatus(kmBefore, CellStatus.Red);
                setCellStatus(kmAfter, CellStatus.Red);
                record.status = CellStatus.Red;
                record.validationErrors.push("Invalid input: must be >0 and kmAfter ≥ kmBefore");
            }
            if (refillVal < 0) {
                setCellStatus(refill, CellStatus.Red);
                record.status = CellStatus.Red;
                record.validationErrors.push("Refill must be ≥ 0 liters");
            }
        }
        kmBefore.addEventListener("input", updateDiff);
        kmAfter.addEventListener("input", updateDiff);
        refill.addEventListener("input", updateDiff);
        kmRow.appendChild(row);
        dailyRecords.push(record);
    }
    console.log("Daily records:", dailyRecords);
}
const monthPicker = document.querySelector("#monthPicker");
if (monthPicker) {
    monthPicker.addEventListener("change", () => {
        const [year, month] = monthPicker.value.split("-").map(Number);
        generateRows(year, month);
    });
}
else {
    console.error("Month picker #monthPicker not found in DOM");
}
//# sourceMappingURL=06_24_26_fuel.js.map