const formEntrega = document.getElementById("formEntrega");
const listaEntregas = document.getElementById("listaEntregas");
const filtro = document.getElementById("filtro");
const temaBtn = document.getElementById("temaBtn");

let entregas =
JSON.parse(localStorage.getItem("entregas")) || [];

let historicoCep =
JSON.parse(localStorage.getItem("historicoCep")) || [];

/* FRASES */

const frases = [

    "Disciplina supera motivação.",

    "Pequenos passos geram grandes resultados.",

    "Consistência é melhor que intensidade.",

    "Seu futuro é criado hoje.",

    "Uma entrega por vez gera grandes conquistas.",

    "Organização transforma metas em resultados."
];

function novaFrase(){

    const frase =
    frases[Math.floor(Math.random() * frases.length)];

    document.getElementById(
        "fraseMotivacao"
    ).textContent = frase;
}

document
.getElementById("novaFrase")
.addEventListener("click", novaFrase);

novaFrase();

/* TEMA */

if(localStorage.getItem("tema") === "dark"){

    document.body.classList.add("dark");
}

temaBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "tema",
        document.body.classList.contains("dark")
        ? "dark"
        : "light"
    );
});

/* FORM */

formEntrega.addEventListener(
    "submit",
    async (e)=>{

        e.preventDefault();

        const titulo =
        document.getElementById("titulo")
        .value.trim();

        const prioridade =
        document.getElementById("prioridade")
        .value;

        const data =
        document.getElementById("data")
        .value;

        const cep =
        document.getElementById("cepEntrega")
        .value.replace(/\D/g,'');

        if(cep.length !== 8){

            alert("CEP inválido.");
            return;
        }

        try{

            const resposta =
            await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
            );

            const endereco =
            await resposta.json();

            if(endereco.erro){

                alert("CEP não encontrado.");
                return;
            }

            entregas.push({

                id:Date.now(),

                titulo,

                prioridade,

                data,

                cep,

                endereco:

                `${endereco.logradouro},
                ${endereco.bairro},
                ${endereco.localidade}/${endereco.uf}`,

                concluida:false
            });

            salvar();

            formEntrega.reset();

        }catch{

            alert(
            "Erro ao consultar o CEP."
            );
        }
    }
);

/* SALVAR */

function salvar(){

    localStorage.setItem(
        "entregas",
        JSON.stringify(entregas)
    );

    renderizar();
}

/* RENDER */

function renderizar(){

    listaEntregas.innerHTML = "";

    let listaFiltrada = [...entregas];

    if(filtro.value === "pendentes"){

        listaFiltrada =
        entregas.filter(
            e=>!e.concluida
        );
    }

    if(filtro.value === "concluidas"){

        listaFiltrada =
        entregas.filter(
            e=>e.concluida
        );
    }

    listaFiltrada.forEach(entrega=>{

        const li =
        document.createElement("li");

        li.className =
        `entrega ${
            entrega.concluida
            ? "concluida"
            : ""
        }`;

        const prioridadeClasse =

        entrega.prioridade === "Alta"
        ? "prioridade-alta"

        : entrega.prioridade === "Média"
        ? "prioridade-media"

        : "prioridade-baixa";

        li.innerHTML = `

        <h3>
            📦 ${entrega.titulo}
        </h3>

        <p class="${prioridadeClasse}">
            🚩 ${entrega.prioridade}
        </p>

        <p>
            📅 ${formatarData(entrega.data)}
        </p>

        <p>
            📍 ${entrega.endereco}
        </p>

        <div class="acoes">

            <button
                class="btn-concluir"
                onclick="toggleEntrega(${entrega.id})"
            >
                ✔
            </button>

            <button
                class="btn-remover"
                onclick="removerEntrega(${entrega.id})"
            >
                🗑
            </button>

        </div>
        `;

        listaEntregas.appendChild(li);
    });

    atualizarProgresso();
}

/* DATA */

function formatarData(data){

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/* CONCLUIR */

function toggleEntrega(id){

    entregas = entregas.map(entrega=>{

        if(entrega.id === id){

            entrega.concluida =
            !entrega.concluida;
        }

        return entrega;
    });

    salvar();
}

/* REMOVER */

function removerEntrega(id){

    if(
        !confirm(
            "Deseja remover esta entrega?"
        )
    ) return;

    entregas =
    entregas.filter(
        entrega=>entrega.id !== id
    );

    salvar();
}

window.toggleEntrega =
toggleEntrega;

window.removerEntrega =
removerEntrega;

/* FILTRO */

filtro.addEventListener(
    "change",
    renderizar
);

/* PROGRESSO */

function atualizarProgresso(){

    const total =
    entregas.length;

    const concluidas =
    entregas.filter(
        e=>e.concluida
    ).length;

    const pendentes =
    total - concluidas;

    document.getElementById(
        "totalEntregas"
    ).textContent = total;

    document.getElementById(
        "concluidas"
    ).textContent = concluidas;

    document.getElementById(
        "pendentes"
    ).textContent = pendentes;

    const percentual =

    total === 0
    ? 0
    : Math.round(
        (concluidas / total) * 100
    );

    document.getElementById(
        "percentual"
    ).textContent =
    `${concluidas} de ${total} concluídas (${percentual}%)`;

    document.getElementById(
        "progresso"
    ).style.width =
    `${percentual}%`;
}

/* CONSULTA CEP */

document
.getElementById("buscarCep")
.addEventListener(
"click",
async ()=>{

    const cep =
    document
    .getElementById("cepBusca")
    .value
    .replace(/\D/g,'');

    if(cep.length !== 8){

        alert("CEP inválido.");
        return;
    }

    try{

        const resposta =
        await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
        );

        const dados =
        await resposta.json();

        document
        .getElementById("resultadoCep")
        .innerHTML = `

        <strong>Logradouro:</strong>
        ${dados.logradouro}<br>

        <strong>Bairro:</strong>
        ${dados.bairro}<br>

        <strong>Cidade:</strong>
        ${dados.localidade}<br>

        <strong>UF:</strong>
        ${dados.uf}
        `;

        historicoCep.unshift(cep);

        historicoCep =
        [...new Set(historicoCep)];

        historicoCep =
        historicoCep.slice(0,10);

        localStorage.setItem(
            "historicoCep",
            JSON.stringify(historicoCep)
        );

        atualizarHistorico();

    }catch{

        alert(
        "Erro ao consultar CEP."
        );
    }
});

/* HISTÓRICO */

function atualizarHistorico(){

    const lista =
    document.getElementById(
        "historicoCep"
    );

    lista.innerHTML = "";

    historicoCep.forEach(cep=>{

        const li =
        document.createElement("li");

        li.className = "entrega";

        li.textContent = cep;

        lista.appendChild(li);
    });
}

renderizar();
atualizarHistorico();
