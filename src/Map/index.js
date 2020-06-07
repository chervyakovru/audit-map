/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useParams, useLocation } from 'react-router-dom';
import useStoreon from 'storeon/react';
import UIkit from 'uikit';

import { getBoardsCollection, getPointsCollection } from '../api';
import { getRounded } from '../utils';

import DocInfoButton from '../DocInfoButtons';
import ZoomButtons from './ZoomButtons';
import Point from './Point';
import Modal from './Modal';

import styles from './Map.module.css';

const handleKeyPress = () => {};

const MapComponent = ({ defaultDocument, defaultPoints, image }) => {
  const { boardId } = useParams();
  const location = useLocation();
  const { user } = useStoreon('user');

  const [dragging, setDragging] = React.useState(false);
  const [doc, setDoc] = React.useState(defaultDocument);
  const [points, setPoints] = React.useState(defaultPoints);

  const mapRef = React.useRef(null);

  React.useEffect(() => {
    getBoardsCollection(user.uid)
      .doc(boardId)
      .onSnapshot(snapshot => {
        const fetchedDocument = {
          ...snapshot.data(),
          id: snapshot.id,
        };
        setDoc(fetchedDocument);
      });
  }, []);

  React.useEffect(() => {
    getPointsCollection(user.uid, boardId).onSnapshot(querySnapshot => {
      const fetchedPoints = querySnapshot.docs.map(point => ({
        id: point.id,
        ...point.data(),
      }));
      setPoints(fetchedPoints);
    });
  }, []);

  const onPanning = () => {
    setDragging(true);
  };

  const onPanningStop = () => {
    setTimeout(() => {
      setDragging(false);
    }, 100);
  };

  const onClick = e => {
    if (dragging) return;

    const rect = mapRef.current.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    const percentX = getRounded((posX / rect.width) * 100);
    const percentY = getRounded((posY / rect.height) * 100);

    const newPoint = {
      x: percentX,
      y: percentY,
      name: `Новая точка`,
      violationsId: [],
    };

    const pointsCollection = getPointsCollection(user.uid, boardId);
    pointsCollection.add(newPoint);
  };

  const onDeletePoint = point => {
    UIkit.modal
      .confirm(`Вы уверены, что хотите удалить точку "${point.name}"?`, {
        labels: { cancel: 'Отмена', ok: 'Да' },
        bgClose: true,
        escClose: true,
      })
      .then(() => {
        const pointRef = getPointsCollection(user.uid, boardId).doc(point.id);
        pointRef.delete();
      });
  };

  const modalPointId = location.state && location.state.modalPointId;

  return (
    <>
      <TransformWrapper
        options={{
          limitToBounds: false,
          minScale: 0.5,
        }}
        doubleClick={{
          disabled: true,
        }}
        wheel={{
          step: 50,
        }}
        zoomIn={{
          step: 10,
        }}
        defaultScale={1}
        onPanning={onPanning}
        onPanningStop={onPanningStop}
      >
        {({ zoomIn, zoomOut, resetTransform, scale }) => (
          <>
            <DocInfoButton boardId={doc.id} docTitle={doc.name} />
            <ZoomButtons zoomIn={zoomIn} zoomOut={zoomOut} scale={scale} resetTransform={resetTransform} />
            <TransformComponent>
              <div
                ref={mapRef}
                onClick={onClick}
                onKeyPress={handleKeyPress}
                className={styles.mapContainer}
                style={{
                  width: `${image.width}px`,
                  height: `${image.height}px`,
                  backgroundImage: `url(${image.src})`,
                }}
              >
                {points.map(point => (
                  <Point
                    key={point.id}
                    onDeletePoint={onDeletePoint}
                    userId={user.uid}
                    boardId={boardId}
                    scale={scale}
                    point={point}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      {modalPointId && <Modal boardId={doc.id} pointId={modalPointId} />}
    </>
  );
};

export default MapComponent;
