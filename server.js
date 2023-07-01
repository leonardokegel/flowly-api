const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const secRouter = require("./src/clientRouter");

const port = process.env.PORT || 3000;
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use("/users", secRouter);

app.listen(port, () => {
  console.info(`App rodando na porta ${port}`);
});
