import { imageRepositories } from '@repositories/img';
import { ChangeEvent, useCallback, useState } from 'react';

interface ImageUploadProps {
  isLoading?: boolean;
  setIsLoading?: (p: boolean) => void;
  setImageUrl: (url: string | null) => void;
}

export default function ImageUpload({
  setImageUrl,
  setIsLoading: setIsLoadingProto,
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
      } catch (e) {}
      setIsLoading(false);
    },
    [setImageUrl],
  );

  return <input type="file" className="form-control" onChange={fileFormOnChange} />;
}
