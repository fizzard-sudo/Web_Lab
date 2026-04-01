const express = require("express");
const app = express();

//EJS setup
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.render("homepage");
});

app.get("/women", (req, res) => res.render("women"));
app.get("/men", (req, res) => res.render("men"));
app.get("/kids", (req, res) => res.render("kids"));
app.get("/gift", (req, res) => res.render("gift"));
app.get("/beauty", (req, res) => res.render("beauty"));
app.get("/sale", (req, res) => res.render("sale"));
app.get("/signin",(req,res)=>res.render("signin"));
//Start server
app.listen(3000, () => {
  console.log("Server Started at http://localhost:3000");
});