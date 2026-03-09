require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use(authRoutes);
app.use(orderRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("MongoDB conectado");

  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
  });

})
.catch((error) => {
  console.error(error);
});