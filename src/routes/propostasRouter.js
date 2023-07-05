require("dotenv").config();
const express = require("express");
const knex = require("../db/knex");
const propostasRouter = express.Router();


propostasRouter.get("/propostas", express.json(), (req, res) => {
  let idsClientes = req.query.id?.split(",").map((e) => +e);
  if (!idsClientes) {
    res.status(400).json({
      mensagem: "Informe o(s) id(s) do cliente através do query params id",
      statusCode: 400,
    });
  }
  knex("propostas")
    .select(
      "propostas.id",
      "propostas.titulo",
      "propostas.status",
      "clientes.id AS cliente.id",
      "clientes.empresa AS cliente.empresa",
      "clientes.nome AS cliente.nome"
    )
    .whereIn("clienteId", idsClientes)
    .join("clientes", "clienteId", "=", "clientes.id")
    .then((propostas) => {
      if (propostas) {
        const result = propostas.map((proposta) => ({
          id: proposta.id,
          titulo: proposta.titulo,
          status: proposta.status,
          cliente: {
            id: proposta["cliente.id"],
            empresa: proposta["cliente.empresa"],
            nome: proposta["cliente.nome"],
          },
        }));
        res.status(200).json(result);
      } else {
        res.status(200).json([]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
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

propostasRouter.delete(
  "/propostas/:id_proposta",
  express.json(),
  (req, res) => {
    let id_proposta = +req.params.id_proposta;
    knex("propostas")
      .where({ id: id_proposta })
      .del()
      .then((proposta) => {
        if (proposta >= 1) {
          res.status(204).json();
        } else {
          res.status(404).json({
            message: "proposta não encontrado!",
            statusCode: 404,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          mensagem: "Internal Server Error!",
        });
      });
  }
);

module.exports = propostasRouter;
