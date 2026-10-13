const productCards = document.querySelector(".product_cards");

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(products => {
    products.slice(0, 4).forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";

      const img = document.createElement("img");
      img.src = p.image;
      img.width = 120;

      const price = document.createElement("div");
      price.textContent = `$${p.price}`;

      card.appendChild(img);
      card.appendChild(price);

      productCards.appendChild(card); 
    });
  })
  .catch(err => {
    console.error("Error loading product cards:", err);
    alert("Error: " + err); 
  })