const express = require("express");
const cors = require("cors");
const app = express();
const postRoutes = require("./routes/post");

app.use(cors({
  origin: "http://localhost:3000",   // allow React frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(postRoutes);

app.listen(5000, () => {
  console.log("Node server running on http://localhost:5000");
});