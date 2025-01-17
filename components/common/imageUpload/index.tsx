import { imageRepositories } from '@repositories/img';
import { ChangeEvent, useCallback } from 'react';

interface ImageUploadProps {
  isLoading?: boolean;
  setIsLoading?: (p: boolean) => void;
  setImageUrl: (url: string | null) => void;
}

export default function ImageUpload({
  setImageUrl,
  setIsLoading: setIsLoadingProto,
  ...pros
}: ImageUploadProps) {
  const setIsLoading = useCallback(
    (b: boolean) => {
      if (setIsLoadingProto) setIsLoadingProto(b);
    },
    [setIsLoadingProto],
  );

  const fileFormOnChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const curFiles = e.currentTarget.files;
      setIsLoading(true);
      try {
        if (curFiles) {
          const imgUrl = await imageRepositories.postImage(curFiles[0]);
          setImageUrl(imgUrl);
        } else {
          setImageUrl(null);
        }
      } catch (e) {
        console.log(e);
        alert('이미지 형식이 맞지 않습니다.');
      }
      setIsLoading(false);
    },
    [setImageUrl],
  );

  return <input type="file" className="form-control" onChange={fileFormOnChange} />;
}
