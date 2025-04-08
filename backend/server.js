const express = require('express');
const path = require('path');
const app = express(); // << ISSO TEM QUE VIR ANTES DAS ROTAS
const PORT = process.env.PORT || 3000;

let lista = [];
let proximoId = 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ROTAS
app.get('/api/lista', (req, res) => {
  res.json(lista);
});

app.post('/api/lista', (req, res) => {
  const { item } = req.body;
  if (item) {
    lista.push({ id: proximoId++, texto: item });
    res.status(201).json({ sucesso: true });
  } else {
    res.status(400).json({ erro: 'Item não fornecido' });
  }
});

app.delete('/api/lista/:id', (req, res) => {
  const id = parseInt(req.params.id);
  lista = lista.filter(item => item.id !== id);
  res.json({ sucesso: true });
});

// NOVA ROTA PARA REORDENAR
app.post('/api/lista/ordenar', (req, res) => {
  const { novaLista } = req.body;
  if (Array.isArray(novaLista)) {
    lista = novaLista;
    res.json({ sucesso: true });
  } else {
    res.status(400).json({ erro: 'Lista inválida' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
