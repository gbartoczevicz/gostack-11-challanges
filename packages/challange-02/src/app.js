const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid repository id" });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);
app.use('/repositories/:id/likes', validateRepositoryId);

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repo);

  return res.json(repo);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const i = repositories.findIndex((r) => r.id == id);

  if (i < 0) {
    return res.status(400).json({ message: `Repository ${id} not found` });
  }

  const repo = repositories[i];

  repo.title = title;
  repo.url = url;
  repo.techs = techs;

  repositories[i] = repo;

  return res.json(repo);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const i = repositories.findIndex((r) => r.id == id);

  if (i < 0) {
    return res.status(400).json({ message: `Repository ${id} not found` });
  }

  repositories.splice(i, 1);

  return res.sendStatus(204);
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const i = repositories.findIndex((r) => r.id == id);

  if (i < 0) {
    return res.status(400).json({ message: `Repository ${id} not found` });
  }

  repositories[i].likes++;

  return res.json(repositories[i]);
});

module.exports = app;
