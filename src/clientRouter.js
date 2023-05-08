require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const secRouter = express.Router();
var config;
const isLocal = process.env.ISLOCAL;
if (isLocal) {
  config = {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
    },
  };
} else {
  config = {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
}
const knex = require("knex")(config);

secRouter.post("/register", express.json(), (req, res) => {
  knex("users")
    .where({ email: req.body.email })
    .then((user) => {
      if (user.length < 1) {
        knex("users")
          .insert({
            email: req.body.email,
            senha: bcrypt.hashSync(req.body.senha, 8),
            nome: req.body.nome,
          }, ['email'])
          .then((result) => {
            let user = result[0];
            res.status(200).json({
              mensagem: `Usuario ${user.email} inserido com sucesso!`
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              mensagem: "Internal Server Error!",
            });
          });
      } else {
        res.status(422).json({
          mensagem: "Usuário já cadastrado!",
          statusCode: 422,
        });
      }
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
