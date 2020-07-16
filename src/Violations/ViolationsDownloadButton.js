import React from 'react';

import { AiOutlineDownload } from 'react-icons/ai';

const ViolationsDownloadButton = () => {
  const [requestValue, setRequestValue] = React.useState('');
  const formRef = React.useRef(null);

  React.useEffect(() => {
    // getting violations
    /*
    getPointsCollection(user.uid, boardId, layerId).onSnapshot(querySnapshot => {
      const fetchedPoints = querySnapshot.docs.map(point => ({
        id: point.id,
        ...point.data(),
      }));
      setPoints({ data: fetchedPoints, loaded: true });
    });
    */
  }, []);

  React.useEffect(() => {
    if (requestValue.length !== 0) {
      // formRef.current.submit();
    }
  }, [requestValue]);

  const downloadDocument = () => {
    console.log('downloadDocument');
    /*
    const pointsRequest = getPointsCollection(user.uid, boardId, layerId).get();
    const documentRequest = getBoardsCollection(user.uid)
      .doc(boardId)
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
     */
    setRequestValue(JSON.stringify(['hello']));
  };

  return (
    <div
      className="uk-card uk-card-default uk-card-hover uk-card-body uk-card-small uk-border-circle"
      role="button"
      onClick={downloadDocument}
      onKeyDown={() => {}}
      tabIndex={0}
      tooltip="Скачать документ"
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <form style={{ display: 'none' }} method="POST" action="/api/word/createDocument.php" ref={formRef}>
        <input type="hidden" name="violations" value={requestValue} />
      </form>
      <AiOutlineDownload size="25px" />
    </div>
  );
};

export default ViolationsDownloadButton;
