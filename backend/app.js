require('dotenv').config()
const express = require ('express')
const cors = require ('cors')
const app = express()
app.use(express.json())
app.use(cors())

const mongoose = require('mongoose');
const Cliente = require('./models/cliente');
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.${process.env.MONGODB_ADDRESS}.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`)
.then(() => {
  console.log("conexão ok")
}).catch(() => {
  console.log("conexão nok")
});

const clientes = [
    {
        id: '1',
        nome: 'José',
        fone: '12345678',
        email: 'jose@email.com'
    },
    {
        id: '2',
        nome: 'Pedro',
        fone: '44774477',
        email: 'pedro@email.com'
    }
]

//GET localhost:3000/api/clientes
app.get('/api/clientes', (req, res) => {
  Cliente.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      mensagem: "Tudo OK",
      clientes: documents
    });
  });
});

//POST localhost:3000/api/clientes
app.post('/api/clientes', (req, res) => {
    const cliente = new Cliente({
      nome: req.body.nome,
      fone: req.body.fone,
      email: req.body.email
    })
    cliente.save()
    .then (clienteInserido => {
      console.log(cliente);
      res.status(201).json({
          mensagem: "Cliente inserido",
          id: clienteInserido._id
      })
    })
});

app.delete('/api/clientes/:id', (req, res, next) => {
  Cliente.deleteOne({_id: req.params.id})
  .then(resultado => {
    console.log(resultado)
    res.status(200).json({mensagem: "Cliente removido"});
  })
  
});

module.exports = app
