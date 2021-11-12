const express = require ('express')
const router = express.Router()
const Usuario = require ('../models/usuario')
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')

router.post ('/login', (req, res) => {
    let user
    Usuario.findOne({email: req.body.email})
    .then(u => {
        user = u
        if (!u){
            return res.status(401).json({
                mensagem: "e-mail inválido"
            })
        }
        return bcrypt.compare(req.body.password, u.password)
    })
    .then (result => {
        if (!result){
            return res.status(401).json({
                mensagem : "senha inválida"
            })
        }
        const token = jwt.sign(
            {email: user.email, id: user._id},
            process.env.JWT_PASSWORD,
            {expiresIn: '1h'}
        )
        res.status(200).json({token})
    })
    .catch (err => {
        return res.status(401).json({
            mensagem : "Login falhou: " + err
        })
    })
})

router.post('/signup', (req, res) => {    
    bcrypt.hash( req.body.password, 10)
    .then(hash => {
        const usuario = new Usuario({
            email: req.body.email,
            password: hash
        })
        usuario.save()
        .then(result => {
            res.status(201).json({
                mensagem: "Usuário criado",
                resultado: result
            })
        })
        .catch (err => {
            res.status(500).json({
                erro: err
            })
        })
    })
})

module.exports = router