/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { getFileRef, getBoardsCollection } from '../api';

const UploadFile = () => {
  const { docId } = useParams();
  const [loading, setIsLoading] = React.useState(false);
  const { user } = useStoreon('user');

  const uploadFileToFB = file => {
    const mapRef = getFileRef(user.uid, docId, file.name);

    const uploadTask = mapRef.put(file);

    uploadTask.on(
      'state_changed',
      () => {},
      () => {
        setIsLoading(false);
      },
      () => {
        const documentRef = getBoardsCollection(user.uid).doc(docId);
        documentRef.update({
          mapName: uploadTask.snapshot.ref.name,
        });
      }
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDropAccepted: async acceptedFiles => {
      setIsLoading(true);
      const file = acceptedFiles[0];
      uploadFileToFB(file);
    },
    preventDropOnDocument: false,
  });

  return (
    <div className="main cursor-pointer">
      <div {...getRootProps({ className: 'uk-width-1-1 uk-height-1-1' })}>
        <input {...getInputProps()} />
        {loading ? (
          <div className="uk-position-center">
            <div uk-spinner="ratio: 2" />
          </div>
        ) : (
          <div
            className="
            uk-placeholder
            uk-text-center
            uk-position-center
            uk-padding"
          >
            <span className="uk-margin-small-right" uk-icon="icon: cloud-upload" />
            <span className="uk-text-middle">Перетащите файл в окно браузера или нажмите в любом месте</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
