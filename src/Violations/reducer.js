export default function(store) {
  store.on('@init', () => ({
    violations: [],
  }));
  store.on('violations/set', (prevState, violations) => ({
    violations,
  }));
}
