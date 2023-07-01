# flowly-api

criar: npx knex migrate:make nome_migration
rodar: npx knex migrate:latest
deletar: npx knex migrate:down

criar: npx knex seed:make 01_users
rodar: npx knex seed:run
