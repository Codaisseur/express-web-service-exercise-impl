const { Client } = require("pg");

const client = new Client({ connectionString: "postgresql://postgres:secret@localhost:5432/postgres" });

client.connect()
  .then(() => {
    console.log("Connection to Postgres established!")
  })
  .then(() => client.query("CREATE TABLE IF NOT EXISTS test_table (id serial, test_column varchar(255))"))
  .then(() => client.query("INSERT INTO test_table (test_column) VALUES ('foo')"))
  .then(() => client.query("SELECT * FROM test_table"))
  .then(res => {
    console.log(res.rows);
    return client.end();
  })
  .then(() => {
    console.log("Connection closed!");
  })
  .catch(err => console.error(err))
