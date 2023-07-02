require("dotenv").config();
const express = require("express");
const knex = require("../db/knex");
const contratosRouter = express.Router();

// contratosRouter.get("/contratos", express.json(), (req, res) => {
//   knex
//     .select("*")
//     .from("contratos")
//     .then((contratos) => res.status(200).json(contratos))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         mensagem: "Internal Server Error!",
//       });
//     });
// });

contratosRouter.get("/contratos", express.json(), (req, res) => {
  let idsClientes = req.query.id?.split(",").map((e) => +e);
  if (!idsClientes) {
    res.status(400).json({
      mensagem: "Informe o(s) id(s) do cliente através do query params id",
      statusCode: 400,
    })
  }
  knex("contratos")
    .select(
      "contratos.id",
      "contratos.titulo",
      "contratos.status",
      "clientes.id AS cliente.id",
      "clientes.empresa AS cliente.empresa",
      "clientes.nome AS cliente.nome"
    )
    .whereIn("clienteId", idsClientes)
    .join("clientes", "clienteId", "=", "clientes.id")
    .then((contratos) => {
      if (contratos) {
        const result = contratos.map((contrato) => ({
          id: contrato.id,
          titulo: contrato.titulo,
          status: contrato.status,
          cliente: {
            id: contrato["cliente.id"],
            empresa: contrato["cliente.empresa"],
            nome: contrato["cliente.nome"],
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

contratosRouter.post("/contratos/:id_cliente", express.json(), (req, res) => {
  let id_cliente = +req.params.id_cliente;
  knex("contratos")
    .insert(
      {
        clienteId: id_cliente,
        status: req.body.status,
        titulo: req.body.titulo,
      },
      ["clienteId", "titulo", "status"]
    )
    .then((contratos) => {
      res.status(200).json(contratos[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

module.exports = contratosRouter;
