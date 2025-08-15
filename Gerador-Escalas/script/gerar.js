// const buttonGerar = document.getElementsByClassName("#button-")
const buttonAdd = document.getElementsByClassName("button-Add")

function cadastrar(e){
    e.preventDefault();
    window.location = "../criarFuncionario/cadastro.html"
    console.log("teste")
}

for(let btn of buttonAdd){
    btn.addEventListener("click", cadastrar);
}
