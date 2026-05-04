const form = document.getElementById("form");
const lista = document.getElementById("lista");
const temaBtn = document.getElementById("tema");
const contador = document.getElementById("contador");

let objetivos = [];

// 🌙 Tema (FUNCIONANDO)
temaBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// ➕ Adicionar objetivo
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const prioridade = document.getElementById("prioridade").value;
  const data = document.getElementById("data").value;

  if (!titulo) return;

  objetivos.push({
    id: Date.now(),
    titulo,
    prioridade,
    data,
    concluido: false
  });

  renderizar();
  form.reset();
});

// 🎨 Renderizar lista + contador
function renderizar() {
  lista.innerHTML = "";

  let concluidos = 0;

  objetivos.forEach(obj => {
    const li = document.createElement("li");

    const texto = document.createElement("span");
    texto.textContent = `${obj.titulo} - ${obj.data}`;

    if (obj.concluido) {
      texto.classList.add("concluido");
      concluidos++;
    }

    const btn = document.createElement("button");
    btn.textContent = "✔";
    btn.onclick = () => toggle(obj.id);

    li.appendChild(texto);
    li.appendChild(btn);
    lista.appendChild(li);
  });

  contador.textContent = concluidos;
}

// ✔ Concluir objetivo
function toggle(id) {
  objetivos = objetivos.map(obj => {
    if (obj.id === id) {
      obj.concluido = !obj.concluido;
    }
    return obj;
  });

  renderizar();
}

// ==========================
// 🔥 API LOCAL (frases.json)
// ==========================
async function carregarFrase() {
  const el = document.getElementById("frase");

  try {
    el.innerText = "Carregando...";

    const response = await fetch("frases.json");

    if (!response.ok) throw new Error("Erro ao carregar JSON");

    const data = await response.json();

    const randomIndex = Math.floor(Math.random() * data.length);
    const item = data[randomIndex];

    el.innerText = `"${item.frase}"`;

  } catch (error) {
    console.error("Erro:", error);

    // fallback (IMPORTANTE)
    const frasesFallback = [
      "Disciplina supera motivação",
      "Feito é melhor que perfeito",
      "Consistência cria resultados"
    ];

    const random = Math.floor(Math.random() * frasesFallback.length);
    el.innerText = frasesFallback[random];
  }
}

// 🚀 iniciar
carregarFrase();