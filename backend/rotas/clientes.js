const express = require ('express');
const multer = require('multer');
const router = express.Router();
const Cliente = require('../models/cliente');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_EXTENSAO_MAPA = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
}

const armazenamento = multer.diskStorage({
  destination: (req, file, callback) => {
    let e = MIME_TYPE_EXTENSAO_MAPA[file.mimetype] ? null : new Error('Mime Type Inválido');
    callback(e, "backend/imagens")
  },
  filename: (req, file, callback) => {
    const nome = file.originalname.toLowerCase().split(" ").join("-");
    const extensao = MIME_TYPE_EXTENSAO_MAPA[file.mimetype];
    callback(null, `${nome}-${Date.now()}.${extensao}`);
  }
})

//GET localhost:3000/api/clientes
router.get('', (req, res) => {
    const pageSize = +req.query.pagesize
    const page = +req.query.page
    let clientesEncontrados
    const consulta = Cliente.find()
    if (pageSize && page){
      consulta
        .skip(pageSize * (page - 1))
        .limit(pageSize)

    }
    consulta
    .then (documents => {
      clientesEncontrados = documents
      return Cliente.count()
    })
    .then(count => {
      res.status(200).json({
        mensagem: "Tudo OK",
        clientes: clientesEncontrados,
        maxClientes: count
      });
    });
});

//POST localhost:3000/api/clientes
router.post('', checkAuth, multer({storage: armazenamento}).single('imagem'), (req, res) => {
  const imagemURL = `${req.protocol}://${req.get('host')}`
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email,
    imagemURL: `${imagemURL}/imagens/${req.file.filename}`
  })
  cliente.save()
  .then (clienteInserido => {
    res.status(201).json({
      mensagem: "Cliente inserido",
      cliente: {
        id: clienteInserido._id,
        nome: clienteInserido.nome,
        fone: clienteInserido.fone,
        email: clienteInserido.email,
        imagemURL: clienteInserido.imagemURL
      }
    })
  })
});

router.delete('/:id', checkAuth, (req, res, next) => {
    Cliente.deleteOne({_id: req.params.id})
    .then(resultado => {
      console.log(resultado)
      res.status(200).json({mensagem: "Cliente removido"});
    })
  });

  router.put("/:id", checkAuth, multer({ storage: armazenamento}).single('imagem'),
  (req, res, next) => {
    console.log(req.file);
    let imagemURL = req.body.imagemURL
    if (req.file){
      const url = req.protocol + '://' + req.get('host')
      imagemURL = url + '/imagens/' + req.file.filename
    }
    const cliente = new Cliente({
      _id: req.params.id,
      nome: req.body.nome,
      fone: req.body.fone,
      email: req.body.email,
      imagemURL: imagemURL
    })
    Cliente.updateOne({_id: req.params.id}, cliente)
    .then((resultado) => {
      console.log(resultado);
    });
    res.status(200).json({mensagem: 'Atualização realizada com sucesso'})
  })

  router.get('/:id', (req, res, next) => {
    Cliente.findById(req.params.id)
    .then((cli) => {
      if (cli) {
        res.status(200).json(cli);
      }
      else
        res.status(404).json({mensagem: "Cliente não encontrado"})
    })
  });

  module.exports = router

