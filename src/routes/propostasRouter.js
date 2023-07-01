require("dotenv").config();
const express = require("express");
const knex = require("../db/knex");
const propostasRouter = express.Router();

propostasRouter.get("/propostas", express.json(), (req, res) => {
    knex
      .select("*")
      .from("propostas")
      .then((propostas) => res.status(200).json(propostas))
      .catch(() => {
        res.status(500).json({
          mensagem: "Internal Server Error!",
        });
      });
  });

propostasRouter.get("/propostas/:id_cliente", express.json(), (req, res) => {
  let id_cliente = +req.params.id_cliente;
  knex("propostas")
    .where({ clienteId: id_cliente })
    .then((propostas) => {
        res.status(200).json(propostas);
    });
});

propostasRouter.post("/propostas/:id_cliente", express.json(), (req, res) => {
  let id_cliente = +req.params.id_cliente;
  knex("propostas")
    .insert({
        clienteId: id_cliente,
        status: req.body.status,
        titulo: req.body.titulo
    }, ['clienteId', 'titulo', 'status'])
    .then((proposta) => {
        res.status(200).json(proposta[0])
    });
});

module.exports = propostasRouter;
