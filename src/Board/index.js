import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { MdHome } from 'react-icons/md';
import { AiOutlineDownload } from 'react-icons/ai';

import {
  getFileRef,
  getBoardsCollection,
  getPointsCollection,
  getThemesCollection,
  getERCollection
} from '../api';
import { ROUTES } from '../Consts';

import Map from '../Map';
import UploadFile from './UploadFile';
import Button from '../Button';
import BoardPanel from '../BoardPanel';

const getImageSize = (w, h) => {
  const { clientWidth, clientHeight } = document.documentElement;
  if (w < clientWidth && h < clientHeight) {
    return {
      width: w,
      height: h
    };
  }
  if (clientWidth < clientHeight) {
    const ratio = h / w;
    return {
      width: clientWidth * 0.9,
      height: clientWidth * 0.9 * ratio
    };
  }
  const ratio = w / h;
  return {
    width: clientHeight * 0.9 * ratio,
    height: clientHeight * 0.9
  };
};

const Board = () => {
  const history = useHistory();
  const { docId } = useParams();
  const { user } = useStoreon('user');

  const [doc, setDoc] = React.useState({ data: {}, loaded: false });
  const [points, setPoints] = React.useState({ data: [], loaded: false });
  const [image, setImage] = React.useState({
    data: {
      src: '',
      width: 0,
      height: 0
    },
    loaded: false,
    exists: false
  });
  const formRef = React.useRef(null);
  const [requestValue, setRequestValue] = React.useState('');

  React.useEffect(() => {
    if (requestValue.length !== 0) {
      formRef.current.submit();
    }
  }, [requestValue]);

  React.useEffect(() => {
    return getBoardsCollection(user.uid)
      .doc(docId)
      .onSnapshot(snapshot => {
        const fetchedDocument = {
          ...snapshot.data(),
          id: snapshot.id
        };
        setDoc({ data: fetchedDocument, loaded: true });
      });
  }, []);

  React.useEffect(() => {
    if (!doc.loaded) return;
    if (!doc.data.mapName) {
      setImage({
        ...image,
        loaded: true,
        exists: false
      });
    } else {
      getFileRef(user.uid, docId, doc.data.mapName)
        .getDownloadURL()
        .then(url => {
          const tmpImg = new Image();
          tmpImg.addEventListener('load', () => {
            const imageSize = getImageSize(tmpImg.width, tmpImg.height);
            setImage({
              data: {
                src: url,
                ...imageSize
              },
              loaded: true,
              exists: true
            });
          });
          tmpImg.src = url;
        });
    }
  }, [doc]);

  React.useEffect(() => {
    getPointsCollection(user.uid, docId)
      .get()
      .then(querySnapshot => {
        const fetchedPoints = querySnapshot.docs.map(point => ({
          id: point.id,
          ...point.data()
        }));
        setPoints({ data: fetchedPoints, loaded: true });
      });
  }, []);

  const downloadDocument = () => {
    const pointsRequest = getPointsCollection(user.uid, docId).get();
    const documentRequest = getBoardsCollection(user.uid)
      .doc(docId)
      .get();
    const themesRequest = getThemesCollection().get();
    const violationsRequest = getERCollection().get();

    Promise.all([
      documentRequest,
      pointsRequest,
      themesRequest,
      violationsRequest
    ]).then(response => {
      const fetchedPoints = response[1].docs.map(point => point.data());
      const fetchedThemes = response[2].docs.reduce((acc, theme) => {
        const data = theme.data();
        return { ...acc, [data.id]: data.text };
      }, {});
      const fetchedViolations = response[3].docs.map(violation =>
        violation.data()
      );

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

  if (!doc.loaded || !image.loaded || !points.loaded) {
    return (
      <div className="main">
        <div className="uk-position-center uk-text-center">
          <div uk-spinner="ratio: 2" />
        </div>
      </div>
    );
  }

  return (
    <>
      <BoardPanel title={doc.data.name}>
        <Button onClick={() => history.push(ROUTES.HOME)} tooltip="На главную">
          <MdHome size="25px" />
        </Button>
        <Button onClick={downloadDocument} tooltip="Скачать документ">
          <form
            style={{ display: 'none' }}
            method="POST"
            action="/api/word/createDocument.php"
            ref={formRef}
          >
            <input type="hidden" name="violations" value={requestValue} />
          </form>
          <AiOutlineDownload size="25px" />
        </Button>
      </BoardPanel>
      {!image.exists ? (
        <UploadFile />
      ) : (
        <Map
          defaultDocument={doc.data}
          defaultPoints={points.data}
          image={image.data}
        />
      )}
    </>
  );
};

export default Board;
