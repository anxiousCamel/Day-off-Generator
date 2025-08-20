/**
 * @file controllers/buttons.controller.js
 * @description Centraliza TODA a lógica de botões usando JS puro e event delegation.
 * - Redirecionamento para cadastro
 * - Excluir / Editar funcionário (linhas dinâmicas)
 * - Abrir Pop-up
 * - Gerar Escala (chama generateSchedule() exportada do main)
 */

/** Pega segura de um elemento por seletor (retorna null se não existir). */
function $(sel, root = document) {
    try { return root.querySelector(sel); } catch { return null; }
}

/** Pega todos (NodeList) com fallback vazio. */
function $all(sel, root = document) {
    try { return root.querySelectorAll(sel) ?? []; } catch { return []; }
}

/** Carrega lista do localStorage. */
function loadEmployees() {
    try {
        const raw = localStorage.getItem("funcionarios");
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    } catch { return []; }
}

/** Salva lista no localStorage. */
function saveEmployees(list) {
    localStorage.setItem("funcionarios", JSON.stringify(list));
}

/** Corrige cor da coluna "camisa" na tabela de listagem (coluna 2). */
function paintShirtColumn(tr) {
    const tdCamisa = tr?.children?.[2];
    if (!tdCamisa) return;
    const v = (tdCamisa.textContent || "").trim().toLowerCase();
    if (v === "cinza") tdCamisa.style.backgroundColor = "grey";
    if (v === "vermelha") tdCamisa.style.backgroundColor = "red";
}

/** Aplica pintura nas linhas existentes (se a listagem estiver nesta página). */
function applyInitialPaint() {
    const rows = $all("#todos-funcionarios tr");
    rows.forEach(paintShirtColumn);
}

/** Cria listener de redirecionamento para botões .button-redi */
function bindRedirectButtons() {
    const buttons = $all(".button-redi");
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            window.location = "../criarFuncionario/cadastro.html";
        });
    });
}

/** Event delegation para excluir/editar dentro do #todos-funcionarios */
function bindEmployeeTableActions() {
    const tbody = $("#todos-funcionarios");
    if (!tbody) return; // página pode não ter essa tabela

    // pinta linhas novas adicionadas dinamicamente
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.tagName === "TR") paintShirtColumn(node);
            });
        });
    });
    observer.observe(tbody, { childList: true });

    tbody.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        // EXCLUIR
        if (target.classList.contains("Excluir")) {
            e.preventDefault();
            const tr = target.closest("tr");
            if (!tr) return;

            const nome = tr.children?.[0]?.textContent?.trim();
            if (!nome) return;

            const funcionarios = loadEmployees();
            const idx = funcionarios.findIndex(f => f?.nome === nome);

            if (idx >= 0) {
                funcionarios.splice(idx, 1);
                saveEmployees(funcionarios);
                tr.remove();
            }
            return;
        }

        // EDITAR
        if (target.classList.contains("Editar")) {
            e.preventDefault();
            const tr = target.closest("tr");
            if (!tr) return;

            const nome = tr.children?.[0]?.textContent?.trim();
            if (!nome) return;

            const funcionarios = loadEmployees();
            const idx = funcionarios.findIndex(f => f?.nome === nome);

            if (idx >= 0) {
                // IMPORTANTE: remover qualquer "zz" que quebrava antes
                window.location = `../editarFuncionario/editar.html?index=${idx}`;
            }
            return;
        }
    });
}

/** Botão para abrir popup (id opcional: #btn-popup) */
function bindPopupButton() {
    const btn = $("#btn-popup");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.open("../escalaPop/pop.html", "popup", "width=900,height=1000");
    });
}

/**
 * Conecta o botão "Gerar" à função generateSchedule exportada pelo main.
 * Requisito: o main deve expor window.__schedule_generate ou export nomeado.
 */
function bindGenerateButton() {
    const btn = $("#btn-gerar"); // defina id="btn-gerar" no botão gerar
    if (!btn) return;

    btn.addEventListener("click", async (e) => {
        e.preventDefault();
        // 1ª opção: se o main expôs global
        if (typeof window.__schedule_generate === "function") {
            window.__schedule_generate();
            return;
        }
        // 2ª opção: fallback – tenta disparar change no input #mes se seu main ouve isso
        const mes = $("#mes");
        if (mes) mes.dispatchEvent(new Event("change"));
    });
}

/** Opcional: defensivo para inputs padrões que o main usa. */
function bindMonthEnterToGenerate() {
    const mes = $("#mes");
    const btn = $("#btn-gerar");
    if (!mes || !btn) return;
    mes.addEventListener("keypress", (e) => {
        if (e.key === "Enter") btn.click();
    });
}

/** @file controllers/buttons.controller.js */

function $(sel, root = document) { try { return root.querySelector(sel); } catch { return null; } }

export function initButtonsController() {
    // Adicionar funcionário
    const btnAdd = $("#btn-add-func");
    if (btnAdd) btnAdd.addEventListener("click", (e) => {
        e.preventDefault();
        window.location = "../criarFuncionario/cadastro.html";
    });

    // Escolher turno (popup)
    const btnTurno = $("#btn-escolher-turno");
    if (btnTurno) btnTurno.addEventListener("click", (e) => {
        e.preventDefault();
        window.open("../escalaPop/pop.html", "popup", "width=900,height=1000");
    });

    // Gerar escala
    const btnGerar = $("#btn-gerar");
    if (btnGerar) btnGerar.addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof window.__schedule_generate === "function") window.__schedule_generate();
    });

    // Enter no input mês também gera
    const mes = $("#mes");
    if (mes && btnGerar) mes.addEventListener("keypress", (e) => {
        if (e.key === "Enter") btnGerar.click();
    });
}


/** Inicializa todos os binds. Chame uma vez no main. */
export function initButtonsController() {
    applyInitialPaint();
    bindRedirectButtons();
    bindEmployeeTableActions();
    bindPopupButton();
    bindGenerateButton();
    bindMonthEnterToGenerate();
}
