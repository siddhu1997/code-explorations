const mysql = require("mysql2/promise");
const faker = require("faker");

async function main() {
  try {
    // Connect to MySQL
    const mysqlConnection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "trino",
      password: "trino",
      database: "connections",
    });

    console.log("Connected to MySQL");

    const createTable = `CREATE TABLE IF NOT EXISTS connections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      timestamp DATETIME
    );`;

    await mysqlConnection.execute(createTable);
    console.log("Table created");

    const distinctUsers = new Set();
    const values = [];
    for (let i = 0; i < 500000; i++) {
      const userId = faker.datatype.number();
      values.push([userId, faker.date.recent()]);
      distinctUsers.add(userId);
    }

    const sql = "INSERT INTO connections (user_id, timestamp) VALUES ?";
    await mysqlConnection.query(sql, [values]);
    console.log("Data inserted");

    console.log("Number of distinct users: ", distinctUsers.size);

    await mysqlConnection.end();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
