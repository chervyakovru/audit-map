export default function(store) {
  store.on('@init', () => ({
    user: null,
  }));
  store.on('user/set', (prevState, user) => ({
    user,
  }));
}
