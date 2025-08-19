// const buttonGerar = document.getElementsByClassName("#button-")
const buttonRedi = document.getElementsByClassName("button-redi")




function redirecionar(e) {
    e.preventDefault();
    window.location = "../criarFuncionario/cadastro.html"
    console.log("teste")
}

for (let btn of buttonRedi) {
    btn.addEventListener("click", redirecionar);
}

let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
const tbody = document.getElementById("todos-funcionarios")

funcionarios.forEach((f, index) => {
    const tr = document.createElement("tr")
    tr.innerHTML = ` 
    <td>${f.nome}</td>
    <td>${f.cargo}</td>
    <td>${f.camisa}</td>
    <td>${f.setor}</td>
   
    <td>
    <button class="Excluir"> Excluir</button>
    <button class="Editar"> Editar</button>
    </td>   
    `
    const cargoTd = tr.children[1];
    if (f.camisa === "cinza") {
        cargoTd.style.backgroundColor = "Grey";
    } else if (f.camisa === "vermelha") {
        cargoTd.style.backgroundColor = "Red";
    }

    const buttonExcluir = tr.querySelector(".Excluir");
    buttonExcluir.addEventListener("click", () => {
        funcionarios.splice(index, 1);
        localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
        location.reload();

    })

    const buttonEditar = tr.querySelector(".Editar");
    buttonEditar.addEventListener("click", () => {
        window.location = `../editarFuncionario/editar.html?index=${index}`;
        zz
    })




    tbody.appendChild(tr)

});

function abrirPopUp() {
    newWindow = window.open("../escalaPop/pop.html", "popup", "width=900,height=1000");
}

funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];

function cabecalho(ano, mes, diaAll) {
    const thead = document.getElementById("theadEscala");
    thead.innerHTML = "";

    let nomes = "<tr> <th>Funcionários</th> </tr>";
    let semanaRow = "<tr> <th>semanas " ;
    let dias = "<tr><th >Dias";

    for (let d = 1; d <= diaAll; d++) {
        if ((d - 1) % 7 === 0) {
            semanaRow += `<th colspan="7">Semana ${Math.ceil(d / 7)}</th>`;
        }
        dias += `<th rowspan='2'>${d}/${mes}</th>`;
    }

    // semanaRow += "</tr>";
    // dias += "</tr>";

    thead.innerHTML = semanaRow + dias + nomes;
}

function gerarFuncionarios(qtdDias) {

    const tbody = document.getElementById("funcionarios-escala");
    tbody.innerHTML = "";
    funcionarios.forEach(f => {
        let row = `<tr> <td> ${f.nome} </td> `
        for (let d = 1; d <= qtdDias; d++) {
            row += `<td></td>`;
        }

        // row += "</tr>";
        tbody.innerHTML += row;
    })
}


function gerarEscala() {
    const mesInput = document.getElementById("mes").value;
    if (!mesInput) {
        alert("Por favor, selecione um mês.");
        return;
    }
    const [ano, mes] = mesInput.split("-").map(Number);
    const diaAll = new Date(ano, mes, 0).getDate();


    cabecalho(ano, mes, diaAll);
    gerarFuncionarios(diaAll);
}


















//isso aqui é para gerar os dias

// function gerarCabecalho(ano, mes, qtdDias) {
//     const thead = document.getElementById("theadEscala");
//     thead.innerHTML = "";

//     let semanasRow = "<tr><th rowspan='2'>Funcionário</th>";
//     let diasRow = "<tr>";

//     for (let d = 1; d <= qtdDias; d++) {
//         if ((d - 1) % 7 === 0) {
//             semanasRow += `<th colspan="7">Semana ${Math.ceil(d / 7)}</th>`;
//         }
//         diasRow += `<th>${d}/${mes}</th>`;
//     }

//     semanasRow += "</tr>";
//     diasRow += "</tr>";

//     thead.innerHTML = semanasRow + diasRow;
// }




// // essa parte gera os funcionarios


// function gerarFuncionarios(qtdDias) {
//     const tbody = document.getElementById("tbodyEscala");
//     tbody.innerHTML = "";

//     funcionarios.forEach(f => {
//         let row = `<tr><td>${f.nome}</td>`;
//         for (let d = 1; d <= qtdDias; d++) {
//             row += `<td></td>`;
//         }
//         row += "</tr>";
//         tbody.innerHTML += row;
//     });
// }

// // essa parte pega os turnos e distribui na escala, se for folga o background fica vermelho

// function preencherTabelaEscala(escala, ano, mes) {
//     const tbody = document.getElementById("funcionarios-escala");
//     tbody.innerHTML = ""; // limpa antes de renderizar

//     Object.keys(escala).forEach(nome => {
//         let tr = document.createElement("tr");

//         // primeira célula = nome do funcionário
//         let tdNome = document.createElement("td");
//         tdNome.textContent = nome;
//         tr.appendChild(tdNome);

//         // dias do mês
//         escala[nome].forEach((turno, i) => {
//             let td = document.createElement("td");

//             if (turno === "FOLGA") {
//                 td.textContent = "F";
//                 td.style.backgroundColor = "lightcoral";
//             } else {
//                 td.textContent = turno;
//                 td.style.backgroundColor = "smokewhite";
//             }

//             tr.appendChild(td);
//         });

//         tbody.appendChild(tr);
//     });
// }

// // aqui tem o input do mes, gerando os dias de acordo com o mes e ano selecionados e faz a matematica para distribuir os turnos seguindo as regras de escala

// function gerarEscalaBaseAleatoria(funcionarios, ano, mes, ultimoDia) {
//     let escala = {};

//     funcionarios.forEach(f => {
//         escala[f.nome] = [];
//         let diasTrabalhados = 0;
//         let folgasNaSemana = 0;

//         for (let dia = 1; dia <= ultimoDia; dia++) {
//             let diaSemana = new Date(ano, mes - 1, dia).getDay(); // 0=domingo, 1=segunda...

//             // reset contador semanal a cada domingo
//             if (diaSemana === 0) {
//                 folgasNaSemana = 0;
//             }

//             // --- domingo ---
//             if (diaSemana === 0) {
//                 if (f.turno === "5x2") {
//                     // alterna folga no domingo
//                     if (Math.random() < 0.5) {
//                         escala[f.nome].push("FOLGA");
//                         folgasNaSemana++;
//                         diasTrabalhados = 0;
//                         continue;
//                     }
//                 }
//             }

//             // --- sorteio de folga na semana ---
//             if (folgasNaSemana < 2 && diasTrabalhados >= 5 && Math.random() < 0.5) {
//                 escala[f.nome].push("FOLGA");
//                 folgasNaSemana++;
//                 diasTrabalhados = 0;
//                 continue;
//             }

//             // se não caiu em nenhuma folga, trabalha
//             escala[f.nome].push(f.turno);
//             diasTrabalhados++;
//         }
//     });

//     return escala;
// }


// function ajustarEscalaGlobal(escala, funcionarios, ano, mes, ultimoDia) {
//     for (let dia = 1; dia <= ultimoDia; dia++) {
//         const diaIndex = dia - 1;

//         // quem está trabalhando neste dia
//         let trabalhando = funcionarios.filter(f => escala[f.nome][diaIndex] !== "FOLGA");
//         let folgando = funcionarios.filter(f => escala[f.nome][diaIndex] === "FOLGA");

//         // ====== Regra 1: mínimo 4 trabalhando ======
//         if (trabalhando.length < 4) {
//             let faltam = 4 - trabalhando.length;
//             let escolhidos = folgando.slice(0, faltam); // pega primeiros da lista (pode randomizar)
//             escolhidos.forEach(f => {
//                 escala[f.nome][diaIndex] = f.turno;
//                 trabalhando.push(f);
//             });
//         }

//         // ====== Regra 2: mínimo 2 abertura ======
//         let abertura = trabalhando.filter(f => f.turno === "abertura");
//         if (abertura.length < 2) {
//             let candidatos = folgando.filter(f => f.turno === "abertura" && f.camisa === "cinza");
//             while (abertura.length < 2 && candidatos.length > 0) {
//                 let f = candidatos.shift();
//                 escala[f.nome][diaIndex] = "abertura";
//                 abertura.push(f);
//             }
//         }

//         // ====== Regra 3: mínimo 2 fechamento ======
//         let fechamento = trabalhando.filter(f => f.turno === "fechamento");
//         if (fechamento.length < 2) {
//             let candidatos = folgando.filter(f => f.turno === "fechamento" && f.camisa === "cinza");
//             while (fechamento.length < 2 && candidatos.length > 0) {
//                 let f = candidatos.shift();
//                 escala[f.nome][diaIndex] = "fechamento";
//                 fechamento.push(f);
//             }
//         }
//     }

//     return escala;
// }

// // ===== Função final que gera a escala =====
// function gerarEscalaCompleta(funcionarios, ano, mes) {
//     const ultimoDia = new Date(ano, mes, 0).getDate();
//     let escalaBase = gerarEscalaBaseAleatoria(funcionarios, ano, mes, ultimoDia);
//     let escalaFinal = ajustarEscalaGlobal(escalaBase, funcionarios, ano, mes, ultimoDia);
//     return escalaFinal;
// }


// function gerarEscala() {
//     const mesInput = document.getElementById("mes").value;
//     if (!mesInput) {
//         alert("Selecione o mês");
//         return;
//     }

//     const [ano, mes] = mesInput.split("-").map(Number);

//     let escala = gerarEscalaCompleta(funcionarios, ano, mes);
//     gerarCabecalho(ano, mes, qtdDias = new Date(ano, mes, 0).getDate());
//     preencherTabelaEscala(escala, ano, mes);
// }
