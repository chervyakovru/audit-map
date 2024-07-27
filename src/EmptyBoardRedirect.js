import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { getLayersCollection } from './api';
import { ROUTES } from './Consts';

const EmptyBoardRedirect = () => {
  const history = useHistory();
  const { boardId } = useParams();
  const { user } = useStoreon('user');

  React.useEffect(() => {
    getLayersCollection(user.uid, boardId).onSnapshot(layersSnapshot => {
      history.replace(ROUTES.BOARD(boardId, layersSnapshot.docs[0].id));
    });
  }, []);

  return null;
};

export default EmptyBoardRedirect;
