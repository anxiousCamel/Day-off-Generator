/** @module schedule/calendar */
const _cache = new Map();

/**
 * Retorna metadados dos dias do mês:
 * - weekday: 0..6 (0 = Domingo)
 * - weekIndex: índice real da semana dentro do mês, considerando o deslocamento do 1º dia
 */
export function buildMonthDays(year, month1to12) {
  const key = `${year}-${month1to12}`;
  if (_cache.has(key)) return _cache.get(key);

  const totalDays = new Date(year, month1to12, 0).getDate();
  const firstWeekday = new Date(year, month1to12 - 1, 1).getDay(); // 0..6 (Dom..Sáb)

  const days = [];
  for (let d = 1; d <= totalDays; d++) {
    const weekday = new Date(year, month1to12 - 1, d).getDay(); // 0..6
    const weekIndex = Math.floor((firstWeekday + (d - 1)) / 7) + 1; // semana real do mês
    days.push({ day: d, weekday, weekIndex });
  }
  _cache.set(key, days);
  return days;
}

export const isSaturday = (wd) => wd === 6;
export const isSunday   = (wd) => wd === 0;

/**
 * Divide o mês em semanas reais.
 * Retorna array de objetos { week, start, end }, onde start/end são índices (0-based) no array de days.
 */
export function splitByWeeks(year, month1to12) {
  const days = buildMonthDays(year, month1to12);
  const by = new Map();
  days.forEach((d, i) => {
    if (!by.has(d.weekIndex)) by.set(d.weekIndex, { start: i, end: i });
    else by.get(d.weekIndex).end = i;
  });
  return [...by.entries()].map(([week, range]) => ({ week, ...range }));
}
