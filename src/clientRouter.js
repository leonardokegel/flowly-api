require('dotenv').config();
const express = require("express");
const secRouter = express.Router();
const knex = require("knex")({
  client: "pg",
  connection: {

    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

secRouter.post("/register", express.json(), (req, res) => {
  knex("users")
    .insert(
      {
        email: req.body.email,
        senha: req.body.senha,
        nome: req.body.nome,
      },
      ["id"]
    )
    .then(() => {
      res.status(200).json({});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

secRouter.get("/", express.json(), (req, res) => {
  knex
    .select("*")
    .from("users")
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

module.exports = secRouter;
