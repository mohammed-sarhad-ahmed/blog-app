const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");
const { error } = require("console");
const moment = require("moment");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "mohammed",
  password: "A22wweerr@",
  port: 3307,
  database: "blog",
});

con.connect((err) => {
  if (err) throw err;
  console.log("the connection to the database was successful");
});

function handleAddNewPost(req, res) {
  const dataString = Date(req.body.postDate);
  req.body.postDate = moment(dataString).format("YYYY-MM-DD HH:mm:ss");
  const sql = `insert into blogs(id,name,content,postDate) values
   ('${req.body.id}','${req.body.name}' ,'${req.body.content}','${req.body.postDate}');`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).end();
  });
}

function handleGetAllPosts(req, res) {
  const sql = "select * from blogs";
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).type("html").render("blog", { blogs: result });
  });
}

function handleDeleteAllPosts(req, res) {
  const sql = "delete from blogs";
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.status(204).end();
  });
}

function handleDeleteItem(req, res) {
  console.log(req.params.id);
  const sql = ` delete from blogs where id="${req.params.id}" ;`;
  con.query(sql, (err, result) => {
    if (err) throw err;

    res.status(204).end();
  });
}

app
  .route("/")
  .post(handleAddNewPost)
  .get(handleGetAllPosts)
  .delete(handleDeleteAllPosts);

app.route("/:id").delete(handleDeleteItem).patch();

app.listen(80, () => {
  console.log("the server has started at port 80");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  console.log(req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const sql = `insert into users (username,hashedPassword,email) values('${req.body.username}','${hashedPassword}','${req.body.email}');`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/login", async (req, res) => {
  const sql = "select username,hashedPassword from users";
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (bcrypt.compare(req.body.password, result[0].hashedPassword)) {
      res.redirect("/");
    }
  });
});
