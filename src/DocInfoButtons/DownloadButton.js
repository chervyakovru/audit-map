import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { AiOutlineDownload } from 'react-icons/ai';

import {
  getBoardsCollection,
  getLayersCollection,
  getPointsCollection,
  getThemesCollection,
  getERCollection,
} from '../api';

import Button from '../Button';

const DownloadButton = () => {
  const { boardId, layerId } = useParams();
  const { user } = useStoreon('user');

  const [points, setPoints] = React.useState({ data: [], loaded: false });
  const [layer, setLayer] = React.useState({ data: {}, loaded: false });

  const [requestValue, setRequestValue] = React.useState('');
  const formRef = React.useRef(null);

  React.useEffect(() => {
    return getLayersCollection(user.uid, boardId)
      .doc(layerId)
      .onSnapshot(layerSnapshot => {
        const fetchedLayer = {
          ...layerSnapshot.data(),
          id: layerSnapshot.id,
        };

        setLayer({ data: fetchedLayer, loaded: true });
      });
  }, [layerId]);

  React.useEffect(() => {
    if (!layer.data.mapName) {
      setPoints({ data: [], loaded: true });
      return;
    }
    getPointsCollection(user.uid, boardId, layerId).onSnapshot(querySnapshot => {
      const fetchedPoints = querySnapshot.docs.map(point => ({
        id: point.id,
        ...point.data(),
      }));
      setPoints({ data: fetchedPoints, loaded: true });
    });
  }, [layer]);

  React.useEffect(() => {
    if (requestValue.length !== 0) {
      formRef.current.submit();
    }
  }, [requestValue]);

  const downloadDocument = () => {
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

      const fetchedViolations = response[3].docs.reduce((acc, violation) => {
        acc[violation.id] = violation.data();
        return acc;
      }, {});

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
    <Button disabled={points.data.length === 0} onClick={downloadDocument} tooltip="Скачать документ">
      <form style={{ display: 'none' }} method="POST" action="/api/word/createDocument.php" ref={formRef}>
        <input type="hidden" name="violations" value={requestValue} />
      </form>
      <AiOutlineDownload size="25px" />
    </Button>
  );
};

export default DownloadButton;
