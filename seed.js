const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "newPassword",
});

// using faker pacage to generate random users data
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

let data = [];
for (let i = 0; i < 100; i++) {
  data.push(getRandomUser());
}

let query = "INSERT INTO user(id, username, email, password) VALUES ?";

connection.query(query, [data], (error, result) => {
  if (error) throw error;
  console.log(result);
  connection.end();
});
