require("dotenv").config();
const express = require("express");
const knex = require("../db/knex");
const projetosRouter = express.Router();

projetosRouter.get("/projetos", express.json(), (req, res) => {
  let idsClientes = req.query.id?.split(",").map((e) => +e);
  if (!idsClientes) {
    res.status(400).json({
      mensagem: "Informe o(s) id(s) do cliente através do query params id",
      statusCode: 400,
    });
  }
  knex("projetos")
    .select(
      "projetos.id",
      "projetos.titulo",
      "projetos.status",
      "projetos.data_inicio",
      "projetos.valor",
      "clientes.id AS cliente.id",
      "clientes.empresa AS cliente.empresa",
      "clientes.nome AS cliente.nome"
    )
    .whereIn("clienteId", idsClientes)
    .join("clientes", "clienteId", "=", "clientes.id")
    .then((projetos) => {
      if (projetos) {
        const result = projetos.map((projeto) => ({
          id: projeto.id,
          titulo: projeto.titulo,
          status: projeto.status,
          data_inicio: projeto.data_inicio,
          valor: projeto.valor,
          cliente: {
            id: projeto["cliente.id"],
            empresa: projeto["cliente.empresa"],
            nome: projeto["cliente.nome"],
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

projetosRouter.post("/projetos/:id_cliente", express.json(), (req, res) => {
  let id_cliente = +req.params.id_cliente;
  knex("projetos")
    .insert(
      {
        clienteId: id_cliente,
        status: req.body.status,
        titulo: req.body.titulo,
        data_inicio: req.body.data_inicio,
        valor: req.body.valor,
      },
      ["id", "clienteId", "titulo", "status", "data_inicio", "valor"]
    )
    .then((projetos) => {
      res.status(200).json(projetos[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

projetosRouter.delete(
  "/projetos/:id_projeto",
  express.json(),
  (req, res) => {
    let id_projeto = +req.params.id_projeto;
    knex("projetos")
      .where({ id: id_projeto })
      .del()
      .then((projeto) => {
        if (projeto >= 1) {
          res.status(204).json();
        } else {
          res.status(404).json({
            message: "projeto não encontrado!",
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

projetosRouter.put("/projetos/:id_projeto", express.json(), (req, res) => {
  let id_projeto = +req.params.id_projeto;
  knex("projetos")
    .where({ id: id_projeto })
    .update(
      {
        status: req.body.status,
        titulo: req.body.titulo,
        data_inicio: req.body.data_inicio,
        valor: req.body.valor,
      },
      ["id", "clienteId", "titulo", "status", "data_inicio", "valor"]
    )
    .then((projeto) => {
      res.status(200).json(projeto[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

module.exports = projetosRouter;
