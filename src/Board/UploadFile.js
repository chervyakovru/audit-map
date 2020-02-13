/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useDropzone } from 'react-dropzone';
import firebase from '../firebase';
import { getDocRef } from '../api';

const UploadFile = ({ docId, setImage }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const uploadFileToFB = file => {
    return new Promise((resolve, reject) => {
      const storage = firebase.storage();
      const storageRef = storage.ref();
      const mapRef = storageRef.child(`${docId}/images/map.jpg`);

      const uploadTask = mapRef.put(file);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Handle newProgress update. progress: ', progress);
        },
        error => {
          console.log('Handle unsuccessful uploads. error: ', error);
          reject(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDragEnter: () => console.log('onDragEnter'),
    onDragLeave: () => console.log('onDragLeave'),
    onDropAccepted: async acceptedFiles => {
      setIsLoading(true);
      const file = acceptedFiles[0];
      try {
        const url = await uploadFileToFB(file);
        const docRef = getDocRef(docId);
        docRef.update({
          image: url
        });
        setImage(url);
      } catch (error) {
        setIsLoading(false);
      }
    },
    onDropRejected: () => console.log('onDropRejected'),
    preventDropOnDocument: false
  });

  if (isLoading) {
    return (
      <div className="main">
        <div className="uk-position-center">
          <div uk-spinner="ratio: 3" />
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div {...getRootProps({ className: 'uk-width-1-1 uk-height-1-1' })}>
        <input {...getInputProps()} />
        <div className="k-placeholder uk-text-center uk-position-center">
          <span uk-icon="icon: cloud-upload" />{' '}
          <span className="uk-text-middle">
            Перетащите файл в окно браузера или нажмите в любом месте
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
