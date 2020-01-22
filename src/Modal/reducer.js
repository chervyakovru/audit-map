export default function(store) {
  store.on('@init', () => ({ currentPointId: null }));
  store.on('currentPoint/setId', (prevState, id) => ({
    currentPointId: id
  }));
}
