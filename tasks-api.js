const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { Pool } = require('pg')

const port = 4000

const pool = new Pool({ connectionString: 'postgresql://postgres:secret@localhost:5432/postgres' })
pool.on('error', (err) => {
    console.error('error event on pool', err)
})
pool.query(`
    CREATE TABLE IF NOT EXISTS "user" 
    (
        id SERIAL,
        email VARCHAR(255) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (email)
    );
    CREATE TABLE IF NOT EXISTS "task"
    (
        id SERIAL NOT NULL,
        user_id INTEGER NOT NULL,
        description VARCHAR(255),
        completed BOOLEAN DEFAULT false NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "owner" FOREIGN KEY (user_id)
            REFERENCES "user" (id)
    );`)
    .then(() => console.log('Tables created successfully'))
    .catch(err => {
        console.error('Unable to create tables, shutting down...', err);
        process.exit(1);
    })

app.use(bodyParser.json())
// Test end-point
app.post('/echo', (req, res) => {
    res.json(req.body)
})
// Create a new user account
app.post('/users', (req, res, next) => {
    pool.query('INSERT INTO "user" (email) VALUES ($1) RETURNING *', [req.body.email])
        .then(results => res.json(results.rows[0]))
        .catch(next)
})
// Get a user's information
app.get('/users/:userId', (req, res, next) => {
    pool.query('SELECT * FROM "user" WHERE id = $1', [req.params.userId])
        .then(results => {
            if (results.rowCount === 0) {
                res.status(404).end()
            } else {
                res.json(results.rows[0])
            }
        })
        .catch(next)
})
// Update a user's information
app.put('/users/:userId', (req, res, next) => {
    pool.query('UPDATE "user" SET email = $2 WHERE id = $1 RETURNING *', [req.params.userId, req.body.email])
        .then(results => {
            if (results.rowCount === 0) {
                res.status(404).end()
            } else {
                res.json(results.rows[0])
            }
        })
        .catch(next)
})
// Get all user's tasks
app.get('/users/:userId/tasks', (req, res, next) => {
    pool.query('SELECT * FROM "task" WHERE user_id = $1', [req.params.userId])
        .then(results => res.json({ data: results.rows }))
        .catch(next)
})
// Get a single user task
app.get('/users/:userId/tasks/:taskId', (req, res, next) => {
    pool.query('SELECT * FROM "task" WHERE user_id = $1 AND id = $2', [req.params.userId, req.params.taskId])
        .then(results => {
            if (results.rowCount === 0) {
                res.status(404).end()
            } else {
                res.json(results.rows[0])
            }
        })
        .catch(next)
})
// Create a new task
app.post('/users/:userId/tasks', (req, res, next) => {
    pool.query('INSERT INTO "task" (user_id, description) VALUES ($1, $2) RETURNING *', [
        req.params.userId,
        req.body.description
    ])
        .then(results => res.json(results.rows[0]))
        .catch(next)
})
// Update an existing task
app.put('/users/:userId/tasks/:taskId', (req, res, next) => {
    pool.query(`
    UPDATE "task" SET 
        description = $3,
        completed = $4
    WHERE 
        id = $1 AND user_id = $2 
    RETURNING id, user_id, description, completed`, [
            req.params.taskId,
            req.params.userId,
            req.body.description,
            req.body.completed
        ])
        .then(results => {
            if (results.rowCount === 0) {
                res.status(404).end()
            } else {
                res.json(results.rows[0])
            }
        })
        .catch(next)
})
// Delete a user's task
app.delete('/users/:userId/tasks/:taskId', (req, res, next) => {
    pool.query('DELETE FROM "task" WHERE id = $1 AND user_id = $2', [req.params.taskId, req.params.userId])
        .then(results => {
            if (results.rowCount === 0) {
                res.status(404).end()
            } else {
                if (!results.rows[0]) {
                    res.status(204)
                }
                res.json(results.rows[0])
            }
        })
        .catch(next)
})
// Delete all user's tasks
app.delete('/users/:userId/tasks', (req, res, next) => {
    pool.query('DELETE FROM "task" WHERE user_id = $1', [req.params.userId])
        .then(() => res.status(204).end())
        .catch(next)
})

app.listen(port, () => console.log("listening on port " + port))
