/** @module schedule/generator (v2 com capacidade por dia) */
import { SHIFT_PRESETS, ROLE } from "./schedule.constraints.js";
import { buildMonthDays, splitByWeeks, isSaturday } from "./schedule.calendar.js";

/** Configurável: mínimo de gente por dia */
function minStaffForWeekday(wd) { return wd === 6 ? 8 : 1; } // sábado=8, demais>=1

/** Escolhe dois índices NÃO adjacentes dentro da semana */
function pickNonAdjacent(indices, seed = 0) {
  if (indices.length <= 2) return [...indices];
  const r = (n) => (Math.abs(Math.sin(seed + n)) % 1);
  const i1 = Math.floor(r(1) * indices.length);
  let i2 = Math.floor(r(2) * indices.length);
  let tries = 0;
  while ((i2 === i1 || Math.abs(indices[i1] - indices[i2]) === 1) && tries < 30) {
    i2 = Math.floor(r(3 + tries) * indices.length);
    tries++;
  }
  const a = indices[i1], b = indices[i2];
  return [Math.min(a, b), Math.max(a, b)];
}

/** Escolhe um PAR CONSECUTIVO dentro da semana (evita sábado p/ vermelho) */
function pickConsecutive(indices, days, isRed, seed = 0) {
  // tenta usar sábado+vizinho se não for vermelho
  if (!isRed) {
    const sat = indices.find(i => isSaturday(days[i].weekday));
    if (sat !== undefined) {
      const r = sat + 1, l = sat - 1;
      if (indices.includes(r) && days[r].weekIndex === days[sat].weekIndex) return [sat, r];
      if (indices.includes(l) && days[l].weekIndex === days[sat].weekIndex) return [l, sat];
    }
  }
  // qualquer par adjacente válido
  const sorted = [...indices].sort((a, b) => a - b);
  for (let k = 0; k < sorted.length - 1; k++) {
    const a = sorted[k], b = sorted[k + 1];
    if (b - a === 1 && !(isRed && isSaturday(days[b].weekday))) return [a, b];
  }
  // fallback
  return pickNonAdjacent(indices, seed);
}

/** Aloca 2 folgas na semana respeitando CAPACIDADE por dia (para não “zerar” a loja) */
function placeWeekOffs({ weekIndices, days, isRed, wantPair, offCap, seed }) {
  // remove sábado para vermelho
  let allowed = isRed ? weekIndices.filter(i => !isSaturday(days[i].weekday)) : [...weekIndices];
  if (allowed.length === 0) allowed = [...weekIndices];

  // só dias com capacidade > 0
  allowed = allowed.filter(i => offCap[i] > 0);
  if (allowed.length < 2) {
    // se não der, use toda a semana (reparos posteriores seguram)
    allowed = [...weekIndices];
  }

  let pick = wantPair
    ? pickConsecutive(allowed, days, isRed, seed)
    : pickNonAdjacent(allowed, seed);

  // prioriza dias com mais capacidade
  const tryOrder = [...allowed].sort((a, b) => offCap[b] - offCap[a]);
  const mustBeNonAdj = !wantPair;

  // ajusta primeira escolha
  if (offCap[pick[0]] <= 0) {
    const alt = tryOrder.find(i => (i !== pick[1]) && (!mustBeNonAdj || Math.abs(i - pick[1]) !== 1));
    if (alt !== undefined) pick[0] = alt;
  }
  // ajusta segunda
  if (offCap[pick[1]] <= 0 || (mustBeNonAdj && Math.abs(pick[1] - pick[0]) === 1)) {
    const alt = tryOrder.find(i => (i !== pick[0]) && (!mustBeNonAdj || Math.abs(i - pick[0]) !== 1));
    if (alt !== undefined) pick[1] = alt;
  }

  // consome capacidade
  pick.forEach(i => { if (offCap[i] > 0) offCap[i]--; });
  return pick;
}

/**
 * Gera base do mês respeitando:
 *  - 2 folgas/semana por funcionário
 *  - somente 1 semana no mês com par colado por funcionário
 *  - vermelho nunca folga sábado
 *  - capacidade diária: offCap[i] = totalEmp - minStaff(weekday)
 */
export function assignBaseWorkDays(employees, { year, month }, opts = {}) {
  const days  = buildMonthDays(year, month);
  const weeks = splitByWeeks(year, month);
  const N     = employees.length;

  // capacidade de “quantos podem folgar” por dia
  const offCap = days.map(d => Math.max(0, N - minStaffForWeekday(d.weekday)));

  const schedules = {};
  employees.forEach((emp, empIdx) => {
    // padrão: trabalhando
    const perDay = new Array(days.length).fill(null).map(() => ({
      ...SHIFT_PRESETS[ROLE.PADRAO], nome: emp.nome, camisa: emp.camisa
    }));

    // escolhe deterministicamente a semana do PAR COLADO (espalha entre pessoas)
    const pairedWeek = weeks[(empIdx % weeks.length)]?.week ?? 1;

    // aloca semana a semana
    weeks.forEach((w, wi) => {
      const weekIndices = [];
      for (let i = w.start; i <= w.end; i++) weekIndices.push(i);

      const wantPair = (w.week === pairedWeek);
      const picks = placeWeekOffs({
        weekIndices, days,
        isRed: emp.camisa === "vermelha",
        wantPair,
        offCap,
        seed: empIdx * 123 + wi
      });

      picks.forEach(i => { perDay[i] = "FOLGA"; });
    });

    schedules[emp.nome] = perDay.map(x => x === "FOLGA" ? "FOLGA" : x);
  });

  return schedules;
}
