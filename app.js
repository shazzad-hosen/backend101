const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const methodOverride = require("method-override");
const { log, error } = require("node:console");
const uuid = require("uuid-v4");

const app = express();
const port = 8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app", // name of your working database
  password: " ", // password of you MySQL WB
});

// Home Route
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        let count = result[0]["count(*)"];
        res.render("home.ejs", { count });
      }
    });
  } catch (error) {
    console.log(error);
    res.send("Some error in DataBase");
  }
});

// Show Route
app.get("/user", (req, res) => {
  let query = `SELECT * FROM user`; // user is the name of our table
  try {
    connection.query(query, (error, users) => {
      if (error) {
        throw error;
      } else {
        res.render("showUsers.ejs", { users });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Edit Username Route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        let user = result[0];

        res.render("edit.ejs", { user });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Update into DataBase Route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPassword, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        let user = result[0];
        if (formPassword != user.password) {
          res.send("Wrong Password");
        } else {
          let query = `UPDATE user SET username = '${newUsername}' WHERE id='${id}'`;
          connection.query(query, (error, result) => {
            if (error) {
              throw error;
            } else {
              res.redirect("/user");
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Serving Add User Form Route
app.get("/user/add", (req, res) => {
  res.render("adduser.ejs");
});

// Add New User to the DataBase Route
app.post("/user", (req, res) => {
  let { email, username, password } = req.body;

  let id = uuid();
  let q = `INSERT INTO user (id, email, username, password) VALUES (?, ?, ?, ?)`;

  try {
    connection.query(q, [id, email, username, password], (error, result) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete Existing User Route
app.get("/user/:id", (req, res) => {
  let idObject = req.params;
  let q = `DELETE FROM user WHERE id = '${idObject.id}'`;

  try {
    connection.query(q, (error, result) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/user");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
