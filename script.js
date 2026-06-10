const form = document.getElementById("formObjetivo");
const lista = document.getElementById("listaObjetivos");
const filtro = document.getElementById("filtro");

let objetivos =
JSON.parse(localStorage.getItem("objetivos")) || [];

const frases = [
    "Disciplina supera motivação.",
    "Pequenos passos geram grandes resultados.",
    "Consistência é mais importante que intensidade.",
    "O futuro depende do que você faz hoje."
];

document.getElementById("fraseMotivacao")
.textContent =
frases[Math.floor(Math.random()*frases.length)];

const temaSalvo =
localStorage.getItem("tema");

if(temaSalvo === "dark"){
    document.body.classList.add("dark");
}

document.getElementById("temaBtn")
.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "tema",
        document.body.classList.contains("dark")
        ? "dark"
        : "light"
    );
});

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const titulo =
    document.getElementById("titulo").value.trim();

    const prioridade =
    document.getElementById("prioridade").value;

    const data =
    document.getElementById("data").value;

    objetivos.push({

        id:Date.now(),

        titulo,

        prioridade,

        data,

        concluido:false
    });

    salvar();

    form.reset();
});

function salvar(){

    localStorage.setItem(
        "objetivos",
        JSON.stringify(objetivos)
    );

    renderizar();
}

function renderizar(){

    lista.innerHTML="";

    const tipo = filtro.value;

    let exibir = [...objetivos];

    if(tipo==="pendentes"){
        exibir = objetivos.filter(o=>!o.concluido);
    }

    if(tipo==="concluidos"){
        exibir = objetivos.filter(o=>o.concluido);
    }

    exibir.forEach(obj=>{

        const li =
        document.createElement("li");

        li.className="item";

        li.innerHTML=`
            <strong>${obj.titulo}</strong><br>
            ${obj.prioridade} • ${obj.data}
            <br><br>
            <button onclick="toggle(${obj.id})">
                ✔
            </button>

            <button onclick="remover(${obj.id})">
                🗑
            </button>
        `;

        if(obj.concluido){
            li.classList.add("concluido");
        }

        lista.appendChild(li);
    });

    atualizarProgresso();
}

function toggle(id){

    objetivos = objetivos.map(o=>{

        if(o.id===id){
            o.concluido=!o.concluido;
        }

        return o;
    });

    salvar();
}

function remover(id){

    objetivos =
    objetivos.filter(o=>o.id!==id);

    salvar();
}

function atualizarProgresso(){

    const total = objetivos.length;

    const concluidos =
    objetivos.filter(o=>o.concluido).length;

    const pendentes =
    total-concluidos;

    document.getElementById("totalObjetivos")
    .textContent=total;

    document.getElementById("concluidos")
    .textContent=concluidos;

    document.getElementById("pendentes")
    .textContent=pendentes;

    const percentual =
    total===0
    ? 0
    : Math.round(
        concluidos/total*100
    );

    document.getElementById("percentual")
    .textContent=`${percentual}%`;

    document.getElementById("progresso")
    .style.width=`${percentual}%`;
}

filtro.addEventListener(
    "change",
    renderizar
);

const historico =
JSON.parse(
localStorage.getItem("historicoCep")
) || [];

const listaHistorico =
document.getElementById("historicoCep");

function atualizarHistorico(){

    listaHistorico.innerHTML="";

    historico.forEach(item=>{

        const li =
        document.createElement("li");

        li.className="item";

        li.textContent=item;

        listaHistorico.appendChild(li);
    });
}

document.getElementById("buscarCep")
.addEventListener("click",async()=>{

    const cep =
    document.getElementById("cep")
    .value.replace(/\D/g,"");

    if(cep.length!==8){

        alert("CEP inválido");

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
        .innerHTML=`
            <p>${dados.logradouro}</p>
            <p>${dados.bairro}</p>
            <p>${dados.localidade}</p>
            <p>${dados.uf}</p>
        `;

        historico.unshift(cep);

        localStorage.setItem(
            "historicoCep",
            JSON.stringify(historico)
        );

        atualizarHistorico();

    }catch{

        alert("Erro ao consultar CEP.");
    }
});

renderizar();
atualizarHistorico();
