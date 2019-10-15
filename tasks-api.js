const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const app = express();
const port = 4000;

const sequelize = new Sequelize("postgres://postgres:secret@localhost:5432/postgres");

const User = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

const Task = sequelize.define("task", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

sequelize.sync()
  .then(() => console.log("Tables created successfully"))
  .catch(err => {
    console.error("Unable to create tables, shutting down...", err);
    process.exit(1);
  });

app.use(bodyParser.json());

// Just using this endpoint for testing :)
app.post("/echo", (req, res) => {
  res.json(req.body);
});

// Create a new user account
app.post("/users", (req, res, next) => {
  User.create(req.body)
    .then(user => res.json(user))
    .catch(next)
});

// Get a user's information
app.get("/users/:userId", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        res.status(404).end();
      } else {
        res.json(user);
      }
    })
    .catch(next);
});

// Update a user's information
app.put("/users/:userId", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (user) {
        user
          .update(req.body)
          .then(user => res.json(user));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Get all user's tasks
app.get("/users/:userId/tasks", (req, res, next) => {
  Task.findAll({ where: { userId: req.params.userId } })
    .then(tasks => {
      res.json(tasks);
    })
    .catch(next);
});

// Get a single user task
app.get("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.findOne({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
  .then(task => {
    if (task) {
      res.json(task);
    } else {
      res.status(404).end();
    }
  })
  .catch(next);
});
    
// Create a new task
app.post("/users/:userId/tasks", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        res.status(404).end()
      } else {
        Task.create({
          ...req.body,
          userId: req.params.userId
        }).then(task => {
          res.json(task);
        });
      }
    })
    .catch(next);
});

// Update an existing task
app.put("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.findOne({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(task => {
      if (task) {
        task
          .update(req.body)
          .then(task => res.json(task));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete a user's task
app.delete("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.destroy({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete all user's tasks
app.delete("/users/:userId/tasks", (req, res, next) => {
  Task.destroy({
    where: {
      userId: req.params.userId,
    }
  })
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

app.listen(port, () => console.log("listening on port " + port));
