const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.post('/', (req, res) => {
    // Let's look at what's in the body.
    // Because we've registered the body-parser
    //  middleware, this should be set and object-like
    console.log(req.body);
    res.json({
        message: "We received your request body!",
    });
});

app.listen(port, () => console.log("listening on port " + port));
