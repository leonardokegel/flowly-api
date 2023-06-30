require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secRouter = express.Router();
var config;
const isLocal = process.env.ISLOCAL;
if (!isLocal) {
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
          .insert(
            {
              email: req.body.email,
              senha: bcrypt.hashSync(req.body.senha, 8),
              nome: req.body.nome,
            },
            ["email"]
          )
          .then((result) => {
            let user = result[0];
            res.status(200).json({
              mensagem: `Usuario ${user.email} inserido com sucesso!`,
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

secRouter.post("/login", express.json(), (req, res) => {
  knex('users')
    .where({
      email: req.body.email,
    }).first()
    .then((user) => {
      if (user) {
        let checkSenha = bcrypt.compareSync(req.body.senha, user.senha);
        if (checkSenha) {
          var tokenJWT = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, {
            expiresIn: 3600,
          });
          res.status(200).json({
            id: user.id,
            email: user.email,
            nome: user.nome,
            token: tokenJWT,
          });
        } else {
          res.status(400).json({ 
            mensagem: "Login ou senha incorretos",
            statusCode: 400
           });
        }
      } else {
        res.status(400).json({ 
          mensagem: "Login ou senha incorretos",
          statusCode: 400
         });
      }
    })
    .catch((err) => {
      res.status(500).json({
        mensagem: "Internal Server Error",
        error: err,
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
