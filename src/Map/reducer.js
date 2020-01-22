export default function(store) {
  store.on('@init', () => ({ points: [] }));
  store.on('points/add', (prevState, newPoint) => ({
    points: [...prevState.points, newPoint]
  }));
  store.on('points/pop', prevState => ({
    points: prevState.points.slice(0, -1)
  }));
}
