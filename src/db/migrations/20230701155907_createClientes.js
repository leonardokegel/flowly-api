/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("clientes", function (table) {
    table.increments().primary();
    table.integer("userId", 4).references("usuarios.id");
    table.string("empresa", 200).notNullable();
    table.string("nome", 200).notNullable();
    table.string("email", 250).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 *
 */

exports.down = function (knex) {
  return knex.schema.dropTable("clientes");
};
