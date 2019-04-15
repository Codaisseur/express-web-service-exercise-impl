const { Client } = require('pg')
const client = new Client({ connectionString: 'postgresql://postgres:secret@localhost:5432/postgres' })
client.connect()
    .then(() => {
        console.log("Connection to Postgres established!")
        return client.query('SELECT NOW()')
    })
    .then(res => {
        console.log(res.rows)
        return client.end()
    })
    .then(() => {
        console.log("Connection closed!")
    })
    .catch(err => console.error(err))