/** @module ui/render */
import { buildMonthDays, splitByWeeks } from "./schedule.calendar.js";

export function renderHeader(year, month, totalDaysOrDaysMeta) {
  const thead = document.getElementById("theadEscala");
  thead.innerHTML = "";

  // Aceita array de days meta (melhor) ou número (fallback)
  const days = Array.isArray(totalDaysOrDaysMeta)
    ? totalDaysOrDaysMeta
    : buildMonthDays(year, month);

  const weeks = splitByWeeks(year, month);

  // Linha "Semanas"
  const trWeeks = document.createElement("tr");
  const thW = document.createElement("th");
  thW.textContent = "Semanas";
  trWeeks.appendChild(thW);

  weeks.forEach(w => {
    const th = document.createElement("th");
    th.colSpan = (w.end - w.start + 1);
    th.textContent = `Semana ${w.week}`;
    trWeeks.appendChild(th);
  });

  // Linha "Dias"
  const trDays = document.createElement("tr");
  const thD = document.createElement("th");
  thD.textContent = "Dias";
  trDays.appendChild(thD);
  days.forEach(d => {
    const th = document.createElement("th");
    th.textContent = `${d.day}/${month}`;
    trDays.appendChild(th);
  });

  // Linha "Funcionários" (vazia para alinhar)
  const trNames = document.createElement("tr");
  const thN = document.createElement("th");
  thN.textContent = "Funcionários";
  trNames.appendChild(thN);
  for (let i = 0; i < days.length; i++) trNames.appendChild(document.createElement("th"));

  thead.appendChild(trWeeks);
  thead.appendChild(trDays);
  thead.appendChild(trNames);
}

export function renderScheduleBody(perEmp) {
  const tbody = document.getElementById("funcionarios-escala");
  tbody.innerHTML = "";
  for (const [name, days] of Object.entries(perEmp)) {
    const tr = document.createElement("tr");
    const tdN = document.createElement("td"); tdN.textContent = name; tr.appendChild(tdN);
    days.forEach(cell => {
      const td = document.createElement("td");
      if (cell === "FOLGA") { td.textContent = "FOLGA"; td.style.backgroundColor = "lightcoral"; }
      else { td.textContent = cell.label; td.title = cell.role || "PADRÃO"; td.style.backgroundColor = "whitesmoke"; }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
}
