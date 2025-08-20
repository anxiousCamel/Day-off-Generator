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


// Cria o cabeçalho da tabela de escala com os dias do mês e semanas

function cabecalho(ano, mes, diaAll) {
    const thead = document.getElementById("theadEscala");
    thead.innerHTML = "";

    let nomes = "<tr> <th>Funcionários</th> </tr>";
    let semanaRow = "<tr> <th>semanas ";
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


//Cria o nome dos funcionarios na tabela de escala e as celulas para os dias

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

//Preenche a tabela com os turnos dos funcionarios previamente selecionados

function preencherTabela(escala, ano, mes) {
    const tbody = document.getElementById("funcionarios-escala");
    tbody.innerHTML = "";

    Object.keys(escala).forEach(nome => {

        let tr = document.createElement("tr");

        let tdNome = document.createElement("td");
        tdNome.textContent = nome;
        tr.appendChild(tdNome)

        escala[nome].forEach(turno => {
            let td = document.createElement("td")
            td.textContent = turno;
            td.style.backgroundColor = turno === "FOLGA" ? "lightcoral" : "smokeWhite";
            tr.appendChild(td)
        })

        tbody.appendChild(tr)
    })


}


function gerarFolgas(funcionarios, ano, mes, diaAll) {
    let escala = {};

    funcionarios.forEach(f => {
        escala[f.nome] = [];
        let semanaFolgas = [];
        let folgouDomingo = false;
        let diasTrabalhadosSeguidos = 0;


        for (let d = 1; d <= diaAll; d++) {
            let diaSemana = new Date(ano, mes - 1, d).getDay();

            if (diaSemana === 0) {
                semanaFolgas = [];
                folgouDomingo = false;

        
                if (Math.random() < 0.5) {
                    semanaFolgas.push(0);
                    folgouDomingo = true;
                }

           
                let qtdFolgasRestantes = folgouDomingo ? 1 : 2;

                while (semanaFolgas.length < (folgouDomingo ? 2 : 2)) {
                    let diaAleatorio = Math.floor(Math.random() * 6); // 0 a 6
                    if (!semanaFolgas.includes(diaAleatorio)) {
                        semanaFolgas.push(diaAleatorio);
                    }
                }
            }

            if (diasTrabalhadosSeguidos >= 6) {
                escala[f.nome].push("FOLGA");
                diasTrabalhadosSeguidos = 0;
                continue
            }
            if (semanaFolgas.includes(diaSemana)) {
                escala[f.nome].push("FOLGA");
                diasTrabalhadosSeguidos = 0
            } else {
                escala[f.nome].push(f.turno);
                diasTrabalhadosSeguidos++
            }
        }
    });

    return escala;
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
    const escala = gerarFolgas(funcionarios, ano, mes, diaAll)
    preencherTabela(escala, ano, mes);


}









