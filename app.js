const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("blog");
});

app.listen(80, () => {
  console.log(" started a server at port 80");
});
