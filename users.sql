CREATE DATABASE flowly;

\c flowly

CREATE SEQUENCE user_id_seq;

CREATE TABLE users (
    id int NOT NULL DEFAULT nextval('user_id_seq'),
    email varchar(200) NOT NULL,
    senha varchar(200) NOT NULL,
    nome varchar(200) NOT NULL,
    CONSTRAINT usuario_pk PRIMARY KEY (id)
)