export function createId(prefix: string = "id"): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const ts = Date.now().toString(36);
  return `${prefix}-${ts}-${rand}`;
}
