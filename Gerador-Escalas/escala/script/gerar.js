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


//isso aqui é poara gerar os dias

function gerarCabecalho(ano, mes, qtdDias) {
    const thead = document.getElementById("theadEscala");
    thead.innerHTML = "";

    let semanasRow = "<tr><th rowspan='2'>Funcionário</th>";
    let diasRow = "<tr>";

    for (let d = 1; d <= qtdDias; d++) {
        if ((d - 1) % 7 === 0) {
            semanasRow += `<th colspan="7">Semana ${Math.ceil(d / 7)}</th>`;
        }
        diasRow += `<th>${d}/${mes}</th>`;
    }

    semanasRow += "</tr>";
    diasRow += "</tr>";

    thead.innerHTML = semanasRow + diasRow;
}




// essa parte gera os funcionarios


function gerarFuncionarios(qtdDias) {
    const tbody = document.getElementById("tbodyEscala");
    tbody.innerHTML = "";

    funcionarios.forEach(f => {
        let row = `<tr><td>${f.nome}</td>`;
        for (let d = 1; d <= qtdDias; d++) {
            row += `<td></td>`;
        }
        row += "</tr>";
        tbody.innerHTML += row;
    });
}

// essa árte pega os turnos e distribui na escala, se for folga o background fica vermelho

function exibirEscala(escala) {
    const tbody = document.getElementById("tbodyEscala");
    tbody.innerHTML = "";

    for (const [nome, dias] of Object.entries(escala)) {
        let row = `<tr><td>${nome}</td>`;
        dias.forEach(dia => {
            if (dia === "FOLGA") {
                row += `<td style="background-color: red; color: white;">${dia}</td>`;
            } else {
                row += `<td>${dia}</td>`;
            }
        });
        row += "</tr>";
        tbody.innerHTML += row;
    }
}


// aqui tem o input do mes, gerando os dias de acordo com o mes e ano selecionados e faz a matematica para distribuir os turnos seguindo as regras de escala

function gerarEscala(funcionarios, diasNoMes) {
    funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
    const mesInput = document.getElementById("mes").value;
    if (!mesInput) {
        alert("Por favor, selecione um mês.");
        return;
    }

    const [ano, mes] = mesInput.split("-");
    const ultimoDia = new Date(ano, mes, 0).getDate();

    gerarCabecalho(ano, mes, ultimoDia);
    gerarFuncionarios(ultimoDia);

    let escala = {};

    funcionarios.forEach(f => {
        escala[f.nome] = [];
        let domingoFolga = (f.camisa === "vermelha" || f.camisa === "cinza" && f.setor === "comercial");
        let domingoAlternado = (f.turno === "5x2");

        for (let dia = 1; dia <= ultimoDia; dia++) {
            let diaSemana = new Date(ano, mes - 1, dia).getDay();

            if (diaSemana === 0 && domingoFolga) {
                escala[f.nome].push("FOLGA");
            } else if (diaSemana === 0 && domingoAlternado && Math.floor((dia - 1) / 7) % 2 === 0) {
                escala[f.nome].push("FOLGA");
            } else if (diaSemana === 6 && escala[f.nome].filter(d => d !== "FOLGA").length < 8) {
                escala[f.nome].push(f.turno);
            } else {
                let workedDays = escala[f.nome].filter(d => d !== "FOLGA").length;
                if (workedDays > 0 && workedDays % 6 === 0) {
                    escala[f.nome].push("FOLGA");
                } else {
                    escala[f.nome].push(f.turno);
                }
            }
        }
    });
    exibirEscala(escala, Object.values(escala)[0]?.length || 0);
    return escala;
}

