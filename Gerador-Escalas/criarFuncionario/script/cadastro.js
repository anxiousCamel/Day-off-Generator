const buttonVoltar = document.getElementsByClassName("button-voltar");
const buttonAdd = document.getElementsByClassName("button-Add");
const form = document.querySelector(".formulario");

function voltar(e) {
    e.preventDefault();
    window.location = "../escala/escala.html"
}

for (let btn of buttonVoltar) {
    btn.addEventListener("click", voltar);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    const camisa = document.getElementById("camisa").value;
    const setor = document.getElementById("setor").value;

    const funcionario = { nome, cargo, camisa, setor };
    // console.log(funcionario);

    let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
    funcionarios.push(funcionario)
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

    alert("Funcionário cadastrado com sucesso!");
    window.location = "../escala/escala.html";
})

let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
const tbody = document.getElementById("todos-funcionarios")

funcionarios.forEach(f => {
    const tr = document.createElement("tr")
    tr.innerHTML = ` 
    <td>${f.nome}</td>
    <td>${f.cargo}</td>
    <td>${f.camisa}</td>
    <td>${f.setor}</td>
   
`
    const cargoTd = tr.children[1];
    if (f.camisa === "cinza") {
        cargoTd.style.backgroundColor = "Grey";
    } else if (f.camisa === "vermelha") {
        cargoTd.style.backgroundColor = "Red";
    }
    tbody.appendChild(tr)

});

