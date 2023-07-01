/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("contratos", function (table) {
    table.increments().primary();
    table.integer("clienteId", 4).references("clientes.id");
    table.string("titulo", 255).notNullable();
    table.integer("status", 4).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("contratos");
};
