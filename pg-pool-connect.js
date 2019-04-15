const { Pool } = require('pg')
const pool = new Pool({ connectionString: 'postgresql://postgres:secret@localhost:5432/postgres' })
pool.on('error', (err, client) => {
    console.error('error event on pool', err)
})
pool.connect((err, client, done) => {
    if (err) {
        done()
        console.error('error in connect', err)
    } else {
        client.query('SELECT NOW()', (err, res) => {
            done()
            if (err) {
                console.error('error in query', err)
            } else {
                console.log(res.rows)
            }
        })
    }})
