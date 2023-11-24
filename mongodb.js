const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const port = 3000;

mongoose
    .connect("mongodb://127.0.0.1:27017/fiapkids", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
        console.log("Conectado ao MongoDB");
    })
    .catch((err) => {
        console.error("Erro ao conectar com o MongoDB", err);
    });

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

const ProdutoSchema = new mongoose.Schema({
    produtoNome: { type: String, required: true },
    codigoProduto: { type: String, required: true },
    descricaoProduto: { type: String, required: true },
    fornecedorProduto: { type: String, required: true },
    dataFabricacao: { type: String, required: true },
    quantidadeEstoque: { type: Number, required: true }
});

const Servico = mongoose.model("Servico", ProdutoSchema);

app.post("/cadastrousuario", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send("Preencher todos os campos obrigatórios");
    }

    try {
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).send("O email informado já existe");
        }

        const novoUsuario = new Usuario({ nome, email, senha });
        await novoUsuario.save();
        res.status(201).send("Usuário cadastrado com sucesso");
        console.log('Usuário cadastrado com sucesso')
    } catch (error) {
        res.status(500).send("Erro ao cadastrar usuário");
    }
});

app.post("/cadastroProduto", async (req, res) => {
    const produtoNome = req.body.produtoNome;
    const codigoProduto = req.body.codigoProduto;
    const descricaoProduto = req.body.descricaoProduto;
    const fornecedorProduto = req.body.fornecedorProduto;
    const dataFabricacao = req.body.dataFabricacao;
    const quantidadeEstoque = req.body.quantidadeEstoque;

    if (
        !produtoNome ||
        !codigoProduto ||
        !descricaoProduto ||
        !fornecedorProduto ||
        !dataFabricacao ||
        !quantidadeEstoque
    ) {
        return res.status(400).send("Todos os campos são obrigatórios.");
    }

    try {
        const novoServico = new Servico({
            produtoNome,
            codigoProduto,
            descricaoProduto,
            fornecedorProduto,
            dataFabricacao,
            quantidadeEstoque
        });
        await novoServico.save();
        res.status(201).send("Informações sobre o serviço enviadas com sucesso.");
    } catch (error) {
        res.status(500).send("Erro ao salvar as informações do serviço.");
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});