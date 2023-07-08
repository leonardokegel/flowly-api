const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./src/routes/userRouter");
const propostasRouter = require("./src/routes/propostasRouter");
const clientesRouter = require("./src/routes/clientesRouter");
const contratosRouter = require("./src/routes/contratosRouter");
const projetosRouter = require("./src/routes/projetosRouter");

const port = process.env.PORT || 3000;
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use("/users", userRouter);
app.use("/propostas/v1", propostasRouter);
app.use("/clientes/v1", clientesRouter);
app.use('/contratos/v1', contratosRouter);
app.use('/projetos/v1', projetosRouter);

app.listen(port, () => {
  console.info(`App rodando na porta ${port}`);
});
