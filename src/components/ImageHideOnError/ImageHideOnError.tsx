import { useRef, useState, useEffect } from 'react';

const ImageHideOnError = ({
  alt,
  ...props
}: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const $img = imgRef.current;
    if (!visible || ($img?.complete && $img.naturalWidth + $img.naturalHeight === 0)) {
      $img?.style.setProperty('display', 'none');
    }
  }, [visible]);

  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={imgRef} onError={(e) => setVisible(false)} alt={alt} {...props} />;
};

export default ImageHideOnError;
