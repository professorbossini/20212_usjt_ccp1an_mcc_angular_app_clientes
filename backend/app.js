require('dotenv').config()
const path = require('path')
const express = require ('express')
const cors = require ('cors')
const app = express()
app.use(express.json())
app.use(cors())
const mongoose = require('mongoose');
const clienteRoutes = require ('./rotas/clientes')
const  usuarioRoutes = require ('./rotas/usuarios')

mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.${process.env.MONGODB_ADDRESS}.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`)
.then(() => {
  console.log("conexão ok")
}).catch((e) => {
  console.log(e.message)
});

app.use('/imagens', express.static(path.join("backend/imagens")));
app.use('/api/clientes', clienteRoutes)
app.use('/api/usuario', usuarioRoutes)

module.exports = app
