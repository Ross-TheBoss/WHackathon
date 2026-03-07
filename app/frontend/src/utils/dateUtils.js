export function formatDateShort(input) {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (!d || isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
}

export function formatTimeShort(input) {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (!d || isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: 'numeric' }).format(d);
}

export function formatEventTime(startISO, endISO) {
  if (!startISO) return '';
  const s = new Date(startISO);
  const e = endISO ? new Date(endISO) : null;
  if (!s || isNaN(s.getTime())) return '';
  if (!e || isNaN(e.getTime())) return `${formatDateShort(s)} · ${formatTimeShort(s)}`;
  if (s.toDateString() === e.toDateString()) {
    return `${formatDateShort(s)} · ${formatTimeShort(s)} – ${formatTimeShort(e)}`;
  }
  return `${formatDateShort(s)} ${formatTimeShort(s)} – ${formatDateShort(e)} ${formatTimeShort(e)}`;
}
