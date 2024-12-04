import { useCallback, useState } from 'react';

interface ImageUploadProps {
  setImageUrl: (url: string) => void;
}

export default function ImageUpload({ setImageUrl }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useCallback(
    (fl: File) => {
      setIsLoading(true);

      try {
      } catch (e) {}

      setIsLoading(false);
    },
    [setIsLoading],
  );

  return <input type="file" className="form-control" onChange={(e) => {}} />;
}
