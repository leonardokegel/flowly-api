const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./src/routes/userRouter");
const propostasRouter = require("./src/routes/propostasRouter");
const clientesRouter = require("./src/routes/clientesRouter");

const port = process.env.PORT || 3000;
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use("/users", userRouter);
app.use("/propostas/v1", propostasRouter);
app.use("/clientes/v1", clientesRouter);

app.listen(port, () => {
  console.info(`App rodando na porta ${port}`);
});
