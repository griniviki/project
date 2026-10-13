class GasStation {
  constructor(id, name, fuel_prices) {
    this.id = id;
    this.name = name;
    this.fuel_prices = fuel_prices;
  }

  updatePrice(type, newPrice) {
    this.fuel_prices[type] = newPrice;
    return `${this.name} ${type} updated to ${newPrice}`;
  }

  getTotalCost(liters, type) {
    return liters * this.fuel_prices[type];
  }
}

// GASSTATION TABLE
const storeGas = document.querySelector(".gasstation_store");

// Create instances
const gasstations = [
  new GasStation(1, "WOG", { diesel: 52, petrol: 55, electric: 12 }),
  new GasStation(2, "OKKO", { diesel: 50, petrol: 60, electric: 12 }),
  new GasStation(3, "Salut", { diesel: 50, petrol: 70, electric: 45 }),
  new GasStation(4, "Amic", { diesel: 60, petrol: 80, electric: 0 })
];

// 👉 Now you can safely use methods
console.log(gasstations[0].updatePrice("diesel", 48));
// → "WOG diesel updated to 48"

console.log(gasstations[1].getTotalCost(20, "petrol"));
// → 1200

// 👉 CHEAPEST DIESEL
const dieselPrices = gasstations
  .map(gs => gs.fuel_prices.diesel)
  .filter(price => typeof price === "number");

const cheapestDiesel = Math.min(...dieselPrices);
console.log("Cheapest diesel:", cheapestDiesel);

// Build table
const table_gasstations = document.createElement("table");

const theadGas = document.createElement("thead");
const headerRowGas = document.createElement("tr");
["ID", "Name", "Diesel", "Petrol", "Electric"].forEach(text => {
  const th = document.createElement("th");
  th.textContent = text;
  headerRowGas.appendChild(th);
});
theadGas.appendChild(headerRowGas);
table_gasstations.appendChild(theadGas);

const tbodyGas = document.createElement("tbody");
gasstations.forEach(gs => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${gs.id}</td>
    <td>${gs.name}</td>
    <td>${gs.fuel_prices.diesel}</td>
    <td>${gs.fuel_prices.petrol}</td>
    <td>${gs.fuel_prices.electric}</td>
  `;
  tbodyGas.appendChild(row);
});
table_gasstations.appendChild(tbodyGas);

// Build table for methods
const table_final_gasstation = document.createElement("table");
const theadGasFinal = document.createElement("thead");
const headerRowGasFinal = document.createElement("tr");
["Name", "Cheapest"].forEach(rext => {
  
})


storeGas.appendChild(table_gasstations);
