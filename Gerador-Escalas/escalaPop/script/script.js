let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
const tbody = document.getElementById("todos-funcionarios")
const salvarTurnos = document.getElementsByClassName("buttonSave")[0];

funcionarios.forEach((f, index) => {
    const tr = document.createElement("tr")
    tr.innerHTML = ` 
    <td>${f.nome}</td>
    <td>${f.cargo}</td>
    <td>${f.camisa}</td>
    <td>${f.setor}</td>
    <td>
        <select id="turno-${index}">
        <option value=""> Selecione o turno</option>
        <option value="07:30h/17h ">Abertura</option>
        <option value=" 08:00h/17:13h" > 08:00h / 17:13h </option>
        <option value="08:30h/17:48h"> 08:30h / 17:48h </option>
        <option value="09:15h/19:13h"> 09:15h / 19:13h </option>
        <option value="10:15h/20:15h"> 10:15h / 20:15h </option>
        <option value="Fechamento">Fechamento</option>
        <option value="08:00h/17:13h">(comercial) 08:00h / 17:13h</option>
        <option value="09:00h/18:00h">(comercial) 09:00h / 18:00h</option>
        <option value="10h/20h">(comercial) 10h / 20h</option>
        </select>
    </td>   
  
    `
    tbody.appendChild(tr)


    const cargoTd = tr.children[1];
    if (f.camisa === "cinza") {
        cargoTd.style.backgroundColor = "Grey";
    } else if (f.camisa === "vermelha") {
        cargoTd.style.backgroundColor = "Red";
    }
    if (f.turno) {
        document.getElementById(`turno-${index}`).value = f.turno
    }


});

salvarTurnos.addEventListener("click", () => {
    let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];

    funcionarios.forEach((f, index) => {
        const select = document.getElementById(`turno-${index}`);
        f.turno = select.value;
    });

    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    alert("Turnos salvos com sucesso!");
    window.close();
});

