// CLOTHES TABLE
const storeClosses = document.querySelector(".closses_store");

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(products => {
    const table_closses = document.createElement("table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["ID", "Title", "Price"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table_closses.appendChild(thead);

    const tbody = document.createElement("tbody");
    products.slice(0, 4).forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id}</td>
        <td title="${p.title}">${p.title.slice(0, 10)}</td>
        <td>$${p.price}</td>
      `;
      tbody.appendChild(row);
    });
    table_closses.appendChild(tbody);

    storeClosses.appendChild(table_closses);
  })
  .catch(err => console.error("Error loading products:", err));

