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

clientesRouter.get("/clientes/:id_usuario", express.json(), (req, res) => {
  let id_usuario = +req.params.id_usuario;
  knex
    .select(
      "clientes.id as cliente_id",
      "clientes.empresa",
      "clientes.nome",
      "clientes.email",
      knex.raw("json_agg(DISTINCT propostas.*) as propostas"),
      knex.raw("json_agg(DISTINCT contratos.*) as contratos")
    )
    .from("clientes")
    .leftJoin("propostas", "clientes.id", "propostas.clienteId")
    .leftJoin("contratos", "clientes.id", "contratos.clienteId")
    .where("clientes.userId", id_usuario)
    .groupBy("clientes.id")
    .then((rows) => {
      const clientes = rows.map((row) => ({
        id: row.cliente_id,
        empresa: row.empresa,
        nome: row.nome,
        email: row.email,
        propostas: validaArray(row.propostas),
        contratos: validaArray(row.contratos),
      }));
      res.status(200).json(clientes);
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

function validaArray(array) {
  const result = array.filter((prop) => prop?.id !== null);
  if (result[0] === null) {
    return [];
  }
  return result;
}

module.exports = clientesRouter;
