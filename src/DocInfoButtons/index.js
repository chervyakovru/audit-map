import React from 'react';
import { useHistory } from 'react-router-dom';
import { MdHome } from 'react-icons/md';
import { ROUTES } from '../Consts';

import Button from '../Button';
import BoardPanel from '../BoardPanel';
import DownloadButton from './DownloadButton';

const DocInfoButton = ({ docTitle }) => {
  const history = useHistory();

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
      <DownloadButton />
    </BoardPanel>
  );
};

export default DocInfoButton;
