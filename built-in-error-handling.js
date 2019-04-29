const express = require('express')
const app = express()
const port = 3000
app.get('/', (req, res, next) => {
    if (Math.random() < 0.5) {
        res.send("ok")
    } else {
        next("not ok")
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))