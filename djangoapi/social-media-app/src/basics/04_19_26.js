
const img = document.getElementById("clicable_img");
const btn = document.getElementById("changeBtn");

btn.addEventListener("click", () => {

  if (img.src.includes("https://itproger.com/img/courses/1476977240.jpg")) {
    img.src = "https://itproger.com/img/courses/1476977488.jpg";
  } else if (img.src.includes("https://itproger.com/img/courses/1476977488.jpg")) {
    img.src = "https://www.wikimedia.org/static/images/wmf-logo.png";
  } 
});

// Select all <p> elements inside the left section
const posts = document.querySelectorAll(".left-section p");

// Loop through each post and add a click handler
posts.forEach(post => {
  post.addEventListener("click", () => {
    post.remove(); // removes the clicked element from the DOM
  });
});

