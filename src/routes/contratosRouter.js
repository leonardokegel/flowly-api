require("dotenv").config();
const express = require("express");
const knex = require("../db/knex");
const contratosRouter = express.Router();

contratosRouter.get("/contratos", express.json(), (req, res) => {
    knex
      .select("*")
      .from("contratos")
      .then((contratos) => res.status(200).json(contratos))
      .catch(() => {
        res.status(500).json({
          mensagem: "Internal Server Error!",
        });
      });
  });

contratosRouter.get("/contratos/:id_cliente", express.json(), (req, res) => {
  let id_cliente = +req.params.id_cliente;
  knex("contratos")
    .where({ clienteId: id_cliente })
    .then((contratos) => {
        res.status(200).json(contratos);
    });
});

contratosRouter.post("/contratos/:id_cliente", express.json(), (req, res) => {
  let id_cliente = +req.params.id_cliente;
  knex("contratos")
    .insert({
        clienteId: id_cliente,
        status: req.body.status,
        titulo: req.body.titulo
    }, ['clienteId', 'titulo', 'status'])
    .then((contratos) => {
        res.status(200).json(contratos[0])
    });
});

module.exports = contratosRouter;
