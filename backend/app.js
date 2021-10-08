const express = require ('express')
const cors = require ('cors')
const app = express()
app.use(express.json())

app.use(cors())

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
    res.status(200).json({
        mensagem: "Tudo OK",
        clientes: clientes
    })
})

//POST localhost:3000/api/clientes
app.post('/api/clientes', (req, res) => {
    const cliente = req.body
    console.log(cliente)
    res.status(201).json({
        mensagem: "Cliente inserido"
    })
})


module.exports = app