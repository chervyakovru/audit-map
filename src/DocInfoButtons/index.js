import React from 'react';
import { useHistory } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { MdHome } from 'react-icons/md';
import { AiOutlineDownload } from 'react-icons/ai';

import { getBoardsCollection, getPointsCollection, getThemesCollection, getERCollection } from '../api';
import { ROUTES } from '../Consts';

import Button from '../Button';
import BoardPanel from '../BoardPanel';

const DocInfoButton = ({ docId, layerId, docTitle }) => {
  const history = useHistory();
  const { user } = useStoreon('user');
  const [requestValue, setRequestValue] = React.useState('');
  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (requestValue.length !== 0) {
      formRef.current.submit();
    }
  }, [requestValue]);

  const downloadDocument = () => {
    const pointsRequest = getPointsCollection(user.uid, docId, layerId).get();
    const documentRequest = getBoardsCollection(user.uid)
      .doc(docId)
      .get();
    const themesRequest = getThemesCollection().get();
    const violationsRequest = getERCollection().get();

    Promise.all([documentRequest, pointsRequest, themesRequest, violationsRequest]).then(response => {
      const fetchedPoints = response[1].docs.map(point => point.data());
      const fetchedThemes = response[2].docs.reduce((acc, theme) => {
        const data = theme.data();
        return { ...acc, [data.id]: data.text };
      }, {});
      const fetchedViolations = response[3].docs.map(violation => violation.data());

      const request = {};

      fetchedPoints.forEach(point => {
        point.violationsId.forEach(violationId => {
          const violation = fetchedViolations[violationId];
          const theme = fetchedThemes[violation.theme_id];
          if (!(theme in request)) {
            request[theme] = [];
          }
          const text = `${violation.text} (${point.name})`;
          request[theme].push({ text });
        });
      });

      setRequestValue(JSON.stringify(request));
    });
  };

  return (
    <BoardPanel position="top-left">
      <Button onClick={() => history.push(ROUTES.HOME)} tooltip="На главную">
        <MdHome size="25px" />
      </Button>
      <div className="uk-flex uk-flex-middle">
        <h3
          style={{
            borderLeft: '1px solid #e5e5e5',
            borderRight: '1px solid #e5e5e5',
          }}
          className="
            uk-margin-remove
            uk-display-block
            uk-padding-small
            uk-padding-remove-top
            uk-padding-remove-bottom
            "
        >
          {docTitle}
        </h3>
      </div>
      <Button onClick={downloadDocument} tooltip="Скачать документ">
        <form style={{ display: 'none' }} method="POST" action="/api/word/createDocument.php" ref={formRef}>
          <input type="hidden" name="violations" value={requestValue} />
        </form>
        <AiOutlineDownload size="25px" />
      </Button>
    </BoardPanel>
  );
};

export default DocInfoButton;
