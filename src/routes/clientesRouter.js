require("dotenv").config();
const express = require("express");
const knex = require("../db/knex");
const clientesRouter = express.Router();

clientesRouter.get("/clientes", express.json(), (req, res) => {
  knex
    .select("*")
    .from("clientes")
    .then((clientes) => res.status(200).json(clientes))
    .catch(() => {
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

clientesRouter.get("/clientes/:client_id", express.json(), (req, res) => {
  let client_id = +req.params.client_id;
  knex("clientes")
    .select(
      "clientes.id",
      "clientes.empresa",
      "clientes.nome",
      "clientes.email",
      "propostas.id as proposta_id",
      "propostas.titulo",
      "propostas.status"
    )
    .leftJoin("propostas", "clientes.id", "propostas.clienteId")
    .where("clientes.id", client_id)
    .then((result) => {
      console.log(result);
      if (result.length > 0) {
        const cliente = {
          id: result[0].id,
          empresa: result[0].empresa,
          nome: result[0].nome,
          email: result[0].email,
          propostas: result[0].proposta_id
            ? result.map((e) => ({
                id: e.proposta_id,
                titulo: e.titulo,
                status: e.status,
              }))
            : [],
        };
        res.status(200).json(cliente);
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

clientesRouter.post("/clientes/:id_usuario", express.json(), (req, res) => {
  let id_usuario = +req.params.id_usuario;
  knex("clientes")
    .insert(
      {
        userId: id_usuario,
        empresa: req.body.empresa,
        nome: req.body.nome,
        email: req.body.email,
      },
      ["userId", "empresa", "nome", "email"]
    )
    .then((clientes) => {
      res.status(200).json(clientes[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

module.exports = clientesRouter;
