import React from 'react';
import Header from '../Header';
import ViolationsList from '../ViolationsList';
import ViolationsDownloadButton from './ViolationsDownloadButton';

const MOCK_VIOLATIONS = [
  {
    text:
      'Выход из помещения насосной выполнить непосредственно наружу, или на лестничную клетку имеющий выход непосредственно наружу. (осн. 4.2.2. СП 10.13130.2009)',
    id: 0,
  },
  {
    text:
      'Выполнить противопожарной 2-го типа дверь пожарной насосной (подвальный этаж). (осн. 4.2.2. СП 10.13130.2009)',
    id: 1,
  },
  {
    text:
      'Противопожарную дверь вентиляционной камеры (подвальный этаж поз.12) оборудовать устройством самозакрывания и аншлагом, на котором указать категорию по взрывопожарной опасности и класс зон по ПУЭ. (осн. п. 20. «Правила противопожарного режима в Российской Федерации» утверждены постановлением Правительства Российской Федерации» от 25 апреля 2012 г. N 390 «О противопожарном режиме»)',
    id: 2,
  },
];

const Violations = () => {
  return (
    <>
      <Header />
      <div uk-height-viewport="offset-top: true" className="uk-section uk-section-small">
        <div className="uk-container uk-height-1-1 uk-position-relative">
          <ViolationsList
            originViolations={MOCK_VIOLATIONS}
            handleOriginTextChange={() => console.log('handleTextChange')}
          />
        </div>
        <div className="uk-margin-medium-bottom uk-position-large uk-position-bottom-right">
          <ViolationsDownloadButton />
        </div>
      </div>
    </>
  );
};

export default Violations;
