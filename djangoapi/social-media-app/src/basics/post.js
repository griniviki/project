const API_BASE = "http://localhost:5000"; // Node backend

// Fetch posts from Node API
async function fetchPosts() {
  const res = await fetch(`${API_BASE}/api/post`);
  const posts = await res.json();
  const list = document.getElementById("postList");
  list.innerHTML = "";

  posts.forEach(post => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${post.linguistics_type}</strong>: ${post.body}
      <br><small>Created: ${new Date(post.created).toLocaleString()}</small>
    `;
    list.appendChild(li);
  });
}

// Handle new post submission
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = document.getElementById("postBody").value;
  const linguisticsType = document.getElementById("linguisticsType").value;

  const res = await fetch(`${API_BASE}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, linguistics_type: linguisticsType })
  });

  if (res.ok) {
    document.getElementById("postBody").value = "";
    fetchPosts(); // reload posts
  } else {
    alert("Error creating post");
  }
});

// Load posts on page load
fetchPosts();



const sidebar = document.querySelector(".right-section");

// Create a container
const container = document.createElement("div");
container.textContent = "[document]";
container.className = "container";

//.nav, .article, and .aside are all direct children of .container. That’s why they’re stacking vertically by default.
const nav = document.createElement("div");
nav.className = "nav";
nav.textContent = "[nav]";
container.appendChild(nav);

const article = document.createElement("div");
article.className = "article";
article.textContent = "[article]";
container.appendChild(article);

//add a child ot .article
const section = document.createElement("div");
section.className = "section";
section.textContent = "[section]";
article.append(section)

const subsection1 = document.createElement("div");
subsection1.className = "subsection1";
subsection1.textContent = "[subsection1]";
section.appendChild(subsection1);


const subsection2 = document.createElement("div");
subsection2.className = "subsection2";
subsection2.textContent = "[subsection2]";
section.appendChild(subsection2);

const aside = document.createElement("div");
aside.className = "aside";
aside.textContent = "[aside]";
container.appendChild(aside);



// Append the container to the sidebar
sidebar.prepend(container);


