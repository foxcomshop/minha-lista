const listaEl = document.getElementById("lista");
const adicionarBtn = document.getElementById("adicionarBtn");
const excluirBtn = document.getElementById("excluirBtn");
const moverCimaBtn = document.getElementById("moverCimaBtn");
const moverBaixoBtn = document.getElementById("moverBaixoBtn");

function renderLista(lista) {
  listaEl.innerHTML = "";
  lista.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" data-id="${item.id}">
      <span>${item.texto}</span>
    `;
    listaEl.appendChild(li);
  });
}

function carregarLista() {
  fetch("/api/lista")
    .then(res => res.json())
    .then(renderLista);
}

adicionarBtn.addEventListener("click", () => {
  const novoItem = document.getElementById("novoItem").value;
  if (!novoItem) return;

  fetch("/api/lista", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item: novoItem })
  }).then(() => {
    document.getElementById("novoItem").value = "";
    carregarLista();
  });
});

excluirBtn.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll("#lista input[type='checkbox']:checked");
  checkboxes.forEach(checkbox => {
    const id = checkbox.dataset.id;
    fetch(`/api/lista/${id}`, { method: "DELETE" }).then(carregarLista);
  });
});

moverCimaBtn.addEventListener("click", () => {
  moverItemSelecionado(-1);
});

moverBaixoBtn.addEventListener("click", () => {
  moverItemSelecionado(1);
});

function moverItemSelecionado(direcao) {
  const checkboxes = [...document.querySelectorAll("#lista input[type='checkbox']")];
  const index = checkboxes.findIndex(cb => cb.checked);

  if (index === -1) return; // nenhum marcado
  const novoIndex = index + direcao;
  if (novoIndex < 0 || novoIndex >= checkboxes.length) return; // fora do range

  // reordenar a lista no servidor
  fetch("/api/lista")
    .then(res => res.json())
    .then(lista => {
      const item = lista[index];
      lista.splice(index, 1);
      lista.splice(novoIndex, 0, item);

      // sobrescrever lista no servidor
      fetch("/api/lista/ordenar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novaLista: lista })
      }).then(carregarLista);
    });
}

carregarLista();
