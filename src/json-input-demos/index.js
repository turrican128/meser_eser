// Auto-loads every *.json file in this folder. Drop a new file here and it
// becomes available as ?mock=<filename-without-extension>.
const modules = import.meta.glob('./*.json', { eager: true, import: 'default' });

export const demos = Object.fromEntries(
  Object.entries(modules).map(([path, data]) => {
    const name = path.replace(/^\.\//, '').replace(/\.json$/, '');
    return [name, data];
  })
);

export const DEFAULT_DEMO = 'yoga';

export function getDemo(name) {
  if (name && demos[name]) return demos[name];
  return demos[DEFAULT_DEMO] ?? Object.values(demos)[0];
}

export function listDemoNames() {
  return Object.keys(demos);
}
