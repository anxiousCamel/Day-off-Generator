/** @module schedule/repair */
import { ROLE, SHIFT_PRESETS, MIN_SATURDAY_STAFF } from "./schedule.constraints.js";
import { buildMonthDays, isSaturday, isSunday } from "./schedule.calendar.js";

/** Sábado: vermelho trabalha; garante >=8 no sábado. */
export function ensureSaturdayRule(employees, perEmp, ym) {
    const days = buildMonthDays(ym.year, ym.month);

    // Vermelhos não folgam no sábado
    days.forEach((d, idx) => {
        if (!isSaturday(d.weekday)) return;
        employees.forEach(emp => {
            if (emp.camisa === "vermelha" && perEmp[emp.nome][idx] === "FOLGA") {
                perEmp[emp.nome][idx] = { ...SHIFT_PRESETS.PADRAO, nome: emp.nome, camisa: emp.camisa };
            }
        });
    });

    // Mínimo de 8
    days.forEach((d, idx) => {
        if (!isSaturday(d.weekday)) return;
        const working = Object.values(perEmp).filter(a => a[idx] !== "FOLGA");
        let need = MIN_SATURDAY_STAFF - working.length;
        if (need <= 0) return;
        for (const emp of employees.filter(e => e.camisa === "cinza")) {
            if (perEmp[emp.nome][idx] === "FOLGA") {
                perEmp[emp.nome][idx] = { ...SHIFT_PRESETS.PADRAO, nome: emp.nome, camisa: emp.camisa };
                if (--need === 0) break;
            }
        }
    });
}

/** Garante 1 cinza na ABERTURA e 1 cinza no CENTRO (distintos) em dias úteis. */
export function injectGreyCoverage(employees, perEmp, ym) {
    const days = buildMonthDays(ym.year, ym.month);
    const greys = employees.filter(e => e.camisa === "cinza");

    days.forEach((d, idx) => {
        if (isSunday(d.weekday)) return;
        const workingGreys = greys.filter(g => perEmp[g.nome][idx] !== "FOLGA");
        if (workingGreys.length === 0) return;
        const a = workingGreys[0];
        const c = workingGreys.find(w => w.nome !== a.nome) || workingGreys[0];
        perEmp[a.nome][idx] = { ...SHIFT_PRESETS.ABERTURA, nome: a.nome, camisa: a.camisa, role: ROLE.ABERTURA };
        perEmp[c.nome][idx] = { ...SHIFT_PRESETS.CENTRO, nome: c.nome, camisa: c.camisa, role: ROLE.CENTRO };
    });
}

/** No máximo 6 dias seguidos. */
export function enforceMaxSixStreak(perEmp) {
    for (const [_, days] of Object.entries(perEmp)) {
        let streak = 0;
        for (let i = 0; i < days.length; i++) {
            if (days[i] === "FOLGA") { streak = 0; continue; }
            if (++streak > 6) { days[i] = "FOLGA"; streak = 0; }
        }
    }
}

/** Dia não pode ficar vazio. */
export function ensureNoEmptyStore(employees, perEmp, ym) {
    const days = buildMonthDays(ym.year, ym.month);
    days.forEach((_, idx) => {
        const working = Object.values(perEmp).filter(a => a[idx] !== "FOLGA");
        if (working.length) return;
        const red = employees.find(e => e.camisa === "vermelha" && perEmp[e.nome][idx] === "FOLGA");
        const any = employees.find(e => perEmp[e.nome][idx] === "FOLGA");
        const pick = red || any;
        if (pick) perEmp[pick.nome][idx] = { ...SHIFT_PRESETS.PADRAO, nome: pick.nome, camisa: pick.camisa };
    });
}

/** 1 sábado de folga (só cinza) e 2 folgas seguidas no mês. */
export function ensureMonthlySaturdayOffAnd2Consecutive(employees, perEmp, ym) {
    const days = buildMonthDays(ym.year, ym.month);
    employees.forEach(emp => {
        // sábado de folga (só cinza)
        if (emp.camisa === "cinza") {
            const sats = days.map((d, i) => ({ d, i })).filter(x => isSaturday(x.d.weekday));
            const has = sats.some(x => perEmp[emp.nome][x.i] === "FOLGA");
            if (!has) {
                for (const s of sats) {
                    const count = Object.values(perEmp).filter(a => a[s.i] !== "FOLGA").length;
                    if (count > 8) { perEmp[emp.nome][s.i] = "FOLGA"; break; }
                }
            }
        }
        // 2 dias seguidos
        const arr = perEmp[emp.nome];
        let ok = false; for (let i = 0; i < arr.length - 1; i++) { if (arr[i] === "FOLGA" && arr[i + 1] === "FOLGA") { ok = true; break; } }
        if (!ok) {
            for (let i = 0; i < arr.length - 1; i++) { if (arr[i] !== "FOLGA" && arr[i + 1] !== "FOLGA") { arr[i + 1] = "FOLGA"; break; } }
        }
    });
}
