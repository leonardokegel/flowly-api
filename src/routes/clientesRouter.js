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
  let view = req.query.view;
  let id_usuario = +req.params.id_usuario;

  if (view === "simples") {
    consultaClienteSimples(res, id_usuario);
  } else {
    consultaClienteDetalhado(res, id_usuario);
  }
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
      ["id", "userId", "empresa", "nome", "email"]
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

clientesRouter.delete("/clientes/:id_cliente", express.json(), (req, res) => {
  let id_cliente = +req.params.id_cliente;
  deletarCliente(id_cliente)
    .then(() => {
      res.status(204).json();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

clientesRouter.put("/clientes/:id_cliente", express.json(), (req, res) => {
  let id_cliente = +req.params.id_cliente;
  knex("clientes")
    .where({ id: id_cliente })
    .update(
      {
        empresa: req.body.empresa,
        nome: req.body.nome,
        email: req.body.email,
      },
      ["id", "userId", "empresa", "nome", "email"]
    )
    .then((cliente) => {
      res.status(200).json(cliente[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
});

function consultaClienteDetalhado(res, id_usuario) {
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
}

function consultaClienteSimples(res, id_usuario) {
  knex
    .select("*")
    .from("clientes")
    .where({ userId: id_usuario })
    .then((clientes) => res.status(200).json(clientes))
    .catch(() => {
      res.status(500).json({
        mensagem: "Internal Server Error!",
      });
    });
}

function validaArray(array) {
  const result = array.filter((prop) => prop?.id !== null);
  if (result[0] === null) {
    return [];
  }
  return result;
}

/*
  Estamos utilizando o knex.transaction para realizar várias operações dentro do banco..
  Se todas as operações derem certo, a transação é confirmada, persistindo as alterações no bd..
  Caso uma falhe, a transação é revertida, desfazendo as alterações feitas até aquele ponto.
*/

async function deletarCliente(clienteId) {
  try {
    await knex.transaction(async (trx) => {
      // Excluir as propostas associadas ao cliente
      await trx("propostas").where("clienteId", clienteId).del();

      // Excluir os contratos associados ao cliente
      await trx("contratos").where("clienteId", clienteId).del();

      // Excluir o cliente
      await trx("clientes").where("id", clienteId).del();
    });
  } catch (error) {
    throw error;
  }
}

module.exports = clientesRouter;
