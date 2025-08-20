/** @file main.js - HOTFIX SINGLE FILE (sem controllers) */
import { buildMonthDays } from "./modules/schedule.calendar.js";
import { assignBaseWorkDays } from "./modules/schedule.generator.js";
import {
  ensureSaturdayRule,
  injectGreyCoverage,
  enforceMaxSixStreak,
  ensureNoEmptyStore,
  ensureMonthlySaturdayOffAnd2Consecutive
} from "./modules/schedule.repair.js";
import { renderHeader, renderScheduleBody } from "./modules/ui.render.js";

/* =========================
 * UTILIDADES
 * ========================= */
const $ = (sel, root=document) => { try { return root.querySelector(sel); } catch { return null; } };
const $all = (sel, root=document) => { try { return root.querySelectorAll(sel) ?? []; } catch { return []; } };

function loadEmployees() {
  try {
    const raw = localStorage.getItem("funcionarios");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}
function saveEmployees(list) {
  localStorage.setItem("funcionarios", JSON.stringify(list));
}

/* =========================
 * LISTA DE FUNCIONÁRIOS (render + ações)
 * ========================= */
function paintShirt(td) {
  const v = (td.textContent || "").trim().toLowerCase();
  if (v === "cinza") td.style.backgroundColor = "grey";
  if (v === "vermelha") td.style.backgroundColor = "red";
}

function renderEmployeesTable() {
  const tbody = $("#todos-funcionarios");
  if (!tbody) return;

  const list = loadEmployees();
  tbody.innerHTML = "";

  list.forEach((f) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="col-nome">${f?.nome ?? ""}</td>
      <td>${f?.cargo ?? ""}</td>
      <td class="col-camisa">${f?.camisa ?? ""}</td>
      <td>${f?.setor ?? ""}</td>
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

function bindEmployeeTableActions() {
  const tbody = $("#todos-funcionarios");
  if (!tbody) return;

  tbody.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const tr = t.closest("tr");
    if (!tr) return;
    const nome = tr.querySelector(".col-nome")?.textContent?.trim();
    if (!nome) return;

    // Excluir
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
    // Editar
    if (t.classList.contains("btn-editar")) {
      e.preventDefault();
      const list = loadEmployees();
      const idx = list.findIndex(x => x?.nome === nome);
      if (idx >= 0) window.location = `../editarFuncionario/editar.html?index=${idx}`;
      return;
    }
  });
}

/* =========================
 * GERAR ESCALA (pipeline)
 * ========================= */
function generateSchedule() {
  const mesInput = $("#mes");
  if (!mesInput || !mesInput.value) { alert("Selecione um mês (YYYY-MM)."); return; }

  const [year, month] = mesInput.value.split("-").map(Number);
  const employees = loadEmployees();
  const days = buildMonthDays(year, month);

  // base 5x2
  const perEmp = assignBaseWorkDays(employees, { year, month });

  // reparos
  ensureSaturdayRule(employees, perEmp, { year, month });
  injectGreyCoverage(employees, perEmp, { year, month });
  enforceMaxSixStreak(perEmp);
  ensureNoEmptyStore(employees, perEmp, { year, month });
  ensureMonthlySaturdayOffAnd2Consecutive(employees, perEmp, { year, month });

  // render
  renderHeader(year, month, days);
  renderScheduleBody(perEmp);
}

// expõe global (se quiser chamar fácil do console)
window.__schedule_generate = generateSchedule;

/* =========================
 * BOTÕES (sem controllers)
 * ========================= */
function bindButtons() {
  // adicionar funcionário
  $("#btn-add-func")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location = "../criarFuncionario/cadastro.html";
  });

  // escolher turno (popup)
  $("#btn-escolher-turno")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.open("../escalaPop/pop.html", "popup", "width=900,height=1000");
  });

  // gerar escala
  $("#btn-gerar")?.addEventListener("click", (e) => {
    e.preventDefault();
    generateSchedule();
  });

  // Enter no input mês
  const mes = $("#mes");
  if (mes) {
    mes.addEventListener("keypress", (e) => {
      if (e.key === "Enter") $("#btn-gerar")?.click();
    });
  }
}

/* =========================
 * BOOT
 * ========================= */
function boot() {
  renderEmployeesTable();   // traz a lista do localStorage
  bindEmployeeTableActions();
  bindButtons();
}

// Em ES module, DOM já está pronto porque <script type="module"> é defer.
// Ainda assim, se quiser absoluto:
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
