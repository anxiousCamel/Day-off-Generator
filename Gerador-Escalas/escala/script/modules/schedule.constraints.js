/** @module schedule/constraints */
export const MAX_HOURS_PER_DAY = 10;
export const MAX_CONSEC_WORK_DAYS = 6;
export const WEEKLY_LIMIT_HOURS = 44;
export const MIN_SATURDAY_STAFF = 8;

export const ROLE = { ABERTURA: "ABERTURA", CENTRO: "CENTRO", PADRAO: "PADRAO" };

export const SHIFT_PRESETS = {
    [ROLE.ABERTURA]: { label: "08:00-17:13", hours: 8.22, role: ROLE.ABERTURA },
    [ROLE.CENTRO]: { label: "07:30-17:00", hours: 9.50, role: ROLE.CENTRO },
    [ROLE.PADRAO]: { label: "08:00-17:13", hours: 8.22, role: ROLE.PADRAO },
};

export function canFolgaOnSaturday(emp) { return emp.camisa === "cinza"; }
