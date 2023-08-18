import defaultImg from '@images/img_thumb@2x.png';
import Image from 'next/image';
import { useMemo, useState } from 'react';

/** image load error 일 경우 default image 표시 component */
export default function ImageFallback({
  src,
  width,
  height,
}: {
  src: string;
  width?: number | string;
  height?: number | string;
}) {
  const [loadError, setLoadError] = useState<boolean>(false);
  const imageStyle = useMemo(() => {
    const style = { width: width ?? 'auto', height: height ?? 'auto' };
    return style;
  }, []);

  return (
    <Image
      src={loadError ? defaultImg : src}
      height={0}
      width={0}
      alt="image"
      style={imageStyle}
      onError={() => {
        console.log(src);
        console.log('is image error');
        setLoadError(true);
      }}
    />
  );
}
