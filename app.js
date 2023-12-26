const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");
const { error } = require("console");
const moment = require("moment");
const bcrypt = require("bcrypt");
const session = require("express-session");

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "pure platform internship 2023-2024",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  if (
    !req.session.username &&
    req.path !== "/login" &&
    req.path !== "/register"
  ) {
    res.redirect("login");
  } else {
    next();
  }
});
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
  const sql = `insert into blogs(id,username,content,postDate) values
   ('${req.body.id}','${req.body.username}' ,'${req.body.content}','${req.body.postDate}');`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).end();
  });
}

function handleGetAllPosts(req, res) {
  const sql = `select blogs.id,blogs.username,blogs.content,blogs.postDate,
      sum (
        case when type="up" then 1
        else -1
        end
      ) as numberOfLikes 
      from votes join blogs on blog_id=blogs.id group by blogs.id`;

  con.query(sql, (err, result) => {
    res.status(200).type("html").render("blog", {
      blogs: result,
      username: req.session.username,
    });
  });
}

function handleDeleteAllPosts(req, res) {
  const sql = `delete from blogs where username='${req.session.username}'`;
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
function handleLikes(req, res) {
  const sql = `insert into votes (id,username,blog_id,type) values
   ('${req.body.id}','${req.body.username}','${req.body.blogId}','${req.body.type}')`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).end();
  });
}

app
  .route("/")
  .post(handleAddNewPost)
  .get(handleGetAllPosts)
  .delete(handleDeleteAllPosts);

app.listen(80, () => {
  console.log("the server has started at port 80");
});

app.get("/login", (req, res) => {
  if (req.session.username) return res.redirect("/");
  res.render("login", { message: null });
});

app.get("/register", (req, res) => {
  if (req.session.username) return res.redirect("/");
  res.render("register");
});

app.post("/register", async (req, res) => {
  console.log(req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const sql = `insert into users (username,hashedPassword,email) 
  values('${req.body.username}','${hashedPassword}','${req.body.email}');`;

  con.query(sql, (err, result) => {
    if (err) throw err;
    req.session.username = req.body.username;
    res.redirect("/");
  });
});

app.post("/login", (req, res) => {
  const sql = `select username,hashedPassword from users where username='${req.body.username}';`;
  con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length === 0)
      return res.render("login", {
        message: "username or password was incorrect",
      });
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      result[0].hashedPassword
    );
    if (isPasswordCorrect) {
      req.session.username = req.body.username;
      res.redirect("/");
    } else {
      res.render("login", {
        message: "username or password was incorrect",
      });
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
app.route("/:id").post(handleLikes).delete(handleDeleteItem).patch();
