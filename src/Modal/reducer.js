export default function(store) {
  store.on('@init', () => ({ currentPointId: null }));
  store.on('currentPoint/seId', (prevState, id) => ({
    currentPointId: id
  }));
}
