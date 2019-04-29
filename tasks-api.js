const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Get all user's tasks
app.get('/users/:userId/tasks', (req, res) => {/*..*/})
// Get a single user task
app.get('/users/:userId/tasks/:taskId', (req, res) => {/*..*/})
// Create a new task
app.post('/users/:userId/tasks', (req, res) => {/*..*/})
// Update an existing task
app.put('/users/:userId/tasks/:taskId', (req, res) => {/*..*/})
// Delete a user's task
app.delete('/users/:userId/tasks/:taskId', (req, res) => {/*..*/})
// Delete all user's tasks
app.delete('/users/:userId/tasks', (req, res) => {/*..*/})

app.listen(port, () => console.log("listening on port " + port))