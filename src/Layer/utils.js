const INIT_IMAGE_SCALE = 0.9;

export function getRotatedImageData(url) {
  return new Promise(resolve => {
    const tmpImg = new Image();
    tmpImg.crossOrigin = 'anonymous';
    // eslint-disable-next-line func-names
    tmpImg.addEventListener('load', function() {
      const canvas = document.createElement('canvas');

      canvas.width = this.height;
      canvas.height = this.width;

      const ctx = canvas.getContext('2d');
      ctx.transform(0, 1, -1, 0, this.height, 0);
      ctx.drawImage(this, 0, 0, this.width, this.height);

      canvas.toBlob(blob => {
        resolve({ blob, width: canvas.width, height: canvas.height });
      });
    });
    tmpImg.src = url;
  });
}

export function getRotatedCoordinate(x, y) {
  const newX = -y < 0 ? -y + 100 : -y;
  const newY = x < 0 ? x + 100 : x;
  return [newX, newY];
}

export function getImageSizeFromUrl(url) {
  return new Promise(resolve => {
    const tmpImg = new Image();
    // eslint-disable-next-line func-names
    tmpImg.addEventListener('load', function() {
      const { width, height } = this;
      resolve({ width, height });
    });
    tmpImg.src = url;
  });
}

export function getFitScreenImageSize(screenSize, imageSize) {
  const { clientWidth, clientHeight } = screenSize;
  const { width: imageWidth, height: imageHeight } = imageSize;

  if (imageWidth < clientWidth && imageHeight < clientHeight) {
    return {
      width: imageWidth,
      height: imageHeight,
    };
  }

  if (clientWidth < clientHeight) {
    const ratio = imageHeight / imageWidth;
    return {
      width: clientWidth * INIT_IMAGE_SCALE,
      height: clientWidth * INIT_IMAGE_SCALE * ratio,
    };
  }

  const ratio = imageWidth / imageHeight;
  return {
    width: clientHeight * INIT_IMAGE_SCALE * ratio,
    height: clientHeight * INIT_IMAGE_SCALE,
  };
}
