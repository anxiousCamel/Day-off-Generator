/** @file controllers/employees.controller.js */

function $(sel, root = document) { try { return root.querySelector(sel); } catch { return null; } }
function $all(sel, root = document) { try { return root.querySelectorAll(sel) ?? []; } catch { return []; } }

function loadEmployees() {
    try { const raw = localStorage.getItem("funcionarios"); const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; }
    catch { return []; }
}
function saveEmployees(list) { localStorage.setItem("funcionarios", JSON.stringify(list)); }

function paintShirt(td) {
    const v = (td.textContent || "").trim().toLowerCase();
    if (v === "cinza") td.style.backgroundColor = "grey";
    if (v === "vermelha") td.style.backgroundColor = "red";
}

/** Renderiza tabela #todos-funcionarios */
function renderEmployeesTable() {
    const tbody = $("#todos-funcionarios");
    if (!tbody) return;

    const list = loadEmployees();
    tbody.innerHTML = "";

    list.forEach((f) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td class="col-nome">${f.nome ?? ""}</td>
      <td>${f.cargo ?? ""}</td>
      <td class="col-camisa">${f.camisa ?? ""}</td>
      <td>${f.setor ?? ""}</td>
      <td>
        <button class="btn-excluir">Excluir</button>
        <button class="btn-editar">Editar</button>
      </td>
    `;
        tbody.appendChild(tr);
        const tdCamisa = tr.querySelector(".col-camisa");
        if (tdCamisa) paintShirt(tdCamisa);
    });
}

/** Delegação: excluir / editar */
function bindTableActions() {
    const tbody = $("#todos-funcionarios");
    if (!tbody) return;

    tbody.addEventListener("click", (e) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;
        const tr = t.closest("tr");
        if (!tr) return;
        const nome = tr.querySelector(".col-nome")?.textContent?.trim();
        if (!nome) return;

        if (t.classList.contains("btn-excluir")) {
            e.preventDefault();
            const list = loadEmployees();
            const idx = list.findIndex(x => x?.nome === nome);
            if (idx >= 0) {
                list.splice(idx, 1);
                saveEmployees(list);
                tr.remove();
            }
            return;
        }

        if (t.classList.contains("btn-editar")) {
            e.preventDefault();
            const list = loadEmployees();
            const idx = list.findIndex(x => x?.nome === nome);
            if (idx >= 0) window.location = `../editarFuncionario/editar.html?index=${idx}`;
            return;
        }
    });
}

export function initEmployeesController() {
    renderEmployeesTable();
    bindTableActions();
}
