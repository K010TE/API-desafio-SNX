const express = require('express');
const bodyParser = require('body-parser');
const Post = require('../models/Post');
const sequelize = require('../database');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Para entender JSON no corpo das requisições

// Rota para listar todos os posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar posts' });
  }
});

// Rota para criar um novo post
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.create({ title, content });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// Rota para atualizar um post
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    post.title = title;
    post.content = content;
    await post.save();
    return res.json(post); // Retorna o post atualizado
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar post' });
  }
});

// Rota para deletar um post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    await post.destroy();
    return res.status(204).send(); // Retorna status 204 (sem conteúdo)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

// Iniciar o servidor
app.listen(port, async () => {
  console.log(`API ouvindo na porta ${port}`);
  // Sincroniza o banco de dados e cria as tabelas se não existirem
  await sequelize.sync();
});
