const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Cliente, Funcionario } = require('../models');
const AuthModel = require("../models/authModel.js");

require('dotenv').config();


const AuthController = {
    async register(req, res) {
        try {
            const { nome, email, senha, tipo_usuario, telefone, cep, cpf, area_atuacao } = req.body;
            if (!email || !senha || !nome) return res.status(400).json({ error: 'nome, email e senha obrigatórios' });

            let emailLower = email.toLowerCase();
            const existente = await Usuario.findOne({ where: { email: emailLower } });
            if (existente) return res.status(400).json({ error: 'Email já cadastrado' });


            const hash = await bcrypt.hash(senha, 10);
            const novo = await Usuario.create({ nome, email, senha: hash, tipo_usuario, telefone, cep });
            if (tipo_usuario == 'cliente') {
                await Cliente.create({ id_usuario: novo.id_usuario, pontos_fidelidade: 0 });
            } else if (tipo_usuario == 'funcionario') {
                if (!cpf) return res.status(400).json({ error: 'CPF obrigatório para funcionário' });
                const existenteCpf = await Funcionario.findOne({ where: { cpf } });
                if (existenteCpf) return res.status(400).json({ error: 'CPF já cadastrado' });
                await Funcionario.create({ id_usuario: novo.id_usuario, cpf, area_atuacao });
            }
            console.log('tipo_usuario',tipo_usuario);
            res.status(201).json({ message: 'Registrado', usuario: { id_usuario: novo.id_usuario, nome: novo.nome, email: novo.email } });
        } catch (error) {
            console.error('Erro ao registrar:', error);
            res.status(500).json({ error: 'Erro no servidor' });
        }
    },


    async login(req, res) {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) return res.status(400).json({ error: 'Email e senha obrigatórios' });

            let emailLower = email.toLowerCase();
            const user = await Usuario.findOne({ where: { email: emailLower } });
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
            console.log('user.tipo_usuario',user.tipo_usuario);


            const ok = await bcrypt.compare(senha, user.senha);
            if (!ok) return res.status(401).json({ error: 'Senha incorreta' });

            let pontos_fidelidade = null;
            if(user.tipo_usuario === 'cliente'){ 
                const cliente = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
                pontos_fidelidade = cliente.pontos_fidelidade;
            }
    
            const token = jwt.sign({ id: user.id_usuario, tipo_usuario: user.tipo_usuario }, process.env.JWT_SECRET || 'chave_dev', { expiresIn: '8h' });
            res.json({ message: 'Login ok', token, usuario: { 
                id_usuario: user.id_usuario, 
                nome: user.nome, 
                tipo_usuario: user.tipo_usuario,
                pontos_fidelidade 
            }});
        } catch (err) {
            console.error('Erro no login:', err);
            res.status(500).json({ error: 'Erro no servidor' });
        }
    }
};


module.exports = AuthController;