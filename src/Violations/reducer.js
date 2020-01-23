export default function(store) {
  store.on('@init', () => ({
    violations: [
      {
        id: 0,
        text:
          'Выход из помещения насосной выполнить непосредственно наружу, или на лестничную клетку имеющий выход непосредственно наружу. (осн. 4.2.2. СП 10.13130.2009)'
      },
      {
        id: 1,
        text:
          'Выполнить противопожарной 2-го типа дверь пожарной насосной (подвальный этаж). (осн. 4.2.2. СП 10.13130.2009)'
      },
      {
        id: 2,
        text:
          'Противопожарную дверь вентиляционной камеры (подвальный этаж поз.12) оборудовать устройством самозакрывания и аншлагом, на котором указать категорию по взрывопожарной опасности и класс зон по ПУЭ. (осн. п. 20. «Правила противопожарного режима в Российской Федерации» утверждены постановлением Правительства Российской Федерации» от 25 апреля 2012 г. N 390 «О противопожарном режиме»)'
      }
    ]
  }));
  store.on('violations/set', (prevState, violations) => ({
    violations
  }));
}