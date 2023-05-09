/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("usuarios").del();
  await knex("usuarios").insert([
    {
      nome: "teste1",
      email: "teste2@gmail.com",
      senha: "123456",
    },
    {
      nome: "teste2",
      email: "teste2@gmail.com",
      senha: "123456",
    },
  ]);
};
